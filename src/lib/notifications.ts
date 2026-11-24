import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

let configured = false;

export async function setupNotifications() {
  if (configured) return;
  configured = true;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    if (Platform.OS !== 'web') {
      await Notifications.requestPermissionsAsync();
    }
  } catch {
    /* web və ya simulyasiya */
  }
}

export async function notify(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } catch {
    /* ignore */
  }
}
