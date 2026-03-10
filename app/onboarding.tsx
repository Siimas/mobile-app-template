import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/expo';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSubscription } from '../hooks/use-purchases';

const STEPS = [
  {
    title: 'What will you use this app for?',
    field: 'useCase' as const,
    options: ['Work', 'Learning', 'Personal', 'Other'],
  },
  {
    title: 'How would you describe your experience level?',
    field: 'experienceLevel' as const,
    options: ['beginner', 'intermediate', 'advanced'],
    labels: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    title: 'What is your main goal?',
    field: 'goal' as const,
    options: ['Build a habit', 'Improve performance', 'Reduce injury risk', 'General wellness'],
  },
];

export default function Onboarding() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const { save } = useOnboarding();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ useCase: string; experienceLevel: string; goal: string }>({
    useCase: '',
    experienceLevel: '',
    goal: '',
  });

  const current = STEPS[step];
  const selected = answers[current.field];

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [current.field]: value }));
  }

  async function handleNext() {
    if (!selected) return;

    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    await save({
      useCase: answers.useCase,
      experienceLevel: answers.experienceLevel as 'beginner' | 'intermediate' | 'advanced',
      goal: answers.goal,
    });

    if (isSignedIn && isActive) {
      router.replace('/(app)/home');
    } else {
      router.replace('/paywall');
    }
  }

  function handleBack() {
    if (step === 0) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  }

  const displayLabels = current.labels ?? current.options;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <Text className="text-sm text-gray-400 font-medium">
          Step {step + 1} of {STEPS.length}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold mb-8">{current.title}</Text>
        <View className="gap-3">
          {current.options.map((option, i) => (
            <TouchableOpacity
              key={option}
              className={`py-4 px-5 rounded-2xl border ${selected === option ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}
              onPress={() => selectOption(option)}
            >
              <Text className={`text-base font-semibold ${selected === option ? 'text-white' : 'text-gray-800'}`}>
                {displayLabels[i]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-4 pb-12 px-6">
        <TouchableOpacity
          className="border border-gray-300 px-10 py-4 rounded-2xl"
          onPress={handleBack}
        >
          <Text className="text-base font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-10 py-4 rounded-2xl ${selected ? 'bg-black' : 'bg-gray-200'}`}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text className={`text-base font-semibold ${selected ? 'text-white' : 'text-gray-400'}`}>
            {step < STEPS.length - 1 ? 'Next' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
