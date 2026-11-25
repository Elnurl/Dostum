import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { colors } from '@/src/theme';

export function OnboardingShell({
  progress,
  title,
  subtitle,
  children,
  primaryLabel = 'Davam et',
  onPrimary,
  primaryDisabled,
  onBack,
  hideProgress,
}: {
  progress: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  onBack?: () => void;
  hideProgress?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScreenPad className="bg-white">
      <View style={{ paddingTop: insets.top + 8 }} className="px-4">
        <View className="flex-row items-center mb-4">
          <Tap
            onPress={() => {
              if (onBack) onBack();
              else router.back();
            }}
            className="w-10 h-10 rounded-full items-center justify-center bg-sheet">
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
          </Tap>
          {!hideProgress ? (
            <View className="flex-1 ml-3 h-2 rounded-full bg-line overflow-hidden">
              <View className="h-2 rounded-full bg-forest" style={{ width: `${Math.round(progress * 100)}%` }} />
            </View>
          ) : (
            <View className="flex-1" />
          )}
        </View>
        <Text className="text-ink font-bold text-2xl leading-8 mb-2">{title}</Text>
        {subtitle ? <Text className="text-muted text-base leading-6 mb-4">{subtitle}</Text> : null}
      </View>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {children}
      </ScrollView>
      {onPrimary ? (
        <View
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          className="px-4 pt-2 border-t border-line bg-white">
          <PrimaryButton label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} />
        </View>
      ) : null}
    </ScreenPad>
  );
}