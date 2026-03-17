import '../polyfills'; // must be first — polyfills navigator.onLine before Clerk loads
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, usePathname, useGlobalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { RevenueCatProvider } from '../components/RevenueCatProvider';
import { PostHogProvider } from 'posthog-react-native';
import { posthog } from '../lib/config/posthog';
import * as Sentry from '@sentry/react-native';

import * as SecureStore from 'expo-secure-store';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

Sentry.init({
  dsn: 'https://18e4c6f8a05f6aea09bda442819626d8@o4508298540154880.ingest.de.sentry.io/4511027499040848',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Create a Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
  );
}

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

function RootLayoutInner() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  // Manual screen tracking for expo-router
  // @see https://docs.expo.dev/router/reference/screen-tracking/
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false, // Manual tracking with expo-router
        captureTouches: true,
        propsToCapture: ['testID'],
        maxElementsCaptured: 20,
      }}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ClerkLoaded>
            <RevenueCatProvider>
              <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </SafeAreaProvider>
            </RevenueCatProvider>
          </ClerkLoaded>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </PostHogProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  return <RootLayoutInner />;
});
