import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, EmptyState, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/lib/format';

export default function SitterMessages() {
  const insets = useSafeAreaInsets();
  const { chats, messages } = useApp();
  const list = chats.filter((c) => c.sitterId.startsWith('owner-'));

  return (
    <ScreenPad>
      <View style={{ paddingTop: insets.top + 8 }} className="px-5 pb-2">
        <Text className="text-ink font-bold text-2xl">Mesajlar</Text>
        <Text className="text-muted text-sm mt-1">Sahiblərlə yazışma və canlı hesabat</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28 }}>
        {list.length === 0 ? (
          <EmptyState
            title="Müştəri mesajı yoxdur"
            text="Sorğunu qəbul etdikdə çat avtomatik açılır. Panelə qayıdıb sifariş qəbul edin."
          />
        ) : (
          list.map((chat) => {
            const last = [...messages].reverse().find((m) => m.chatId === chat.id);
            return (
              <Tap
                key={chat.id}
                onPress={() => router.push(`/chat/${chat.id}`)}
                className="bg-white rounded-2xl p-3 mb-3 flex-row items-center">
                <Avatar uri={chat.photo} name={chat.title} size={52} />
                <View className="flex-1 ml-3">
                  <View className="flex-row justify-between">
                    <Text className="text-ink font-semibold">{chat.title}</Text>
                    {last ? <Text className="text-muted text-[11px]">{formatTime(last.at)}</Text> : null}
                  </View>
                  <Text className="text-muted text-sm" numberOfLines={1}>
                    {last?.text ?? chat.subtitle}
                  </Text>
                </View>
              </Tap>
            );
          })
        )}
      </ScrollView>
    </ScreenPad>
  );
}
