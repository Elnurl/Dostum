import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Card, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { colors } from '@/src/theme';

export default function SitterClientsScreen() {
  const insets = useSafeAreaInsets();
  const { bookings, chats } = useApp();
  const [q, setQ] = useState('');

  const clients = useMemo(() => {
    const names = new Map<string, { name: string; pet?: string; photo?: string }>();
    bookings
      .filter((b) => b.forUserAs === 'sitter' && b.status !== 'imtina')
      .forEach((b) => {
        names.set(b.ownerName, { name: b.ownerName, pet: b.guestPetName });
      });
    chats
      .filter((c) => c.sitterId.startsWith('owner-'))
      .forEach((c) => {
        if (!names.has(c.title)) names.set(c.title, { name: c.title, photo: c.photo });
      });
    let list = [...names.values()];
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(s) || (c.pet ?? '').toLowerCase().includes(s));
    }
    return list;
  }, [bookings, chats, q]);

  return (
    <ScreenPad className="bg-white">
      <View style={{ paddingTop: insets.top + 8 }} className="px-4">
        <Text className="text-ink font-bold text-2xl text-center mb-4">Müştərilər</Text>
        <View className="flex-row items-center bg-sheet rounded-full px-4 py-3 mb-4 border border-line">
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Ada və ya heyvanla axtar"
            className="flex-1 ml-2 text-ink"
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {clients.length === 0 ? (
          <View className="items-center py-16 px-4">
            <View className="w-20 h-20 rounded-full bg-sheet items-center justify-center">
              <Ionicons name="people-outline" size={36} color={colors.muted} />
            </View>
            <Text className="text-ink font-bold text-xl mt-6 text-center">Hələ müştəri yoxdur</Text>
            <Text className="text-muted text-center mt-2 leading-5">
              Sizə sorğu göndərən və ya rəy yazan sahiblər burada görünəcək.
            </Text>
          </View>
        ) : (
          clients.map((c) => (
            <Tap key={c.name} className="bg-white border border-line rounded-2xl p-4 mb-3 flex-row items-center">
              <Avatar uri={c.photo} name={c.name} size={52} />
              <View className="ml-3 flex-1">
                <Text className="text-ink font-semibold">{c.name}</Text>
                {c.pet ? <Text className="text-muted text-sm">{c.pet}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Tap>
          ))
        )}
      </ScrollView>
    </ScreenPad>
  );
}