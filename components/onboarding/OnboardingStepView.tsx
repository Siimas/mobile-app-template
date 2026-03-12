import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OnboardingStepViewProps {
  step: number;
  totalSteps: number;
  question: string;
  options: string[];
  labels: string[];
  selected: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
}

export function OnboardingStepView({
  step,
  totalSteps,
  question,
  options,
  labels,
  selected,
  onSelect,
  onNext,
  onBack,
  isLastStep,
}: OnboardingStepViewProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-4">
        <Text className="text-sm font-medium text-gray-400">
          Step {step + 1} of {totalSteps}
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        <Text className="mb-8 text-2xl font-bold">{question}</Text>
        <View className="gap-3">
          {options.map((option, i) => (
            <TouchableOpacity
              key={option}
              className={`rounded-2xl border px-5 py-4 ${selected === option ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}
              onPress={() => onSelect(option)}>
              <Text
                className={`text-base font-semibold ${selected === option ? 'text-white' : 'text-gray-800'}`}>
                {labels[i]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-4 px-6 pb-12">
        <TouchableOpacity
          className="rounded-2xl border border-gray-300 px-10 py-4"
          onPress={onBack}>
          <Text className="text-base font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`rounded-2xl px-10 py-4 ${selected ? 'bg-black' : 'bg-gray-200'}`}
          onPress={onNext}
          disabled={!selected}>
          <Text className={`text-base font-semibold ${selected ? 'text-white' : 'text-gray-400'}`}>
            {isLastStep ? 'Continue' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
