import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Tap } from '@/components/ui';
import { colors } from '@/src/theme';

export function SearchSelectionBar({
  pickedCount,
  onPress,
  onSend,
}: {
  pickedCount: number;
  onPress: () => void;
  onSend?: () => void;
}) {
  const hint =
    pickedCount > 0
      ? `${pickedCount} baxıcı seçildi — kim boşdur, soruşun`
      : '5 baxıcıya qədər seçin və kim boşdur soruşun';

  return (
    <View className="bg-white border-t border-line px-4 py-4 flex-row items-center">
      <Tap onPress={pickedCount > 0 && onSend ? onSend : onPress} className="flex-row items-center flex-1">
        <View className="w-8 h-8 rounded-full border border-line items-center justify-center mr-3">
          <Ionicons name="add" size={20} color={colors.muted} />
        </View>
        <Text className="text-muted text-[15px] flex-1 leading-5">{hint}</Text>
      </Tap>
      {pickedCount > 0 && onSend ? (
        <Tap onPress={onSend}>
          <Text className="text-amber font-bold text-sm ml-2">Göndər</Text>
        </Tap>
      ) : null}
    </View>
  );
}