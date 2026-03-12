import { Text, TouchableOpacity, View } from 'react-native';
import type { OnboardingStepProps } from '@/lib/onboarding/config';

export function ExperienceLevelStep({ selected, onSelect }: OnboardingStepProps) {
  const question = 'How would you describe your experience level?';
  const options = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <>
      <Text className="mb-8 text-2xl font-bold">{question}</Text>
      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            className={`rounded-2xl border px-5 py-4 ${selected === option ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
            onPress={() => onSelect(option)}>
            <Text
              className={`text-base font-semibold ${selected === option ? 'text-white' : 'text-gray-800'}`}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
