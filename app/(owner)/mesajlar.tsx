import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, EmptyState, ScreenHeader, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/lib/format';
import { meetGreetLabel } from '@/src/lib/meetGreet';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';

export default function OwnerMessages() {
  const insets = useSafeAreaInsets();
  const { chats, messages } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const list = chats.filter((c) => !c.sitterId.startsWith('owner-'));

  return (
    <ScreenPad>
      <View style={{ paddingTop: insets.top + 8 }}>
        <ScreenHeader
          title="Mesajlar"
          subtitle="Pulsuz mesaj · görüş · sonra sifariş. Aktiv sifarişdə canlı hesabat."
        />
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
          <EmptyState
            title="Hələ mesaj yoxdur"
            text="Axtarışdan baxıcıya pulsuz mesaj yazın və ya siyahıda + ilə toplu sorğu göndərin."
          />
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
                  <View className="flex-row items-center justify-between">
                    <Text className="text-ink font-semibold">{chat.title}</Text>
                    {last ? <Text className="text-muted text-[11px]">{formatTime(last.at)}</Text> : null}
                  </View>
                  <Text className="text-muted text-sm mt-0.5" numberOfLines={1}>
                    {last?.text ?? chat.subtitle}
                  </Text>
                  {meetGreetLabel(chat.meetGreet) ? (
                    <Text className="text-forest text-[11px] font-semibold mt-0.5">
                      {meetGreetLabel(chat.meetGreet)}
                    </Text>
                  ) : null}
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