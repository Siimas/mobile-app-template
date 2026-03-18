import { Pressable, Text } from 'react-native';
import Purchases from 'react-native-purchases';

export function BillingIssueBanner() {
  return (
    <Pressable
      className="items-center bg-red-700 px-4 py-2.5"
      onPress={() => Purchases.showManageSubscriptions()}>
      <Text className="text-sm font-semibold text-white">
        Payment issue detected — tap to fix
      </Text>
    </Pressable>
  );
}
