import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useAuth } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const API_KEY =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS!
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID!;

type RevenueCatContextType = { isSynced: boolean; isActiveFromSDK: boolean };
const RevenueCatContext = createContext<RevenueCatContextType>({ isSynced: true, isActiveFromSDK: false });

export function useRevenueCat() {
  return useContext(RevenueCatContext);
}

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [syncedUserId, setSyncedUserId] = useState<string | null>(null);
  const isSynced = !userId || syncedUserId === userId;
  const [isActiveFromSDK, setIsActiveFromSDK] = useState(false);
  const linkAnonymousOnboarding = useMutation(api.onboardingResponses.linkAnonymousOnboarding);

  useEffect(() => {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }
    Purchases.configure({ apiKey: API_KEY });
  }, []);

  useEffect(() => {
    if (typeof userId !== 'string' || userId.length === 0) {
      setSyncedUserId(null);
      setIsActiveFromSDK(false);
      return;
    }
    let isCancelled = false;

    async function syncIdentity() {
      try {
        const currentAppUserId = await Purchases.getAppUserID();
        const anonymousOwnerKey =
          currentAppUserId && currentAppUserId !== userId ? currentAppUserId : null;

        const { customerInfo } = await Purchases.logIn(userId!);

        const active = Object.values(customerInfo.entitlements.active).length > 0;
        if (!isCancelled) {
          setIsActiveFromSDK(active);
          setSyncedUserId(userId!);
        }

        if (!isCancelled && anonymousOwnerKey) {
          await linkAnonymousOnboarding({ anonymousOwnerKey });
        }
      } catch (err) {
        console.error('[RevenueCat] identity sync failed:', err);
        // Do not mark as synced on failure — keep isSynced false.
      }
    }

    syncIdentity();

    return () => {
      isCancelled = true;
    };
  }, [userId, linkAnonymousOnboarding]);

  return (
    <RevenueCatContext.Provider value={{ isSynced, isActiveFromSDK }}>
      {children}
    </RevenueCatContext.Provider>
  );
}
