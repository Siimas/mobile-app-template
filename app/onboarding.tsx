import { useState } from 'react';
import { router } from 'expo-router';
import { STEPS } from '@/lib/onboarding/config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';

type OnboardingAnswers = Record<string, string | null>;

function createInitialAnswers(): OnboardingAnswers {
  return Object.fromEntries(STEPS.map((step) => [step.id, null]));
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>(createInitialAnswers);
  const totalSteps = STEPS.length;
  const current = STEPS[step];
  const selected = answers[current.id];
  const isLastStep = step === totalSteps - 1;

  function handleBack() {
    if (step === 0) {
      router.replace('/welcome');
      return;
    }
    setStep((s) => s - 1);
  }

  function handleSelect(value: string) {
    setAnswers((previous) => ({ ...previous, [current.id]: value }));
  }

  function handleNext() {
    if (!selected) return;

    if (isLastStep) {
      router.replace('/paywall');
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
          className="rounded-2xl border border-gray-300 px-10 py-4"
          onPress={handleBack}>
          <Text className="text-base font-semibold">
            Back
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-2xl px-10 py-4 ${selected ? 'bg-black' : 'bg-gray-200'}`}
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
