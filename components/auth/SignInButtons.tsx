import { useState } from 'react';
import { View, Text } from 'react-native';
import { GoogleSignInButton } from './google-signin-button copy';
import { AppleSignInButton } from './apple-signin-button';

export function SignInButtons() {
  const [error, setError] = useState<string | null>(null);

  return (
    <View className="mb-8">
      {error && <Text className="mb-4 text-center text-sm text-red-500">{error}</Text>}

      <GoogleSignInButton />
      <AppleSignInButton />
    </View>
  );
}
