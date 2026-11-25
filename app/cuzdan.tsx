import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { Header } from '@/components/Header';
import { Card, Chip, PrimaryButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatDate, formatTime, manat } from '@/src/lib/format';
import { successTap } from '@/src/lib/haptics';

export default function WalletScreen() {
  const { wallet, applyPromo, topup, payout, addCard, mode } = useApp();
  const [code, setCode] = useState('');
  const [last4, setLast4] = useState('');

  return (
    <ScreenPad>
      <Header title="Cüzdan" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View className="flex-row gap-2 mb-4">
          <Card className="flex-1 p-4">
            <Text className="text-muted text-xs">Mövcud balans</Text>
            <Text className="text-ink font-bold text-xl mt-1">{manat(wallet.available)}</Text>
          </Card>
          <Card className="flex-1 p-4">
            <Text className="text-muted text-xs">Escrow-da</Text>
            <Text className="text-amber font-bold text-xl mt-1">{manat(wallet.escrow)}</Text>
          </Card>
        </View>
        {mode === 'sitter' ? (
          <Card className="p-4 mb-4">
            <Text className="text-muted text-xs">Çıxarışa hazır</Text>
            <Text className="text-amber font-bold text-xl mt-1">{manat(wallet.sitterReady)}</Text>
            <View className="mt-3">
              <PrimaryButton
                label="Karta köçür"
                disabled={wallet.sitterReady <= 0}
                onPress={() => {
                  payout(wallet.sitterReady);
                  void successTap();
                  Alert.alert('Köçürüldü', 'Məbləğ 1–2 iş günündə kartınıza düşəcək (simulyasiya).');
                }}
              />
            </View>
          </Card>
        ) : null}

        <Text className="text-ink font-bold mb-2">Kartlar</Text>
        {wallet.cards.map((c) => (
          <Card key={c.id} className="p-4 mb-2">
            <Text className="text-ink font-semibold">{c.brand}</Text>
            <Text className="text-muted">•••• {c.last4} · {c.holder}</Text>
          </Card>
        ))}
        <View className="flex-row gap-2 mb-4">
          <TextInput
            value={last4}
            onChangeText={setLast4}
            placeholder="Son 4 rəqəm"
            keyboardType="number-pad"
            maxLength={4}
            className="flex-1 bg-white border border-line rounded-2xl px-4 py-3 text-ink"
          />
          <View className="w-36">
            <PrimaryButton
              label="Kart əlavə et"
              onPress={() => {
                if (last4.length !== 4) {
                  Alert.alert('Kart', 'Son 4 rəqəmi yazın.');
                  return;
                }
                addCard(last4);
                setLast4('');
              }}
            />
          </View>
        </View>

        <Text className="text-ink font-bold mb-2">Promo-kod</Text>
        {wallet.promo ? (
          <Text className="text-amber mb-4">{wallet.promo} tətbiq olundu · +10 ₼</Text>
        ) : (
          <View className="flex-row gap-2 mb-4">
            <TextInput
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
              placeholder="DOSTUM10"
              className="flex-1 bg-white border border-line rounded-2xl px-4 py-3 text-ink"
            />
            <View className="w-28">
              <PrimaryButton
                label="Tətbiq et"
                onPress={() => {
                  const ok = applyPromo(code);
                  Alert.alert(ok ? 'Promo işlədi' : 'Kod yanlışdır', ok ? '10 ₼ balansınıza əlavə olundu.' : 'DOSTUM10 və ya LEO10 yoxlayın.');
                  if (ok) setCode('');
                }}
              />
            </View>
          </View>
        )}

        <Text className="text-ink font-bold mb-2">Balansı artır</Text>
        <View className="flex-row flex-wrap mb-4">
          {[20, 50, 100].map((n) => (
            <Chip
              key={n}
              label={`+${manat(n)}`}
              onPress={() => {
                topup(n);
                void successTap();
              }}
            />
          ))}
        </View>

        <Text className="text-ink font-bold mb-2">Tarixçə</Text>
        {wallet.history.map((tx) => (
          <View key={tx.id} className="flex-row items-center py-3 border-b border-line">
            <View className="flex-1">
              <Text className="text-ink">{tx.title}</Text>
              <Text className="text-muted text-xs">
                {formatDate(tx.at.slice(0, 10))} · {formatTime(tx.at)}
              </Text>
            </View>
            <Text className={`font-semibold ${tx.amount >= 0 ? 'text-amber' : 'text-ink'}`}>
              {tx.amount > 0 ? '+' : ''}
              {manat(tx.amount)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ScreenPad>
  );
}
