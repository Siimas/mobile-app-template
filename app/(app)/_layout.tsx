import { useAuth } from '@clerk/expo';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const onboardingData = useQuery(
    api.onboardingResponses.getMyOnboardingByAuth,
    isSignedIn ? {} : 'skip'
  );

  // Clerk still loading
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Not signed in → login
  if (!isSignedIn) return <Redirect href="/login" />;

  // Query in flight
  if (onboardingData === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Onboarding not completed
  if (!onboardingData?.completedAt) return <Redirect href="/onboarding" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
