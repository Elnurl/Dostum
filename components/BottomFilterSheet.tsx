import { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { Sheet } from '@/components/Sheet';

/** Filtrlər — Modal əsasında (Expo Go-da etibarlı toxunuş) */
export function BottomFilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onClose={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
        contentContainerStyle={{ paddingBottom: 12 }}>
        {children}
      </ScrollView>
    </Sheet>
  );
}