import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <TouchableOpacity
      className={`w-full flex-row items-center justify-center rounded-2xl border border-gray-300 bg-white py-4 `}
      onPress={() => router.push('/(app)/home')}>
      {isLoading ? (
        <ActivityIndicator color="#4285F4" />
      ) : (
        <>
          {/* Replace this with the google icon */}
          <Text className="mr-3 text-xl font-bold" style={{ color: '#4285F4' }}>
            G
          </Text>
          <Text className="text-base font-semibold text-gray-800">Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
