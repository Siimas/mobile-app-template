import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Paywall() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold">Paywall</Text>
      </View>
      <View className="flex-row items-center justify-center gap-4 pb-12">
        <TouchableOpacity
          className="border border-gray-300 px-10 py-4 rounded-2xl"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-black px-10 py-4 rounded-2xl"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white text-base font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
