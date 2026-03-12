import { useState } from 'react';
import { OnboardingStepProps } from '@/onboarding/types';
import { OnboardingStepView } from './OnboardingStepView';

const QUESTION = 'What will you use this app for?';
const OPTIONS = ['Work', 'Learning', 'Personal', 'Other'];

export function UseCaseStep({ stepIndex, totalSteps, isLastStep, initialValue, onComplete, onBack }: OnboardingStepProps) {
  const [selected, setSelected] = useState(initialValue ?? '');

  return (
    <OnboardingStepView
      step={stepIndex}
      totalSteps={totalSteps}
      question={QUESTION}
      options={OPTIONS}
      labels={OPTIONS}
      selected={selected}
      onSelect={setSelected}
      onNext={() => onComplete(selected)}
      onBack={onBack}
      isLastStep={isLastStep}
    />
  );
}
