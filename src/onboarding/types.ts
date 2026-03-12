export interface OnboardingStepProps {
  stepIndex: number;
  totalSteps: number;
  isLastStep: boolean;
  initialValue?: string;
  onComplete: (answer: string) => void;
  onBack: () => void;
}
