import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, useClerk } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import { useSubscription } from '../hooks/use-purchases';
import { useOnboarding } from '../hooks/use-onboarding';
import { WelcomeActions } from '../components/welcome/WelcomeActions';

export default function Welcome() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { isActive } = useSubscription();
  const { isCompleted: isOnboardingCompleted, isLoading: isOnboardingLoading } = useOnboarding();
  const posthog = usePostHog();

  function handlePrimaryAction() {
    if (!isSignedIn) {
      posthog.capture('get_started_clicked');
      router.push('/onboarding');
      return;
    }
    if (!isOnboardingCompleted) {
      router.push('/onboarding');
      return;
    }
    router.push(isActive ? '/(app)/home' : '/paywall');
  }

  async function handleSignOut() {
    posthog.capture('user_signed_out');
    posthog.reset();
    await signOut();
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold">Welcome</Text>
      </View>
      <WelcomeActions
        isSignedIn={!!isSignedIn}
        isLoading={isOnboardingLoading}
        onPrimaryAction={handlePrimaryAction}
        onSignOut={handleSignOut}
      />
    </SafeAreaView>
  );
}
