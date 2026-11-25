import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { successTap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

const HOLD_MS = 3000;

export function ContractHoldButton({ onSigned, signed, signerName }: { onSigned: () => void; signed?: boolean; signerName?: string }) {
  const [hold, setHold] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  if (signed) {
    return (
      <View className="items-center py-6">
        <Text className="text-forest text-xl font-bold italic">{signerName || 'İmza'}</Text>
        <View className="flex-row items-center mt-3">
          <Ionicons name="checkmark-circle" size={18} color={colors.forest} />
          <Text className="text-muted ml-2 text-sm">Sözleşmə imzalandı</Text>
        </View>
      </View>
    );
  }

  function startHold() {
    if (timer.current) clearInterval(timer.current);
  const started = Date.now();
    timer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / HOLD_MS);
      setHold(p);
      if (p >= 1) {
        if (timer.current) clearInterval(timer.current);
        void successTap();
        onSigned();
      }
    }, 40);
  }

  function endHold() {
    if (timer.current) clearInterval(timer.current);
    if (hold < 1) setHold(0);
  }

  return (
    <Pressable onPressIn={startHold} onPressOut={endHold} className="rounded-2xl border-2 border-forest overflow-hidden bg-white">
      <View className="absolute left-0 top-0 bottom-0 bg-moss" style={{ width: `${hold * 100}%` }} />
      <View className="py-5 px-4 flex-row items-center justify-center">
        <Ionicons name="finger-print-outline" size={28} color={colors.forestDark} />
        <Text className="text-forest-dark font-bold text-base ml-3">3 saniyə basılı saxlayın — imzalayın</Text>
      </View>
    </Pressable>
  );
}