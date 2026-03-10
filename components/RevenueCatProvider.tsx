import { useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useAuth } from '@clerk/expo';

const API_KEY =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS!
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID!;

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();

  useEffect(() => {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    }
    Purchases.configure({ apiKey: API_KEY });
  }, []);

  useEffect(() => {
    if (userId) {
      Purchases.logIn(userId).catch((err) =>
        console.error('[RevenueCat] logIn failed:', err)
      );
    }
  }, [userId]);

  return <>{children}</>;
}
