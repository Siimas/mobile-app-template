import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';
import { usePostHog } from 'posthog-react-native';
import { useSubscription } from '../hooks/use-purchases';

export default function Paywall() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const posthog = usePostHog();
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    posthog.capture('paywall_viewed');
  }, [posthog]);

  const navigateAfterPurchase = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.replace(isSignedIn ? '/(app)/home' : '/login');
  }, [isSignedIn]);

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
    if (isActive) {
      navigateAfterPurchase();
    }
  }, [isActive, navigateAfterPurchase]);

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
