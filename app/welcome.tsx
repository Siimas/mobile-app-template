import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold">Welcome</Text>
      </View>
      <View className="items-center gap-3 pb-12">
        <TouchableOpacity
          className="bg-black w-64 py-4 rounded-2xl items-center"
          onPress={() => router.push('/onboarding')}
        >
          <Text className="text-white text-base font-semibold">Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="border border-gray-300 w-64 py-4 rounded-2xl items-center"
          onPress={() => router.push('/login')}
        >
          <Text className="text-base font-semibold text-gray-800">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
