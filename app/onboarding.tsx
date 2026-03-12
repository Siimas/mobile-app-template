import { useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import { useOnboarding } from '../hooks/use-onboarding';
import { useSubscription } from '../hooks/use-purchases';
import { CURRENT_ONBOARDING_VERSION, STEPS } from '@/onboarding/config';

export default function Onboarding() {
  const { isSignedIn } = useAuth();
  const { isActive } = useSubscription();
  const { saveStep } = useOnboarding();
  const posthog = usePostHog();
  const [step, setStep] = useState(0);
  const [completedAnswers, setCompletedAnswers] = useState<Record<string, string>>({});

  const current = STEPS[step];

  async function handleComplete(answer: string) {
    const isLastQuestion = step === STEPS.length - 1;

    posthog.capture('onboarding_step_completed', {
      step_number: step + 1,
      total_steps: STEPS.length,
      onboarding_version: CURRENT_ONBOARDING_VERSION,
      question: current.question,
      answer,
    });

    setCompletedAnswers((prev) => ({ ...prev, [current.id]: answer }));
    await saveStep({ question: current.question, answer, isLastQuestion });

    if (!isLastQuestion) {
      setStep((s) => s + 1);
      return;
    }

    posthog.capture('onboarding_completed', {
      total_steps: STEPS.length,
      onboarding_version: CURRENT_ONBOARDING_VERSION,
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
      setStep((s) => s - 1);
    }
  }

  const StepComponent = current.component;
  return (
    <StepComponent
      stepIndex={step}
      totalSteps={STEPS.length}
      isLastStep={step === STEPS.length - 1}
      initialValue={completedAnswers[current.id]}
      onComplete={handleComplete}
      onBack={handleBack}
    />
  );
}
