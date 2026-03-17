import { router } from 'expo-router';
import RevenueCatUI from 'react-native-purchases-ui';

export default function Paywall() {
  return (
    <RevenueCatUI.Paywall
      onPurchaseError={() => {}}
      onDismiss={() => router.replace('/welcome')}
      onPurchaseCompleted={() => router.replace('/(app)/home')}
    />
  );
}
