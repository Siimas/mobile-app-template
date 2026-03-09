import { Stack, router } from 'expo-router';
import { useEffect } from 'react';

export default function AppLayout() {
  // TODO: Replace with real auth check (e.g. Clerk useAuth)
  const isAuthenticated = true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/welcome');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
