import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { isClerkAPIResponseError, useAuth, useSSO, useUser } from '@clerk/expo';
import { useSignInWithApple } from '@clerk/expo/apple';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { usePostHog } from 'posthog-react-native';
import { Platform } from 'react-native';
import { SignInButtons } from '../components/auth/SignInButtons';

WebBrowser.maybeCompleteAuthSession();

function getErrorInfo(err: unknown): { code: string; message: string } {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  const message =
    typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : String(err);
  return { code, message };
}

export default function Login() {
  const { startSSOFlow } = useSSO();
  const { startAppleAuthenticationFlow } = useSignInWithApple();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const posthog = usePostHog();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedSignIn = useRef(false);

  const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'myapp', path: 'oauth-native-callback' });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      if (!hasTrackedSignIn.current && user) {
        hasTrackedSignIn.current = true;
        posthog.identify(user.id, {
          $set: {
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName ?? undefined,
          },
          $set_once: {
            first_sign_in_date: new Date().toISOString(),
          },
        });
        posthog.capture('user_signed_in', {
          provider: user.externalAccounts?.[0]?.provider ?? 'unknown',
        });
      }
      router.replace('/(app)/home');
    }
  }, [isLoaded, isSignedIn, user, posthog]);

  function isCancelError(err: unknown) {
    const { code, message } = getErrorInfo(err);
    return (
      code === 'SIGN_IN_CANCELLED' ||
      code === '-5' ||
      code === 'ERR_CANCELED' ||
      code === 'ERR_REQUEST_CANCELED' ||
      message.includes('ERR_REQUEST_CANCELED')
    );
  }

  function logAuthError(context: string, err: unknown) {
    const { code, message } = getErrorInfo(err);
    console.error(`[auth] ${context} failed (code=${code || 'unknown'}): ${message}`);
  }

  function isAlreadySignedInError(err: unknown) {
    if (isClerkAPIResponseError(err)) {
      return err.errors.some((clerkError) => {
        const code = clerkError.code?.toLowerCase() ?? '';
        const longMessage = clerkError.longMessage?.toLowerCase() ?? '';
        return code === 'already_signed_in' || longMessage.includes('already signed in');
      });
    }
    const { message } = getErrorInfo(err);
    return message.toLowerCase().includes('already signed in');
  }

  async function activateSession(
    createdSessionId: string | null,
    setActive?: (params: { session: string }) => Promise<void>
  ) {
    if (!createdSessionId || !setActive) return;
    await setActive({ session: createdSessionId });
  }

  async function handleGoogleSignIn() {
    if (isSignedIn) {
      router.replace('/(app)/home');
      return;
    }
    try {
      setError(null);
      setIsGoogleLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });
      await activateSession(createdSessionId, setActive);
    } catch (err) {
      if (isCancelError(err)) return;
      if (isAlreadySignedInError(err)) {
        router.replace('/(app)/home');
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
      router.replace('/(app)/home');
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
          const { createdSessionId, setActive } = await startSSOFlow({
            strategy: 'oauth_apple',
            redirectUrl,
          });
          await activateSession(createdSessionId, setActive);
          return;
        }
      }

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_apple',
        redirectUrl,
      });
      await activateSession(createdSessionId, setActive);
    } catch (err) {
      if (isCancelError(err)) return;
      if (isAlreadySignedInError(err)) {
        router.replace('/(app)/home');
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
          <Text className="mt-2 text-base text-gray-500">Warm up smarter. Train harder.</Text>
        </View>

        <SignInButtons
          onGooglePress={handleGoogleSignIn}
          onApplePress={handleAppleSignIn}
          isGoogleLoading={isGoogleLoading}
          isAppleLoading={isAppleLoading}
          error={error}
        />

        <View className="items-center pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-sm text-gray-500">Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
