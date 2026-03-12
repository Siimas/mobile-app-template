import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface WelcomeActionsProps {
  isSignedIn: boolean;
  isLoading: boolean;
  onPrimaryAction: () => void;
  onSignOut: () => void;
}

export function WelcomeActions({
  isSignedIn,
  isLoading,
  onPrimaryAction,
  onSignOut,
}: WelcomeActionsProps) {
  return (
    <View className="items-center gap-3 pb-12">
      <TouchableOpacity
        className="w-64 items-center rounded-2xl bg-black py-4"
        onPress={onPrimaryAction}
        disabled={isLoading}>
        <Text className="text-base font-semibold text-white">
          {isSignedIn ? 'Go to App' : 'Get Started'}
        </Text>
      </TouchableOpacity>
      {!isSignedIn ? (
        <View className="flex-row items-center">
          <Text className="text-base text-gray-600">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-base font-semibold text-gray-900">Sign in</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={onSignOut}>
          <Text className="text-base text-gray-500">Log out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
