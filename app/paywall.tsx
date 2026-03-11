import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';
import { usePostHog } from 'posthog-react-native';
import { useSubscription } from '../hooks/use-purchases';
import { useOnboarding } from '../hooks/use-onboarding';

export default function Paywall() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();
  const posthog = usePostHog();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    posthog.capture('paywall_viewed');
  }, [posthog]);

  const navigateAfterPurchase = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    if (isSignedIn) {
      router.replace(isOnboardingCompleted ? '/(app)/home' : '/onboarding');
      return;
    }
    router.replace('/login');
  }, [isSignedIn, isOnboardingCompleted]);

  function handlePurchaseCompleted() {
    posthog.capture('subscription_purchased');
    navigateAfterPurchase();
  }

  function handleRestoreCompleted() {
    posthog.capture('subscription_restored');
    navigateAfterPurchase();
  }

  // Fallback: if customer info updates before purchase callbacks fire.
  useEffect(() => {
    if (isOnboardingLoading) return;
    if (isActive) {
      navigateAfterPurchase();
    }
  }, [isActive, isOnboardingLoading, navigateAfterPurchase]);

  function handleDismiss() {
    if (hasNavigatedRef.current || isActive) return;
    posthog.capture('paywall_dismissed');
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
      onPurchaseCompleted={handlePurchaseCompleted}
      onRestoreCompleted={handleRestoreCompleted}
      onDismiss={handleDismiss}
    />
  );
}
