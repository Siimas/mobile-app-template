import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const self = useQuery(api.users.getSelf);

  if (self === undefined)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );

  if (self === null) {
    //how to handle this?
  }

  if (!self?.hasCompletedOnboarding) return <Redirect href={'/onboarding'} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
