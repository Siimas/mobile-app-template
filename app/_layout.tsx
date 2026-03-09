import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* TODO: Wrap with ConvexProvider and ClerkProvider */}
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
