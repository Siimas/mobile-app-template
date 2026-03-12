import { useState } from 'react';
import { router } from 'expo-router';
import { CURRENT_ONBOARDING_VERSION, STEPS } from '@/lib/onboarding/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/expo';

type OnboardingAnswers = Record<string, string | null>;

function createInitialAnswers(): OnboardingAnswers {
  return Object.fromEntries(STEPS.map((step) => [step.id, null]));
}

export default function Onboarding() {
  const { userId } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(createInitialAnswers);

  const saveOnboardingAnswer = useMutation(api.onboardingResponses.saveAnswer);
  const completeOnboarding = useMutation(api.onboardingResponses.completeOnboarding);

  const self = useQuery(api.users.getSelf);

  if (self === undefined)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  if (self && self.hasCompletedOnboarding) router.replace('/(app)/home');

  const current = STEPS[step];
  const totalSteps = STEPS.length;
  const selected = answers[current.id];
  const isLastStep = step === totalSteps - 1;  

  function handleSelect(value: string) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
  }

  function handleNext() {
    if (!selected) return;

    if (isLastStep) {
      const ownerKey = self ? self._id : userId; // TODO: need to get the customer id from revenuecat when he is not logged in but completes the onboarding

      if (ownerKey) {
        completeOnboarding({
          onboardingVersion: CURRENT_ONBOARDING_VERSION,
          ownerKey,
        }).then(() => router.replace('/paywall'));
      }

      return;
    }

    setStep((previous) => Math.min(previous + 1, totalSteps - 1));
  }

  const StepComponent = current.component;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <Text className="text-sm font-medium text-gray-400">
          Step {step + 1} of {totalSteps}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <StepComponent selected={selected} onSelect={handleSelect} />
      </View>

      <View className="flex-row items-center justify-center gap-4 px-6 pb-12">
        <TouchableOpacity
          className={`rounded-2xl px-28 py-4 ${selected ? 'bg-black' : 'bg-gray-200'}`}
          disabled={!selected}
          onPress={handleNext}>
          <Text className={`text-base font-semibold ${selected ? 'text-white' : 'text-gray-400'}`}>
            {isLastStep ? 'Continue' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
