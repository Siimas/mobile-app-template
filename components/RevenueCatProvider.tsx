import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useAuth } from '@clerk/expo';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const API_KEY =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS!
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID!;

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const linkAnonymousOnboarding = useMutation(api.onboardingResponses.linkAnonymousOnboarding);

  useEffect(() => {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }
    Purchases.configure({ apiKey: API_KEY });
  }, []);

  useEffect(() => {
    if (typeof userId !== 'string' || userId.length === 0) return;
    const clerkUserId: string = userId;

    let isCancelled = false;

    async function syncIdentity() {
      try {
        const currentAppUserId = await Purchases.getAppUserID();
        const anonymousOwnerKey =
          currentAppUserId && currentAppUserId !== clerkUserId ? currentAppUserId : null;

        await Purchases.logIn(clerkUserId);

        if (!isCancelled && anonymousOwnerKey) {
          await linkAnonymousOnboarding({ anonymousOwnerKey });
        }
      } catch (err) {
        console.error('[RevenueCat] identity sync failed:', err);
      }
    }

    syncIdentity();

    return () => {
      isCancelled = true;
    };
  }, [userId, linkAnonymousOnboarding]);

  return <>{children}</>;
}
