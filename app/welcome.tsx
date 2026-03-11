import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useClerk } from '@clerk/expo';
import { useSubscription } from '../hooks/use-purchases';
import { useOnboarding } from '../hooks/use-onboarding';

export default function Welcome() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { isActive } = useSubscription();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();

  function handlePrimaryAction() {
    if (!isSignedIn) {
      router.push('/onboarding');
      return;
    }

    if (!isOnboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    router.push(isActive ? '/(app)/home' : '/paywall');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold">Welcome</Text>
      </View>
      <View className="items-center gap-3 pb-12">
        <TouchableOpacity
          className="w-64 items-center rounded-2xl bg-black py-4"
          onPress={handlePrimaryAction}
          disabled={isOnboardingLoading}>
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
          <TouchableOpacity onPress={() => signOut()}>
            <Text className="text-base text-gray-500">Log out</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
