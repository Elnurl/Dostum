import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/lib/format';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function SitterMessages() {
  const insets = useSafeAreaInsets();
  const { chats, messages, bookings } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const base = chats.filter((c) => {
      if (c.sitterId.startsWith('owner-')) return true;
      const b = bookings.find((bk) => bk.id === c.bookingId);
      return !!b && b.status === 'aktiv';
    });
    if (!q.trim()) return base;
    const s = q.toLowerCase();
    return base.filter((c) => c.title.toLowerCase().includes(s) || c.subtitle.toLowerCase().includes(s));
  }, [chats, bookings, q]);

  return (
    <ScreenPad className="bg-white">
      <View style={{ paddingTop: insets.top + 8 }} className="px-4">
        <View className="flex-row items-center bg-sheet rounded-full px-4 py-3 mb-2 border border-line">
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Axtar"
            className="flex-1 ml-2 text-ink"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor={accent}
            onRefresh={() => {
              void tap();
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 500);
            }}
          />
        }>
        {list.length === 0 ? (
          <View className="items-center py-20 px-6">
            <Text className="text-ink font-bold text-xl text-center">Hələ yazışma yoxdur</Text>
            <Text className="text-muted text-center mt-2 leading-5">Sahiblərdən gələn mesajlar burada görünəcək.</Text>
          </View>
        ) : (
          list.map((chat) => {
            const last = [...messages].reverse().find((m) => m.chatId === chat.id);
            return (
              <Tap
                key={chat.id}
                onPress={() => router.push(`/chat/${chat.id}`)}
                className="bg-white border border-line rounded-2xl p-3 mb-3 flex-row items-center">
                <Avatar uri={chat.photo} name={chat.title} size={52} />
                <View className="flex-1 ml-3">
                  <View className="flex-row justify-between">
                    <Text className="text-ink font-semibold">{chat.title}</Text>
                    {last ? <Text className="text-muted text-[11px]">{formatTime(last.at)}</Text> : null}
                  </View>
                  <Text className="text-muted text-sm mt-0.5" numberOfLines={1}>
                    {last?.text ?? chat.subtitle}
                  </Text>
                </View>
                {chat.unread > 0 ? (
                  <View className="bg-amber min-w-[20px] h-5 px-1.5 rounded-full items-center justify-center ml-2">
                    <Text className="text-white text-[11px] font-bold">{chat.unread}</Text>
                  </View>
                ) : null}
              </Tap>
            );
          })
        )}
      </ScrollView>
    </ScreenPad>
  );
}
