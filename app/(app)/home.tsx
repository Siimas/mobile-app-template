import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-6xl font-bold">Home</Text>
      </View>
      <View className="items-center pb-12">
        <TouchableOpacity
          className="border border-gray-300 px-10 py-4 rounded-2xl"
          onPress={() => router.replace('/welcome')}
        >
          <Text className="text-base font-semibold">Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
