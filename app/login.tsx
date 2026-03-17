import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { OAuthSignInButton } from '../components/auth/oauth-signin-button';

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Defs>
        <ClipPath id="clip">
          <Rect width={48} height={48} />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip)">
        <Path
          fill="#4285F4"
          d="M47.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.3-10.5 7.3-17.2z"
        />
        <Path
          fill="#34A853"
          d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 42.8 14.7 48 24 48z"
        />
        <Path
          fill="#FBBC05"
          d="M10.8 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-3 .7-4.3v-6.2H2.6C.9 17.3 0 20.5 0 24s.9 6.7 2.6 9.5l8.2-4.7z"
        />
        <Path
          fill="#EA4335"
          d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.7 0 6.6 5.2 2.6 14.5l8.2 4.7C12.7 13.6 17.9 9.5 24 9.5z"
        />
      </G>
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 814 1000">
      <Path
        fill="white"
        d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-155.5-127.4C46 523.5 0 443.4 0 366.3C0 265.1 56.8 209.6 110.2 167c47.7-38.2 120.8-62 190.5-62 71.9 0 132.2 25.1 176.3 66.9 30.8 28.6 60.2 60.2 105.6 60.2 40.8 0 109.9-31.5 165.9-87.5 31.5-29.8 72.3-65.3 126.5-65.3z"
      />
      <Path
        fill="white"
        d="M553.9 82.3c-2.6 0-5.2.6-7.8.6-49.1 0-95.5-22.6-128.3-63.4C395.5 7.9 386.4 0 386.4 0c0 .6-.6 1.3-.6 1.9 0 57.4 27.8 108.5 68.3 143.7 22 19.4 48.4 34.5 77.5 40.9 0-1.3-.6-2.6-.6-3.9 0-23.9 5.2-46.6 14.3-67.2-0-5.2.6-33.1 8.6-33.1z"
      />
    </Svg>
  );
}

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
            <GoogleLogo />
            <Text className="ml-3 text-base font-semibold text-gray-800">Continue with Google</Text>
          </OAuthSignInButton>

          <OAuthSignInButton strategy="oauth_apple" className="mt-3 bg-black">
            <AppleLogo />
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
