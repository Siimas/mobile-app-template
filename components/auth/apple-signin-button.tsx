import { useState } from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export function AppleSignInButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <TouchableOpacity
      className={`mt-3 w-full flex-row items-center justify-center rounded-2xl bg-black py-4`}>
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text className="mr-3 text-xl font-bold text-white">{'\uF8FF'}</Text>
          <Text className="text-base font-semibold text-white">Continue with Apple</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
