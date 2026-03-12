import { Text, TouchableOpacity, View } from 'react-native';
import type { OnboardingStepProps } from '@/lib/onboarding/config';

export function UseCaseStep({ selected, onSelect }: OnboardingStepProps) {
  const question = 'What will you use this app for?';
  const options = ['Work', 'Learning', 'Personal', 'Other'];

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
