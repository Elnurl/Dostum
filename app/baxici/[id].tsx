import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { TrustStrip } from '@/components/TrustStrip';
import { Badge, Card, GhostButton, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { useApp } from '@/src/context/AppContext';
import { manat, SIZE_LABEL } from '@/src/lib/format';
import { colors } from '@/src/theme';
import type { ServiceId } from '@/src/types';

export default function SitterPublicProfile() {
  const { id, service } = useLocalSearchParams<{ id: string; service?: ServiceId }>();
  const insets = useSafeAreaInsets();
  const { sitterById, favorites, toggleFavorite, ensureChatWithSitter, chats } = useApp();
  const sitter = sitterById(id);
  const [serviceId, setServiceId] = useState<ServiceId>(
    (service as ServiceId) || sitter?.services[0]?.serviceId || 'geceleme',
  );

  if (!sitter) {
    return (
      <ScreenPad>
        <Header title="Baxıcı" />
        <Text className="px-5 text-muted">Baxıcı tapılmadı.</Text>
      </ScreenPad>
    );
  }

  const fav = favorites.includes(sitter.id);
  const offered = sitter.services.find((s) => s.serviceId === serviceId) ?? sitter.services[0];
  const chat = chats.find((c) => c.sitterId === sitter.id && !c.sitterId.startsWith('owner-'));
  const canBookDirect =
    Boolean(chat?.bookingId) || chat?.meetGreet === 'hazir' || chat?.meetGreet === 'sifaris';

  return (
    <ScreenPad>
      <Header
        title={sitter.name}
        right={
          <Tap onPress={() => toggleFavorite(sitter.id)} className="w-10 h-10 items-center justify-center">
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? colors.badge : colors.ink} />
          </Tap>
        }
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 110 }}>
        <Image
          source={{ uri: sitter.photo }}
          style={{ width: '100%', height: 220, borderRadius: 20, backgroundColor: colors.moss }}
          contentFit="cover"
        />
        <View className="flex-row items-center mt-3">
          <Text className="text-ink font-bold text-2xl flex-1">{sitter.name}</Text>
          {sitter.verified ? <Badge text="Şəxsiyyəti təsdiqlənib" /> : null}
        </View>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color={colors.amber} />
          <Text className="text-ink font-semibold ml-1">
            {sitter.rating} · {sitter.reviewCount} rəy
          </Text>
          <Text className="text-muted ml-2">· {sitter.district}</Text>
        </View>
        <Text className="text-ink mt-3 leading-5">{sitter.bio}</Text>
        <View className="mt-4">
          <TrustStrip />
        </View>

        <Text className="text-ink font-bold text-lg mt-5 mb-2">Xidmətlər</Text>
        {sitter.services.map((s) => {
          const meta = SERVICES.find((x) => x.id === s.serviceId);
          const active = s.serviceId === serviceId;
          return (
            <Tap
              key={s.serviceId}
              onPress={() => setServiceId(s.serviceId)}
              className={`flex-row items-center rounded-2xl px-4 py-3 mb-2 border ${
                active ? 'bg-moss border-forest' : 'bg-white border-line'
              }`}>
              <View className="flex-1">
                <Text className="text-ink font-semibold">{meta?.title}</Text>
                <Text className="text-muted text-xs">{meta?.description}</Text>
              </View>
              <Text className="text-amber font-bold">
                {manat(s.price)}/{s.unit}
              </Text>
            </Tap>
          );
        })}

        <Text className="text-ink font-bold text-lg mt-4 mb-2">Ev şəraiti</Text>
        <Card className="p-4">
          <Text className="text-ink">
            {sitter.homeType === 'heyet' ? 'Həyət evi' : 'Mənzil'} · {sitter.experienceYears} il təcrübə
          </Text>
          <Text className="text-muted mt-1">{sitter.ownPetsNote}</Text>
          <Text className="text-ink mt-2">
            Qəbul edilən ölçü: {sitter.acceptedSizes.map((s) => SIZE_LABEL[s]).join(', ')}
          </Text>
        </Card>

        {sitter.gallery.length > 0 ? (
          <>
            <Text className="text-ink font-bold text-lg mt-4 mb-2">Qalereya</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {sitter.gallery.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{ width: 160, height: 110, borderRadius: 14, marginRight: 10, backgroundColor: colors.moss }}
                  contentFit="cover"
                />
              ))}
            </ScrollView>
          </>
        ) : null}

        <Text className="text-ink font-bold text-lg mt-4 mb-2">Rəylər</Text>
        {sitter.reviews.map((r) => (
          <Card key={r.id} className="p-4 mb-2">
            <View className="flex-row justify-between">
              <Text className="text-ink font-semibold">{r.author}</Text>
              <Text className="text-amber font-semibold">★ {r.rating}</Text>
            </View>
            <Text className="text-muted text-xs mt-0.5">
              {r.petName} · {r.date}
            </Text>
            <Text className="text-ink mt-2">{r.text}</Text>
          </Card>
        ))}
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        className="absolute left-0 right-0 bottom-0 bg-white border-t border-line px-5 pt-3">
        <View className="flex-row items-end justify-between mb-2">
          <Text className="text-muted text-sm">Seçilmiş xidmət</Text>
          <Text className="text-ink font-bold text-lg">
            {offered ? `${manat(offered.price)}/${offered.unit}` : '—'}
          </Text>
        </View>
        <PrimaryButton
          label="Mesaj yaz (pulsuz)"
          onPress={() => {
            const chatId = ensureChatWithSitter(sitter.id);
            router.push(`/chat/${chatId}`);
          }}
        />
        <View className="h-2" />
        {canBookDirect ? (
          <GhostButton
            label="Sifariş et"
            onPress={() =>
              router.push({
                pathname: '/sifaris',
                params: { sitterId: sitter.id, service: serviceId },
              })
            }
          />
        ) : (
          <GhostButton
            label="Sifariş (görüşdən sonra)"
            onPress={() => {
              const chatId = ensureChatWithSitter(sitter.id);
              router.push(`/chat/${chatId}`);
            }}
          />
        )}
        <Text className="text-muted text-xs text-center mt-2">
          Kart tələb olunmur — əvvəl pulsuz mesaj və qısa görüş tövsiyə olunur.
        </Text>
      </View>
    </ScreenPad>
  );
}
