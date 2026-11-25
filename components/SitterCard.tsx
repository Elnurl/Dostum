import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Badge, Tap } from '@/components/ui';
import { manat } from '@/src/lib/format';
import { colors } from '@/src/theme';
import type { ServiceId, Sitter } from '@/src/types';

function walkMins(id: string) {
  const n = id.charCodeAt(1) % 35;
  return 18 + n;
}

function onlineLabel(id: string) {
  const days = (id.charCodeAt(2) % 12) + 1;
  return days === 1 ? 'Bu gün onlayn' : `${days} gün əvvəl onlayn`;
}

export function SitterCard({
  sitter,
  serviceId,
  index = 0,
  selected,
  onToggleSelect,
  onPress,
  onMessage,
}: {
  sitter: Sitter;
  serviceId?: ServiceId | 'all';
  index?: number;
  selected?: boolean;
  onToggleSelect?: () => void;
  onPress: () => void;
  onMessage?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const offered =
    serviceId && serviceId !== 'all' ? sitter.services.find((s) => s.serviceId === serviceId) : sitter.services[0];
  const unitAz =
    offered?.unit === 'gecə' ? 'gecə başına' : offered?.unit === 'saat' ? 'saatlıq' : offered?.unit ?? 'gün';

  const preview = sitter.bio.length > 120 && !expanded ? `${sitter.bio.slice(0, 118)}…` : sitter.bio;

  return (
    <View className="bg-white border border-line rounded-3xl p-4 mb-4">
      <View className="flex-row">
        <View>
          <Image
            source={{ uri: sitter.photo }}
            style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.sheet }}
            contentFit="cover"
          />
          {onToggleSelect ? (
            <Tap
              onPress={onToggleSelect}
              className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full items-center justify-center border-2 border-white ${
                selected ? 'bg-amber' : 'bg-forest'
              }`}>
              <Ionicons name={selected ? 'checkmark' : 'add'} size={16} color="#fff" />
            </Tap>
          ) : null}
        </View>

        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-start">
            <Text className="text-ink font-bold text-lg flex-1 pr-2">
              {index + 1}. {sitter.name.split(' ')[0]}
            </Text>
            <View className="items-end">
              <Text className="text-ink font-bold text-lg">{offered ? manat(offered.price) : '—'}</Text>
              <Text className="text-muted text-[11px]">{unitAz}</Text>
            </View>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="time-outline" size={13} color={colors.muted} />
            <Text className="text-muted text-xs ml-1">{onlineLabel(sitter.id)}</Text>
          </View>
          <View className="flex-row items-center mt-0.5">
            <Ionicons name="walk-outline" size={13} color={colors.muted} />
            <Text className="text-muted text-xs ml-1">~{walkMins(sitter.id)} dəq məsafə</Text>
          </View>
          <View className="flex-row items-center mt-0.5">
            <Ionicons name="star" size={13} color={colors.amber} />
            <Text className="text-ink text-xs font-semibold ml-1">
              {sitter.rating} · {sitter.reviewCount} rəy
            </Text>
            <Text className="text-muted text-xs ml-2">· {sitter.district}</Text>
          </View>
          {sitter.verified ? (
            <View className="mt-1 self-start">
              <Badge text="ID təsdiqlənib" />
            </View>
          ) : null}
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-line">
        <View className="flex-row items-center mb-1">
          <Ionicons name="sparkles" size={16} color={colors.amber} />
          <Text className="text-forest font-bold text-sm ml-1">AI icmalı</Text>
        </View>
        <Text className="text-ink text-sm leading-5">
          {preview}{' '}
          {sitter.bio.length > 120 ? (
            <Text onPress={() => setExpanded((v) => !v)} className="text-forest font-semibold">
              {expanded ? 'Daha az' : 'Daha çox'}
            </Text>
          ) : null}
        </Text>
      </View>

      {onMessage ? (
        <View className="flex-row gap-2 mt-3">
          <Tap onPress={onMessage} className="flex-1 bg-forest rounded-2xl py-3 items-center">
            <Text className="text-white font-bold text-sm">Mesaj (pulsuz)</Text>
          </Tap>
          <Tap onPress={onPress} className="flex-1 bg-white border border-forest/30 rounded-2xl py-3 items-center">
            <Text className="text-forest font-bold text-sm">Profil</Text>
          </Tap>
        </View>
      ) : (
        <Tap onPress={onPress} className="mt-3 py-2">
          <Text className="text-forest font-semibold text-center">Profilə bax →</Text>
        </Tap>
      )}
    </View>
  );
}