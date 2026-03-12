import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignInButtons } from '../components/auth/SignInButtons';
import { useAuth } from '@clerk/expo';

export default function Login() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) router.replace('/(app)/home');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl font-black tracking-tight">MyApp</Text>
          <Text className="mt-2 text-base text-gray-500">Warm up smarter. Train harder.</Text>
        </View>

        <SignInButtons />

        <View className="items-center pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-sm text-gray-500">Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
