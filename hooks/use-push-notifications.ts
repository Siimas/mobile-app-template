import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const registerToken = useMutation(api.pushNotifications.registerPushToken);

  useEffect(() => {
    registerForPushNotifications()
      .then((token) => {
        if (token) registerToken({ token });
      })
      .catch((err) => {
        console.error("[PushNotifications] Failed to register:", err);
      });
  }, [registerToken]);
}

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission denied.");
    return null;
  }

  const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
  if (!projectId) {
    console.error("[PushNotifications] EXPO_PUBLIC_PROJECT_ID is not set. Cannot get push token.");
    return null;
  }
  let tokenData;
  try {
    tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  } catch (err) {
    console.error("[PushNotifications] getExpoPushTokenAsync failed:", err);
    return null;
  }
  return tokenData.data;
}
