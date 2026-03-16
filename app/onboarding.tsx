import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { CURRENT_ONBOARDING_VERSION, STEPS } from '@/lib/onboarding/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';

const ANON_KEY = '@onboarding_session_id';

type OnboardingAnswers = Record<string, string | null>;

function createInitialAnswers(): OnboardingAnswers {
  return Object.fromEntries(STEPS.map((step) => [step.id, null]));
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(createInitialAnswers);
  const [anonymousId, setAnonymousId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onboardingData = useQuery(
    api.onboardingResponses.getMyOnboarding,
    anonymousId ? { anonymousId } : 'skip'
  );

  const saveAnswer = useMutation(api.onboardingResponses.saveAnswer);
  const completeOnboarding = useMutation(api.onboardingResponses.completeOnboarding);

  useEffect(() => {
    AsyncStorage.getItem(ANON_KEY).then((stored) => {
      if (stored) return setAnonymousId(stored);
      const id = randomUUID();
      AsyncStorage.setItem(ANON_KEY, id);
      setAnonymousId(id);
    });
  }, []);

  if (!anonymousId || onboardingData === undefined) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (onboardingData?.completedAt) {
    router.replace('/(app)/home');
    return null;
  }

  const current = STEPS[step];
  const totalSteps = STEPS.length;
  const selected = answers[current.id];
  const isLastStep = step === totalSteps - 1;

  function handleSelect(value: string) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
  }

  async function handleNext() {
    if (!selected || !anonymousId) return;

    setIsLoading(true);
    try {
      await saveAnswer({
        anonymousId,
        question: current.id,
        answer: selected,
        onboardingVersion: CURRENT_ONBOARDING_VERSION,
      });

      if (isLastStep) {
        await completeOnboarding({ anonymousId });
        router.replace('/paywall');
        return;
      }

      setStep((prev) => Math.min(prev + 1, totalSteps - 1));
    } finally {
      setIsLoading(false);
    }
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
          className={`rounded-2xl px-28 py-4 ${selected && !isLoading ? 'bg-black' : 'bg-gray-200'}`}
          disabled={!selected || isLoading}
          onPress={handleNext}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className={`text-base font-semibold ${selected ? 'text-white' : 'text-gray-400'}`}>
              {isLastStep ? 'Continue' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
