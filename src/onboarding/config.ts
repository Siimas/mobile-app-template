export interface OnboardingStep {
  question: string;
  options: string[];
  labels?: string[];
}

export const STEPS: OnboardingStep[] = [
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

function hashSteps(steps: OnboardingStep[]): number {
  const str = JSON.stringify(steps.map((s) => ({ q: s.question, o: s.options })));
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (((hash << 5) + hash) ^ str.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

export const CURRENT_ONBOARDING_VERSION = hashSteps(STEPS);
