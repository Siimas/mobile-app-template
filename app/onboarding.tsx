import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSubscription } from '../hooks/use-purchases';

const STEPS = [
  {
    question: 'What will you use this app for?',
    options: ['Work', 'Learning', 'Personal', 'Other'],
  },
  {
    question: 'How would you describe your experience level?',
    options: ['beginner', 'intermediate', 'advanced'],
    labels: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    question: 'What is your main goal?',
    options: ['Build a habit', 'Improve performance', 'Reduce injury risk', 'General wellness'],
  },
];

function hashSteps(steps: { question: string; options: string[] }[]): number {
  const str = JSON.stringify(steps.map((s) => ({ q: s.question, o: s.options })));
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

const CURRENT_ONBOARDING_VERSION = hashSteps(STEPS);

export default function Onboarding() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const { saveStep, data } = useOnboarding();
  const posthog = usePostHog();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (!data?.answers) return;
    const existingAnswer = data.answers.find((a) => a.question === STEPS[step].question);
    if (existingAnswer) setSelected(existingAnswer.answer);
  }, [step, data]);

  const current = STEPS[step];

  function selectOption(value: string) {
    setSelected(value);
  }

  async function handleNext() {
    if (!selected) return;

    const isLastQuestion = step === STEPS.length - 1;

    posthog.capture('onboarding_step_completed', {
      step_number: step + 1,
      total_steps: STEPS.length,
      question: current.question,
      answer: selected,
    });

    await saveStep({
      question: current.question,
      answer: selected,
      isLastQuestion,
    });

    if (step < STEPS.length - 1) {
      setSelected('');
      setStep((s) => s + 1);
      return;
    }

    posthog.capture('onboarding_completed', {
      total_steps: STEPS.length,
    });

    if (isSignedIn && isActive) {
      router.replace('/(app)/home');
    } else {
      router.replace('/paywall');
    }
  }

  function handleBack() {
    if (step === 0) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/welcome');
      }
    } else {
      setSelected('');
      setStep((s) => s - 1);
    }
  }

  const displayLabels = current.labels ?? current.options;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <Text className="text-sm font-medium text-gray-400">
          Step {step + 1} of {STEPS.length}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <Text className="mb-8 text-2xl font-bold">{current.question}</Text>
        <View className="gap-3">
          {current.options.map((option, i) => (
            <TouchableOpacity
              key={option}
              className={`rounded-2xl border px-5 py-4 ${selected === option ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
              onPress={() => selectOption(option)}>
              <Text
                className={`text-base font-semibold ${selected === option ? 'text-white' : 'text-gray-800'}`}>
                {displayLabels[i]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-4 px-6 pb-12">
        <TouchableOpacity
          className="rounded-2xl border border-gray-300 px-10 py-4"
          onPress={handleBack}>
          <Text className="text-base font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-2xl px-10 py-4 ${selected ? 'bg-black' : 'bg-gray-200'}`}
          onPress={handleNext}
          disabled={!selected}>
          <Text className={`text-base font-semibold ${selected ? 'text-white' : 'text-gray-400'}`}>
            {step < STEPS.length - 1 ? 'Next' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
