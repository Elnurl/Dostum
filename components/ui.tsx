import { Image } from 'expo-image';
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { tap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

export function Logo({ height = 32 }: { height?: number }) {
  return (
    <Image
      source={require('@/assets/logo.png')}
      style={{ height, width: height * 4.4 }}
      contentFit="contain"
      accessibilityLabel="dostum"
    />
  );
}

export function ScreenPad({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`flex-1 bg-cream ${className}`}>{children}</View>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`bg-white rounded-2xl ${className}`}>{children}</View>;
}

export function Title({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <Text className={`text-ink font-bold ${className}`}>{children}</Text>;
}

export function Muted({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <Text className={`text-muted ${className}`}>{children}</Text>;
}

export function Tap({
  children,
  onPress,
  className,
  disabled,
}: {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (disabled) return;
        void tap();
        onPress?.();
      }}
      className={`active:opacity-80 ${disabled ? 'opacity-50' : ''} ${className ?? ''}`}>
      {children}
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
  tone = 'amber',
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  tone?: 'amber' | 'forest';
}) {
  const bg = tone === 'forest' ? 'bg-forest' : 'bg-amber';
  return (
    <Tap onPress={onPress} disabled={disabled} className={`${bg} rounded-2xl py-4 items-center`}>
      <Text className="text-white font-bold text-base">{label}</Text>
    </Tap>
  );
}

export function GhostButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Tap onPress={onPress} className="rounded-2xl py-4 items-center border border-line bg-white">
      <Text className="text-ink font-semibold">{label}</Text>
    </Tap>
  );
}

export function Avatar({ uri, name, size = 64 }: { uri?: string; name: string; size?: number }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.moss }}
        contentFit="cover"
      />
    );
  }
  return (
    <View
      className="items-center justify-center bg-moss"
      style={{ width: size, height: size, borderRadius: size / 2 }}>
      <Text className="text-forest font-bold" style={{ fontSize: size * 0.32 }}>
        {initials}
      </Text>
    </View>
  );
}

export function Badge({ text }: { text: string }) {
  return (
    <View className="bg-moss px-2 py-1 rounded-full flex-row items-center">
      <Text className="text-forest text-[11px] font-semibold">{text}</Text>
    </View>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <View className="items-center py-10 px-6">
      <Text className="text-4xl mb-3">🐾</Text>
      <Text className="text-ink font-semibold text-base mb-1">{title}</Text>
      <Text className="text-muted text-center text-sm">{text}</Text>
    </View>
  );
}

export function LoadingScreen() {
  return (
    <View className="flex-1 bg-cream items-center justify-center">
      <Logo height={40} />
      <ActivityIndicator color={colors.forest} style={{ marginTop: 18 }} />
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text className="text-muted text-xs font-semibold tracking-widest uppercase mb-2 px-1">{children}</Text>;
}

export function Divider() {
  return <View className="h-px bg-line" />;
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Tap
      onPress={onPress}
      className={`px-3 py-2 rounded-full mr-2 mb-2 ${active ? 'bg-forest' : 'bg-white border border-line'}`}>
      <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-ink'}`}>{label}</Text>
    </Tap>
  );
}

export function StatusPill({ status }: { status: 'gozlemede' | 'aktiv' | 'tamamlanmis' | 'imtina' }) {
  const map = {
    gozlemede: { bg: 'bg-amber/15', fg: 'text-amber', label: 'Gözləmədə' },
    aktiv: { bg: 'bg-moss', fg: 'text-forest', label: 'Aktiv' },
    tamamlanmis: { bg: 'bg-line', fg: 'text-muted', label: 'Tamamlanmış' },
    imtina: { bg: 'bg-red-50', fg: 'text-red-600', label: 'İmtina' },
  } as const;
  const s = map[status];
  return (
    <View className={`${s.bg} px-2.5 py-1 rounded-full`}>
      <Text className={`${s.fg} text-xs font-semibold`}>{s.label}</Text>
    </View>
  );
}
