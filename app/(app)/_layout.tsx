import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { usePushNotifications } from '@/hooks/use-push-notifications';

export default function AppLayout() {
  usePushNotifications();
  const { isLoaded, isSignedIn } = useAuth();

  const onboardingData = useQuery(api.onboardingResponses.getMyOnboarding, {});
  const activeEntitlements = useQuery(api.revenuecat.getMyActiveEntitlements, {});

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!isSignedIn) return <Redirect href="/login" />;

  if (onboardingData === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Onboarding not completed
  if (!onboardingData?.completedAt) return <Redirect href="/onboarding" />;

  if (activeEntitlements === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (activeEntitlements.length === 0) return <Redirect href="/paywall" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
