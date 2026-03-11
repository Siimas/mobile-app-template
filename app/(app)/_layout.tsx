import { Stack, router } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useEffect } from 'react';
import { useSubscription } from '../../hooks/use-purchases';
import { useOnboarding } from '../../hooks/use-onboarding';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isActive, isLoading: isSubLoading } = useSubscription();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();

  // Unified guard: only runs when ALL state is settled.
  useEffect(() => {
    if (!isLoaded || isSubLoading || isOnboardingLoading) return;

    if (!isSignedIn) {
      router.replace('/welcome');
      return;
    }
    if (!isOnboardingCompleted) {
      router.replace('/onboarding');
      return;
    }
    if (!isActive) {
      router.replace('/paywall');
      return;
    }
  }, [isLoaded, isSignedIn, isSubLoading, isOnboardingLoading, isActive, isOnboardingCompleted]);

  if (!isLoaded || !isSignedIn || isSubLoading || isOnboardingLoading || !isActive || !isOnboardingCompleted) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
