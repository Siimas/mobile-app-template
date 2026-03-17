import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useCustomerInfo } from '@/hooks/use-customer-info';

export default function AppLayout() {
  usePushNotifications();
  const { isLoaded, isSignedIn } = useAuth();

  const onboardingData = useQuery(api.onboardingResponses.getMyOnboarding, {});
  const customerInfo = useCustomerInfo();

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

  if (customerInfo === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const hasEntitlement = Object.keys(customerInfo?.entitlements?.active ?? {}).length > 0;
  if (!hasEntitlement) return <Redirect href="/paywall" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
