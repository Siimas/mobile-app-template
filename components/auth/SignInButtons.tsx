import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export function SignInButtons() {
  return (
    <View className="mb-8">
      {error && <Text className="mb-4 text-center text-sm text-red-500">{error}</Text>}

      <TouchableOpacity
        className={`w-full flex-row items-center justify-center rounded-2xl border border-gray-300 bg-white py-4 ${!isGoogleLoading && isAnyLoading ? 'opacity-50' : ''}`}
        onPress={onGooglePress}
        disabled={isAnyLoading}>
        {isGoogleLoading ? (
          <ActivityIndicator color="#4285F4" />
        ) : (
          <>
            <Text className="mr-3 text-xl font-bold" style={{ color: '#4285F4' }}>
              G
            </Text>
            <Text className="text-base font-semibold text-gray-800">Continue with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`mt-3 w-full flex-row items-center justify-center rounded-2xl bg-black py-4 ${!isAppleLoading && isAnyLoading ? 'opacity-50' : ''}`}
        onPress={onApplePress}
        disabled={isAnyLoading}>
        {isAppleLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="mr-3 text-xl font-bold text-white">{'\uF8FF'}</Text>
            <Text className="text-base font-semibold text-white">Continue with Apple</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
