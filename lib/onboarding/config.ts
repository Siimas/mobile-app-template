import React from 'react';
import { UseCaseStep } from '../../components/onboarding/UseCaseStep';
import { ExperienceLevelStep } from '../../components/onboarding/ExperienceLevelStep';
import { MainGoalStep } from '../../components/onboarding/MainGoalStep';

export interface OnboardingStepProps {
  selected: string | null;
  onSelect: (value: string) => void;
}

export interface OnboardingStepConfig {
  id: string;
  question: string;
  component: React.ComponentType<OnboardingStepProps>;
}

export const STEPS: OnboardingStepConfig[] = [
  { id: 'use_case',         question: 'What will you use this app for?',               component: UseCaseStep },
  { id: 'experience_level', question: 'How would you describe your experience level?', component: ExperienceLevelStep },
  { id: 'main_goal',        question: 'What is your main goal?',                       component: MainGoalStep },
];

function hashSteps(steps: OnboardingStepConfig[]): number {
  const str = JSON.stringify(steps.map((s) => s.id));
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

export const CURRENT_ONBOARDING_VERSION = hashSteps(STEPS);
