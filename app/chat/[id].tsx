import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { PhotoSheet } from '@/components/PhotoSheet';
import { WalkMap } from '@/components/WalkMap';
import { Chip, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { TASKS } from '@/src/data/catalog';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/lib/format';
import { colors } from '@/src/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const {
    chats,
    messages,
    sendMessage,
    markChatRead,
    mode,
    bookings,
    walks,
    startWalk,
    stopWalk,
    sendReport,
  } = useApp();
  const chat = chats.find((c) => c.id === id);
  const thread = useMemo(() => messages.filter((m) => m.chatId === id), [messages, id]);
  const [text, setText] = useState('');
  const [photoOpen, setPhotoOpen] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) markChatRead(id);
  }, [id, markChatRead]);

  const booking = bookings.find((b) => b.id === chat?.bookingId);
  const walk = walks.find((w) => w.bookingId === booking?.id);
  const isSitterChat = mode === 'sitter' && chat?.sitterId.startsWith('owner-');
  const canReport = isSitterChat && booking?.status === 'aktiv';

  if (!chat) {
    return (
      <ScreenPad>
        <Header title="Çat" />
        <Text className="px-5 text-muted">Söhbət tapılmadı.</Text>
      </ScreenPad>
    );
  }

  return (
    <ScreenPad>
      <Header title={chat.title} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }} className="flex-1">
          {walk ? (
            <View className="mb-3">
              <WalkMap walk={walk} />
            </View>
          ) : null}
          {thread.map((m) => {
            const mine = m.fromMe === (mode === 'sitter' ? isSitterChat : true) || (mode === 'owner' && m.fromMe);
            const align = mine ? 'items-end' : 'items-start';
            const bubble = mine ? 'bg-forest' : 'bg-white';
            const fg = mine ? 'text-white' : 'text-ink';
            return (
              <View key={m.id} className={`${align} mb-2`}>
                <View className={`${bubble} rounded-2xl px-3 py-2 max-w-[82%]`}>
                  {m.photoUri ? (
                    <Image
                      source={{ uri: m.photoUri }}
                      style={{ width: 200, height: 140, borderRadius: 12, marginBottom: 6 }}
                      contentFit="cover"
                    />
                  ) : null}
                  <Text className={fg}>{m.text}</Text>
                  <Text className={`${mine ? 'text-white/70' : 'text-muted'} text-[10px] mt-1`}>{formatTime(m.at)}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {canReport ? (
          <View className="px-4 pb-2">
            <Text className="text-ink font-semibold mb-2">Canlı hesabat göndər</Text>
            <View className="flex-row flex-wrap">
              {TASKS.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  active={tasks.includes(t)}
                  onPress={() => setTasks((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))}
                />
              ))}
            </View>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Qısa qeyd..."
              className="bg-white rounded-xl px-3 py-2 text-ink mb-2"
            />
            <View className="flex-row gap-2 mb-2">
              {walk?.active ? (
                <View className="flex-1">
                  <PrimaryButton label="Gəzintini bitir" onPress={() => stopWalk(walk.id)} />
                </View>
              ) : (
                <View className="flex-1">
                  <PrimaryButton
                    label="GPS gəzinti başlat"
                    tone="forest"
                    onPress={() => void startWalk(booking!.id, chat.id)}
                  />
                </View>
              )}
              <Tap
                onPress={() => setPhotoOpen(true)}
                className="w-14 rounded-2xl bg-white border border-line items-center justify-center">
                <Ionicons name="camera-outline" size={22} color={colors.ink} />
              </Tap>
            </View>
            <PrimaryButton
              label="Hesabatı göndər"
              disabled={!note && tasks.length === 0}
              onPress={() => {
                sendReport({ bookingId: booking!.id, chatId: chat.id, note: note || tasks.join(', '), tasks });
                setNote('');
                setTasks([]);
              }}
            />
          </View>
        ) : null}

        <View
          style={{ paddingBottom: Math.max(insets.bottom, 10) }}
          className="flex-row items-end px-4 pt-2 bg-cream">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Mesaj yazın..."
            className="flex-1 bg-white rounded-2xl px-4 py-3 text-ink mr-2"
            multiline
          />
          <Tap
            onPress={() => {
              if (!text.trim()) return;
              sendMessage(chat.id, text.trim());
              setText('');
            }}
            className="w-12 h-12 rounded-full bg-forest items-center justify-center">
            <Ionicons name="send" size={18} color="#fff" />
          </Tap>
        </View>
      </KeyboardAvoidingView>
      <PhotoSheet
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        onPicked={(uri) => {
          if (!booking) return;
          sendReport({
            bookingId: booking.id,
            chatId: chat.id,
            note: note || 'Canlı foto hesabat',
            photoUri: uri,
            tasks,
          });
          setNote('');
        }}
      />
    </ScreenPad>
  );
}
