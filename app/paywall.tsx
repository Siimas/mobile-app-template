import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';
import { useSubscription } from '../hooks/use-purchases';

export default function Paywall() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const hasNavigatedRef = useRef(false);

  const navigateAfterPurchase = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    router.replace(isSignedIn ? '/(app)/home' : '/login');
  }, [isSignedIn]);

  // Fallback: if customer info updates before purchase callbacks fire.
  useEffect(() => {
    if (isActive) {
      navigateAfterPurchase();
    }
  }, [isActive, navigateAfterPurchase]);

  function handleDismiss() {
    if (hasNavigatedRef.current || isActive) return;
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
