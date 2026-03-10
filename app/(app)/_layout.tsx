import { Stack, router } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useEffect, useRef } from 'react';
import { useSubscription } from '../../hooks/use-purchases';
import { useOnboarding } from '../../hooks/use-onboarding';

export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isActive, isLoading: isSubLoading, refresh } = useSubscription();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();
  const didRefreshForSignIn = useRef(false);

  // After sign-in: call refresh() once to raise isLoading=true shield,
  // giving Purchases.logIn() time to complete before subscription guard fires.
  useEffect(() => {
    if (isLoaded && isSignedIn && !didRefreshForSignIn.current) {
      didRefreshForSignIn.current = true;
      refresh();
    }
    if (isLoaded && !isSignedIn) {
      didRefreshForSignIn.current = false;
    }
  }, [isLoaded, isSignedIn, refresh]);

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
