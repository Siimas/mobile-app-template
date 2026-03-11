import '../polyfills'; // must be first — polyfills navigator.onLine before Clerk loads
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { ConvexReactClient, ConvexProviderWithAuth } from 'convex/react';
import { RevenueCatProvider } from '../components/RevenueCatProvider';
import * as Sentry from '@sentry/react-native';

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

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function useAuthFromClerk() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      try {
        return await getToken({ template: 'convex', skipCache: forceRefreshToken });
      } catch {
        return null;
      }
    },
  };
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromClerk}>
        <RevenueCatProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </RevenueCatProvider>
      </ConvexProviderWithAuth>
    </ClerkProvider>
  );
});
