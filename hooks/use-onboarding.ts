import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@app/onboarding';

export interface OnboardingData {
  useCase: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  completedAt: number;
}

interface OnboardingState {
  isCompleted: boolean;
  isLoading: boolean;
  data: OnboardingData | null;
  save: (data: Omit<OnboardingData, 'completedAt'>) => Promise<void>;
}

export function useOnboarding(): OnboardingState {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setData(raw ? JSON.parse(raw) : null))
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, []);

  const save = useCallback(async (answers: Omit<OnboardingData, 'completedAt'>) => {
    const entry: OnboardingData = { ...answers, completedAt: Date.now() };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    setData(entry);
  }, []);

  return { isCompleted: data?.completedAt != null, isLoading, data, save };
}
