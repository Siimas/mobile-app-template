import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';
import { useSubscription } from '../hooks/use-purchases';
import { useOnboarding } from '../hooks/use-onboarding';

export default function Paywall() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();
  const hasNavigatedRef = useRef(false);

  const navigateAfterPurchase = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    if (isSignedIn) {
      router.replace(isOnboardingCompleted ? '/(app)/home' : '/onboarding');
      return;
    }
    router.replace('/login');
  }, [isSignedIn, isOnboardingCompleted]);

  // Fallback: if customer info updates before purchase callbacks fire.
  useEffect(() => {
    if (isOnboardingLoading) return;
    if (isActive) {
      navigateAfterPurchase();
    }
  }, [isActive, isOnboardingLoading, navigateAfterPurchase]);

  function handleDismiss() {
    if (hasNavigatedRef.current || isActive) return;
    if (!isSignedIn) {
      router.replace('/login');
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/welcome');
    }
  }

  return (
    <RevenueCatUI.Paywall
      onPurchaseCompleted={navigateAfterPurchase}
      onRestoreCompleted={navigateAfterPurchase}
      onDismiss={handleDismiss}
    />
  );
}
