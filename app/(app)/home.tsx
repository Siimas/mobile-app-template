import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const sendNotification = useMutation(api.pushNotifications.sendNotification);

  async function handleTestNotification() {
    try {
      await sendNotification({
        title: 'Test Notification',
        body: 'Push notifications are working!',
      });
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to send notification');
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-6xl font-bold">Home</Text>
        <TouchableOpacity
          className="bg-black px-10 py-4 rounded-2xl"
          onPress={handleTestNotification}
        >
          <Text className="text-white text-base font-semibold">Send Test Notification</Text>
        </TouchableOpacity>
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
