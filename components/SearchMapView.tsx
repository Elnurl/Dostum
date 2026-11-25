import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { Tap } from '@/components/ui';
import { manat } from '@/src/lib/format';
import { BAKU_MAP_LABELS, sittersToMapPins } from '@/src/lib/mapMock';
import { colors } from '@/src/theme';
import type { ServiceId, ServiceIdOrAll, Sitter } from '@/src/types';

export function SearchMapView({
  sitters,
  serviceId,
  districtLabel,
  onOpenProfile,
}: {
  sitters: Sitter[];
  serviceId: ServiceIdOrAll;
  districtLabel?: string;
  onOpenProfile: (sitter: Sitter) => void;
}) {
  const { width } = useWindowDimensions();
  const mapHeight = Math.min(420, Math.round(width * 1.05));
  const pins = useMemo(() => sittersToMapPins(sitters), [sitters]);
  const [activeId, setActiveId] = useState<string | null>(pins[0]?.sitter.id ?? null);

  const active = pins.find((p) => p.sitter.id === activeId)?.sitter ?? pins[0]?.sitter;
  const offered =
    active && serviceId !== 'all'
      ? active.services.find((s) => s.serviceId === serviceId) ?? active.services[0]
      : active?.services[0];

  if (sitters.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8 pb-28">
        <Text className="text-muted text-center">Xəritədə göstərmək üçün baxıcı tapılmadı.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 pb-4">
      <View
        style={{ height: mapHeight }}
        className="mx-3 mt-2 rounded-3xl overflow-hidden border border-line bg-moss">
        <View className="absolute inset-0 bg-moss" />
        {BAKU_MAP_LABELS.map((l) => (
          <Text
            key={l.label}
            className="absolute text-[10px] text-forest/50 font-semibold"
            style={{ left: `${l.x * 100}%`, top: `${l.y * 100}%` }}>
            {l.label}
          </Text>
        ))}
        <View
          className="absolute rounded-full"
          style={{ left: '18%', right: '22%', top: '38%', height: 32, backgroundColor: 'rgba(125, 211, 252, 0.35)' }}
        />
        <Text className="absolute right-3 top-3 bg-white/90 px-2 py-1 rounded-full text-[11px] text-ink font-semibold">
          Bakı · {sitters.length} baxıcı{districtLabel ? ` · ${districtLabel}` : ''}
        </Text>
        {pins.map(({ sitter, x, y }) => {
          const selected = sitter.id === activeId;
          const price =
            serviceId !== 'all'
              ? sitter.services.find((s) => s.serviceId === serviceId)?.price ?? sitter.services[0]?.price
              : sitter.services[0]?.price;
          return (
            <View
              key={sitter.id}
              style={{
                position: 'absolute',
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                marginLeft: -18,
                marginTop: -36,
              }}
              className="items-center">
              <Tap onPress={() => setActiveId(sitter.id)} className="items-center">
              <View
                className={`px-2 py-0.5 rounded-full mb-1 ${selected ? 'bg-forest' : 'bg-white border border-line'}`}>
                <Text className={`text-[11px] font-bold ${selected ? 'text-white' : 'text-ink'}`}>
                  {manat(price ?? 0)}
                </Text>
              </View>
              <View
                className={`w-9 h-9 rounded-full border-2 items-center justify-center ${
                  selected ? 'border-forest bg-forest' : 'border-forest bg-white'
                }`}>
                <Text className="text-base">🐾</Text>
              </View>
              </Tap>
            </View>
          );
        })}
      </View>

      {active ? (
        <View className="mx-3 mt-3 bg-white border border-line rounded-2xl p-3 flex-row items-center">
          <Image
            source={{ uri: active.photo }}
            style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.sheet }}
            contentFit="cover"
          />
          <View className="flex-1 ml-3">
            <Text className="text-ink font-bold text-base">{active.name.split(' ')[0]}</Text>
            <Text className="text-muted text-xs">
              ★ {active.rating} · {active.district}
              {offered ? ` · ${manat(offered.price)}/${offered.unit}` : ''}
            </Text>
            <Text className="text-forest text-xs mt-0.5" numberOfLines={1}>
              {active.short}
            </Text>
          </View>
          <Tap
            onPress={() => onOpenProfile(active)}
            className="bg-forest rounded-xl px-3 py-2.5 ml-2">
            <Text className="text-white font-bold text-sm">Profil</Text>
          </Tap>
        </View>
      ) : null}
    </View>
  );
}