import { Image } from 'expo-image';
import { Text, View } from 'react-native';

export function PawMark({ size = 72, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <View className="items-center">
      <Image
        source={require('@/assets/images/paw-icon.png')}
        style={{ width: size, height: size }}
        contentFit="contain"
        accessibilityLabel="dostum"
      />
      {showWordmark ? (
        <Text className="text-forest font-bold text-2xl mt-3 tracking-tight">
          dostum<Text className="text-amber">.</Text>
        </Text>
      ) : null}
    </View>
  );
}