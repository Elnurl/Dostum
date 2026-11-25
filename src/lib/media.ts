import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export async function pickFromLibrary() {
  try {
    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('İcazə lazımdır', 'Qalereyadan şəkil seçmək üçün icazə verin.');
        return null;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return null;
    return result.assets[0]?.uri ?? null;
  } catch {
    Alert.alert('Xəta', 'Şəkil seçilmədi. Yenidən cəhd edin.');
    return null;
  }
}

export async function pickVideo() {
  try {
    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('İcazə lazımdır', 'Video seçmək üçün qalereyaya icazə verin.');
        return null;
      }
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      quality: 0.85,
      videoMaxDuration: 45,
    });
    if (result.canceled) return null;
    return result.assets[0]?.uri ?? null;
  } catch {
    Alert.alert('Xəta', 'Video seçilmədi.');
    return null;
  }
}

export async function takePhoto() {
  try {
    if (Platform.OS !== 'web') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('İcazə lazımdır', 'Kamera üçün icazə verin.');
        return null;
      }
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return null;
    return result.assets[0]?.uri ?? null;
  } catch {
    Alert.alert('Kamera açıla bilmədi', 'Əvəzinə qalereyadan şəkil seçin.');
    return null;
  }
}
