import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PawMark } from '@/components/PawMark';
import { Chip, ScreenHeader, ScreenPad, Tap } from '@/components/ui';
import { AI_SUGGESTIONS, answerAssistant } from '@/src/data/ai';
import { useApp } from '@/src/context/AppContext';
import { formatTime } from '@/src/lib/format';
import { tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';

type Turn = { id: string; role: 'user' | 'assistant'; text: string; at: string };

export default function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const { bookings } = useApp();
  const active = bookings.find((b) => b.forUserAs === 'owner' && b.status === 'aktiv');
  const [input, setInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    {
      id: '0',
      role: 'assistant',
      text: 'Salam! Mən dostum AI köməkçisiyəm — 24/7 sorğu köməyi. Xidmət seçimi, escrow, rezervasiya və baxım barədə soruşun.',
      at: new Date().toISOString(),
    },
  ]);

  const supportHint = useMemo(() => {
    if (!active) return 'Aktiv sifariş yoxdur — yeni rezervasiya Axtarış tabından başlayır.';
    return `Aktiv sifariş: ${active.serviceId.replace(/-/g, ' ')}. Hesabatlar Mesajlar bölməsindədir.`;
  }, [active]);

  function ask(text: string) {
    const q = text.trim();
    if (!q) return;
    void tap();
    const at = new Date().toISOString();
    const reply = answerAssistant(q, active);
    setTurns((prev) => [
      ...prev,
      { id: `${prev.length}-u`, role: 'user', text: q, at },
      { id: `${prev.length}-a`, role: 'assistant', text: reply, at },
    ]);
    setInput('');
  }

  return (
    <ScreenPad>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <View style={{ paddingTop: insets.top + 8 }}>
          <View className="px-5 pb-1">
            <PawMark size={36} showWordmark={false} />
          </View>
          <ScreenHeader title="AI köməkçi" subtitle={`24/7 kömək · ${supportHint}`} />
        </View>

        <ScrollView
          className="flex-1 px-5"
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
          }
          contentContainerStyle={{ paddingBottom: 16 }}>
          {turns.map((t) => (
            <View key={t.id} className={`mb-3 ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
              <View
                className={`rounded-2xl px-4 py-3 max-w-[90%] ${
                  t.role === 'user' ? 'bg-forest' : 'bg-white border border-line'
                }`}>
                <Text className={t.role === 'user' ? 'text-white' : 'text-ink'}>{t.text}</Text>
                <Text className={`text-[10px] mt-1 ${t.role === 'user' ? 'text-white/70' : 'text-muted'}`}>
                  {formatTime(t.at)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="px-5 pb-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {AI_SUGGESTIONS.map((s) => (
              <Chip key={s} label={s} onPress={() => ask(s)} />
            ))}
          </ScrollView>
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 8) }}
            className="flex-row items-end bg-white border border-line rounded-2xl px-3 py-2">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Sualınızı yazın..."
              className="flex-1 text-ink py-2"
              multiline
            />
            <Tap onPress={() => ask(input)} className="w-10 h-10 rounded-full bg-forest items-center justify-center ml-2">
              <Text className="text-white font-bold">→</Text>
            </Tap>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenPad>
  );
}