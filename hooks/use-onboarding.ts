import { useCallback } from 'react';
import Purchases from 'react-native-purchases';
import { useMutation, useQuery } from 'convex/react';
import { useAuth } from '@clerk/expo';
import { api } from '../convex/_generated/api';
import { CURRENT_ONBOARDING_VERSION } from '@/onboarding/config';

interface SaveStepInput {
  question: string;
  answer: string;
  isLastQuestion: boolean;
}

export function useOnboarding() {
  const { isSignedIn } = useAuth();
  const saveAnswerMutation = useMutation(api.onboardingResponses.saveAnswer);
  const completeOnboarding = useMutation(api.onboardingResponses.completeOnboarding);
  const remoteData = useQuery(api.onboardingResponses.getMyOnboarding, isSignedIn ? {} : 'skip');
  const meData = useQuery(api.users.getMe, isSignedIn ? {} : 'skip');

  const saveStep = useCallback(
    async (input: SaveStepInput) => {
      const ownerKey = await Purchases.getAppUserID();
      await saveAnswerMutation({
        ownerKey,
        onboardingVersion: CURRENT_ONBOARDING_VERSION,
        question: input.question,
        answer: input.answer,
      });
      if (input.isLastQuestion) {
        await completeOnboarding({ ownerKey, onboardingVersion: CURRENT_ONBOARDING_VERSION });
      }
    },
    [saveAnswerMutation, completeOnboarding],
  );

  return {
    isCompleted: remoteData?.completedAt != null || meData?.hasCompletedOnboarding === true,
    isLoading: isSignedIn ? remoteData === undefined || meData === undefined : false,
    saveStep,
  };
}
