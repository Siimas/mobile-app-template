import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ANON_KEY = '@onboarding_session_id';

export function AppleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const linkAnonymousOnboarding = useMutation(api.onboardingResponses.linkAnonymousOnboarding);

  async function handleSignIn() {
    setIsLoading(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_apple' });
      if (createdSessionId) await setActive?.({ session: createdSessionId });

      const anonymousId = await AsyncStorage.getItem(ANON_KEY);
      if (anonymousId) {
        await linkAnonymousOnboarding({ anonymousId });
        await AsyncStorage.removeItem(ANON_KEY);
      }

      router.replace('/(app)/home');
    } catch {
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TouchableOpacity
      className={`mt-3 w-full flex-row items-center justify-center rounded-2xl bg-black py-4`}
      disabled={isLoading}
      onPress={handleSignIn}>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text className="mr-3 text-xl font-bold text-white">{'\uF8FF'}</Text>
          <Text className="text-base font-semibold text-white">Continue with Apple</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
