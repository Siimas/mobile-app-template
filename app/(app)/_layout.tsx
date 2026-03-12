import { Stack, router } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRevenueCat } from '../../components/RevenueCatProvider';
import { deriveOnboardingGateState } from '@/lib/navigation/onboarding-gate';

const ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID?.trim();

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isSynced, isActiveFromSDK } = useRevenueCat();

  const remoteData = useQuery(api.onboardingResponses.getMyOnboarding, isSignedIn ? {} : 'skip');
  const meData = useQuery(api.users.getMe, isSignedIn ? {} : 'skip');
  const entitlements = useQuery(api.revenuecat.getMyActiveEntitlements, isSignedIn ? {} : 'skip');

  const onboardingGate = deriveOnboardingGateState({
    isAuthLoaded: isLoaded,
    isSignedIn,
    remoteData,
    meData,
  });

  const isSubLoading = isSignedIn ? !isSynced || entitlements === undefined : false;
  const isActiveFromConvex = ENTITLEMENT_ID
    ? entitlements?.some((e) => e.entitlementId === ENTITLEMENT_ID) ?? false
    : (entitlements?.length ?? 0) > 0;
  const isActive = isActiveFromSDK || isActiveFromConvex;

  const isGuardLoading =
    !isLoaded || (isSignedIn && (onboardingGate.isLoading || isSubLoading));

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/welcome');
      return;
    }

    if (onboardingGate.isLoading || isSubLoading) return;

    if (!onboardingGate.isCompleted) {
      router.replace('/onboarding');
      return;
    }

    if (!isActive) {
      router.replace('/paywall');
    }
  }, [isLoaded, isSignedIn, onboardingGate.isLoading, onboardingGate.isCompleted, isSubLoading, isActive]);

  if (isGuardLoading || !isSignedIn || !onboardingGate.isCompleted || !isActive) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
