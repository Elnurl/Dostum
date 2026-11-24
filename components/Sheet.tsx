import { ReactNode, useEffect } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const y = useSharedValue(40);
  const opacity = useSharedValue(0);

  useEffect(() => {
    y.value = withTiming(open ? 0 : 40, { duration: 220 });
    opacity.value = withTiming(open ? 1 : 0, { duration: 220 });
  }, [open, opacity, y]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));
  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 justify-end">
        <Animated.View style={[{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.4)' }, fade]}>
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[sheetStyle, { paddingBottom: Math.max(insets.bottom, 16) }]}
          className="bg-cream rounded-t-3xl px-5 pt-3 max-h-[88%]">
          <View className="w-12 h-1.5 bg-line rounded-full self-center mb-3" />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
