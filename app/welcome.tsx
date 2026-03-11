import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';
import { useSubscription } from '../hooks/use-purchases';
import { useOnboarding } from '../hooks/use-onboarding';

export default function Welcome() {
  const { isSignedIn } = useAuth();
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
          className="bg-black w-64 py-4 rounded-2xl items-center"
          onPress={handlePrimaryAction}
          disabled={isOnboardingLoading}
        >
          <Text className="text-white text-base font-semibold">
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
        ) : null}
      </View>
    </SafeAreaView>
  );
}
