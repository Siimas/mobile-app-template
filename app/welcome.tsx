import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold">Welcome</Text>
      </View>
      <View className="items-center pb-12">
        <TouchableOpacity
          className="bg-black px-10 py-4 rounded-2xl"
          onPress={() => router.push('/onboarding')}
        >
          <Text className="text-white text-base font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
