import { router } from 'expo-router';
import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { storage } from '@/lib/storage';

const ANON_KEY = '@onboarding_session_id';

type Strategy = 'oauth_google' | 'oauth_apple';

interface Props {
  strategy: Strategy;
  children: React.ReactNode;
  className?: string;
}

export function OAuthSignInButton({ strategy, children, className }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();
  const linkAnonymousOnboarding = useMutation(api.onboardingResponses.linkAnonymousOnboarding);

  const indicatorColor = strategy === 'oauth_google' ? '#4285F4' : 'white';

  async function handleSignIn() {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId) await setActive?.({ session: createdSessionId });

      const anonymousId = storage.getString(ANON_KEY);
      if (anonymousId) {
        await linkAnonymousOnboarding({ anonymousId });
        storage.delete(ANON_KEY);
      }

      router.replace('/(app)/home');
    } catch {
      // Sign in failed
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TouchableOpacity
      className={`w-full flex-row items-center justify-center rounded-2xl py-4 ${className ?? ''}`}
      disabled={isLoading}
      onPress={handleSignIn}>
      {isLoading ? <ActivityIndicator color={indicatorColor} /> : children}
    </TouchableOpacity>
  );
}
