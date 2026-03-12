import { useState } from 'react';
import { OnboardingStepProps } from '@/onboarding/types';
import { OnboardingStepView } from './OnboardingStepView';

const QUESTION = 'How would you describe your experience level?';
const OPTIONS = ['beginner', 'intermediate', 'advanced'];
const LABELS = ['Beginner', 'Intermediate', 'Advanced'];

export function ExperienceLevelStep({ stepIndex, totalSteps, isLastStep, initialValue, onComplete, onBack }: OnboardingStepProps) {
  const [selected, setSelected] = useState(initialValue ?? '');

  return (
    <OnboardingStepView
      step={stepIndex}
      totalSteps={totalSteps}
      question={QUESTION}
      options={OPTIONS}
      labels={LABELS}
      selected={selected}
      onSelect={setSelected}
      onNext={() => onComplete(selected)}
      onBack={onBack}
      isLastStep={isLastStep}
    />
  );
}
