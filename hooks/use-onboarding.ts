import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Purchases from 'react-native-purchases';
import { useMutation, useQuery } from 'convex/react';
import { useAuth } from '@clerk/expo';
import { api } from '../convex/_generated/api';

const STORAGE_KEY = '@app/onboarding';
const OWNER_KEY_CACHE = '@app/onboarding_owner_key';

interface SaveStepInput {
  question: string;
  answer: string;
  isLastQuestion: boolean;
}

export interface OnboardingData {
  answers?: { question: string; answer: string; answeredAt: number }[];
  onboardingVersion?: number;
  completedAt?: number;
}

interface OnboardingState {
  isCompleted: boolean;
  isLoading: boolean;
  data: OnboardingData | null;
  saveStep: (data: SaveStepInput) => Promise<void>;
}

export function useOnboarding(): OnboardingState {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [localData, setLocalData] = useState<OnboardingData | null>(null);
  const saveAnswer = useMutation(api.onboardingResponses.saveAnswer);
  const completeOnboarding = useMutation(api.onboardingResponses.completeOnboarding);
  const remoteData = useQuery(api.onboardingResponses.getMyOnboarding, isSignedIn ? {} : 'skip');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setLocalData(raw ? JSON.parse(raw) : null))
      .catch(() => setLocalData(null))
      .finally(() => setIsLoading(false));
  }, []);

  const saveLocalData = useCallback(async (entry: OnboardingData) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    setLocalData(entry);
  }, []);

  const getOwnerKey = useCallback(async () => {
    try {
      const ownerKey = await Purchases.getAppUserID();
      if (ownerKey) {
        await AsyncStorage.setItem(OWNER_KEY_CACHE, ownerKey);
        return ownerKey;
      }
    } catch (error) {
      console.warn('[onboarding] Failed to get RevenueCat app user ID:', error);
    }

    const cachedOwnerKey = await AsyncStorage.getItem(OWNER_KEY_CACHE);
    if (cachedOwnerKey) {
      return cachedOwnerKey;
    }

    throw new Error('Unable to resolve onboarding owner key');
  }, []);

  const saveStep = useCallback(
    async (input: SaveStepInput) => {
      const base = localData ?? {};
      const existingAnswers = base.answers ?? [];
      const updatedAnswers = [
        ...existingAnswers.filter((a) => a.question !== input.question),
        { question: input.question, answer: input.answer, answeredAt: Date.now() },
      ];
      const entry: OnboardingData = {
        answers: updatedAnswers,
        onboardingVersion: base.onboardingVersion,
        completedAt: input.isLastQuestion ? base.completedAt ?? Date.now() : base.completedAt,
      };

      await saveLocalData(entry);

      try {
        const ownerKey = await getOwnerKey();
        const version = entry.onboardingVersion ?? 1;
        await saveAnswer({
          ownerKey,
          onboardingVersion: version,
          question: input.question,
          answer: input.answer,
        });
        if (input.isLastQuestion) {
          await completeOnboarding({ ownerKey, onboardingVersion: version });
        }
      } catch (error) {
        console.error('[onboarding] Failed to sync onboarding progress:', error);
      }
    },
    [localData, saveLocalData, getOwnerKey, saveAnswer, completeOnboarding],
  );

  const data = remoteData ?? localData;
  const remoteLoading = isSignedIn ? remoteData === undefined : false;

  return {
    isCompleted: data?.completedAt != null,
    isLoading: isLoading || remoteLoading,
    data,
    saveStep,
  };
}
