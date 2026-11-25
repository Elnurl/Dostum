import { Image } from 'expo-image';
import { Text, View } from 'react-native';

export function PawMark({
  size = 72,
  showWordmark = true,
  inline = false,
}: {
  size?: number;
  showWordmark?: boolean;
  /** Ana səhifə: ayaq izi və söz yan-yana */
  inline?: boolean;
}) {
  const wordmark = showWordmark ? (
    <Text className={`text-forest font-bold tracking-tight ${inline ? 'text-xl ml-2.5' : 'text-2xl mt-3'}`}>
      dostum<Text className="text-amber">.</Text>
    </Text>
  ) : null;

  if (inline) {
    return (
      <View className="flex-row items-center">
        <Image
          source={require('@/assets/images/paw-icon.png')}
          style={{ width: size, height: size }}
          contentFit="contain"
          accessibilityLabel="dostum"
        />
        {wordmark}
      </View>
    );
  }

  return (
    <View className="items-center">
      <Image
        source={require('@/assets/images/paw-icon.png')}
        style={{ width: size, height: size }}
        contentFit="contain"
        accessibilityLabel="dostum"
      />
      {wordmark}
    </View>
  );
}