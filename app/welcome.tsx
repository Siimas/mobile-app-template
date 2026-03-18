import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SparklesIcon as SparklesIconOutline } from 'react-native-heroicons/outline';

export default function Welcome() {
  const { isSignedIn, signOut } = useAuth();

  async function onPrimaryAction() {
    if (isSignedIn) router.navigate('/(app)/home');
    else router.navigate('/onboarding');
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <SparklesIconOutline />
        <Text className="text-6xl font-bold">Welcome</Text>
      </View>
      <View className="items-center gap-3 pb-12">
        <TouchableOpacity
          className="w-64 items-center rounded-2xl bg-black py-4"
          onPress={onPrimaryAction}>
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
          <TouchableOpacity onPress={async () => await signOut()}>
            <Text className="text-base text-gray-500">Log out</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
