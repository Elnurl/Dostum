import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Tapılmadı', headerShown: true }} />
      <View className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-ink font-bold text-xl mb-2">Səhifə tapılmadı</Text>
        <Link href="/" className="text-forest font-semibold">
          Ana səhifəyə qayıt
        </Link>
      </View>
    </>
  );
}
