import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { ConvexReactClient, ConvexProviderWithAuth } from 'convex/react';
import { RevenueCatProvider } from '../components/RevenueCatProvider';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

function useAuthFromClerk() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) =>
      getToken({ template: 'convex', skipCache: forceRefreshToken }),
  };
}

export default function RootLayout() {
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
}
