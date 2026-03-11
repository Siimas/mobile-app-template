import { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { isClerkAPIResponseError, useAuth, useSSO } from '@clerk/expo';
import { useSignInWithApple } from '@clerk/expo/apple';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useOnboarding } from '../hooks/use-onboarding';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const { isLoaded, isSignedIn } = useAuth();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAnyLoading = isGoogleLoading || isAppleLoading;
  const postLoginPath = isOnboardingCompleted ? '/(app)/home' : '/onboarding';

  const redirectUrl = useMemo(() => AuthSession.makeRedirectUri({ scheme: 'myapp', path: 'oauth-native-callback' }), []);

  useEffect(() => {
    if (isLoaded && isSignedIn && !isOnboardingLoading) {
      router.replace(postLoginPath);
    }
  }, [isLoaded, isSignedIn, isOnboardingLoading, postLoginPath]);

  async function activateSession(createdSessionId: string | null, setActive?: (params: { session: string }) => Promise<void>) {
    if (!createdSessionId || !setActive) {
      return;
    }
    await setActive({ session: createdSessionId });
  }

  function isCancelError(err: unknown) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : '';
    const message =
      typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : '';
    return (
      code === 'SIGN_IN_CANCELLED' ||
      code === '-5' ||
      code === 'ERR_CANCELED' ||
      code === 'ERR_REQUEST_CANCELED' ||
      message.includes('ERR_REQUEST_CANCELED')
    );
  }

  function logAuthError(context: string, err: unknown) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code: unknown }).code) : 'unknown';
    const message =
      typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : String(err);
    console.error(`[auth] ${context} failed (code=${code}): ${message}`);
  }

  function isAlreadySignedInError(err: unknown) {
    if (isClerkAPIResponseError(err)) {
      return err.errors.some((clerkError) => {
        const code = clerkError.code?.toLowerCase() ?? '';
        const longMessage = clerkError.longMessage?.toLowerCase() ?? '';
        return code === 'already_signed_in' || longMessage.includes('already signed in');
      });
    }

    const message =
      typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message).toLowerCase() : '';
    return message.includes('already signed in');
  }

  async function handleGoogleSignIn() {
    if (isSignedIn) {
      router.replace(postLoginPath);
      return;
    }

    try {
      setError(null);
      setIsGoogleLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_google', redirectUrl });
      await activateSession(createdSessionId, setActive);
    } catch (err) {
      if (isCancelError(err)) return;
      if (isAlreadySignedInError(err)) {
        router.replace(postLoginPath);
        return;
      }
      logAuthError('Google sign-in', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleAppleSignIn() {
    if (isSignedIn) {
      router.replace(postLoginPath);
      return;
    }

    try {
      setError(null);
      setIsAppleLoading(true);

      if (Platform.OS === 'ios') {
        try {
          const { createdSessionId, setActive } = await startAppleAuthenticationFlow();
          await activateSession(createdSessionId, setActive);
          return;
        } catch (err) {
          if (isCancelError(err)) return;
          logAuthError('Native Apple sign-in', err);
          // Native Apple auth can fail on simulator/dev setup.
          // Fall back to OAuth flow so Apple sign-in remains usable.
          const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_apple', redirectUrl });
          await activateSession(createdSessionId, setActive);
          return;
        }
      }

      const { createdSessionId, setActive } = await startSSOFlow({ strategy: 'oauth_apple', redirectUrl });
      await activateSession(createdSessionId, setActive);
    } catch (err) {
      if (isCancelError(err)) return;
      if (isAlreadySignedInError(err)) {
        router.replace(postLoginPath);
        return;
      }
      logAuthError('Apple sign-in', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsAppleLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl font-black tracking-tight">MyApp</Text>
          <Text className="text-base text-gray-500 mt-2">Warm up smarter. Train harder.</Text>
        </View>

        <View className="mb-8">
          {error && (
            <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
          )}

          <TouchableOpacity
            className={`w-full py-4 rounded-2xl border border-gray-300 bg-white flex-row items-center justify-center ${!isGoogleLoading && isAnyLoading ? 'opacity-50' : ''}`}
            onPress={handleGoogleSignIn}
            disabled={isAnyLoading}
          >
            {isGoogleLoading ? (
              <ActivityIndicator color="#4285F4" />
            ) : (
              <>
                <Text className="font-bold text-xl mr-3" style={{ color: '#4285F4' }}>G</Text>
                <Text className="text-base font-semibold text-gray-800">Continue with Google</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className={`w-full py-4 rounded-2xl bg-black flex-row items-center justify-center mt-3 ${!isAppleLoading && isAnyLoading ? 'opacity-50' : ''}`}
            onPress={handleAppleSignIn}
            disabled={isAnyLoading}
          >
            {isAppleLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-xl mr-3">{'\uF8FF'}</Text>
                <Text className="text-white text-base font-semibold">Continue with Apple</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className="items-center pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-gray-500 text-sm">Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
