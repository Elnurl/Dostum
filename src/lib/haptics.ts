import * as Haptics from 'expo-haptics';

export async function tap() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* web və ya icazə yoxdur */
  }
}

export async function successTap() {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    /* ignore */
  }
}
