import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { OAuthSignInButton } from '../components/auth/oauth-signin-button';
import AntDesign from '@expo/vector-icons/AntDesign';

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

        <View className="mb-8">
          <OAuthSignInButton strategy="oauth_google" className="border border-gray-300 bg-white">
            <AntDesign name="google" size={24} color="black" />
            <Text className="ml-3 text-base font-semibold text-gray-800">Continue with Google</Text>
          </OAuthSignInButton>

          <OAuthSignInButton strategy="oauth_apple" className="mt-3 bg-black">
            <AntDesign name="apple" size={24} color="white" />
            <Text className="ml-3 text-base font-semibold text-white">Continue with Apple</Text>
          </OAuthSignInButton>
        </View>

        <View className="items-center pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-sm text-gray-500">Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
