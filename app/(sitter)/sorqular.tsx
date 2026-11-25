import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatDate, manat, PET_TYPE_LABEL, SERVICE_LABEL } from '@/src/lib/format';
import { successTap, tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
import { colors } from '@/src/theme';

type Tab = 'müsait' | 'müraciət' | 'qaçırılmış';

export default function SitterRequestsScreen() {
  const insets = useSafeAreaInsets();
  const { requests, decideRequest, accepting, bookings } = useApp();
  const [tab, setTab] = useState<Tab>('müsait');
  const [refreshing, setRefreshing] = useState(false);

  const applied = useMemo(
    () => bookings.filter((b) => b.forUserAs === 'sitter' && b.status === 'gozlemede'),
    [bookings],
  );

  return (
    <ScreenPad className="bg-white">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32, paddingHorizontal: 16 }}
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
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-ink font-bold text-3xl">Sorğular</Text>
          <View className="flex-row gap-2">
            <Ionicons name="options-outline" size={22} color={colors.ink} />
            <Ionicons name="help-circle-outline" size={22} color={colors.ink} />
          </View>
        </View>

        <View className="flex-row bg-sheet rounded-2xl p-1 mb-5">
          {(
            [
              ['müsait', 'Müsait'],
              ['müraciət', 'Müraciət etdim'],
              ['qaçırılmış', 'Qaçırılmış'],
            ] as const
          ).map(([id, label]) => (
            <Tap
              key={id}
              onPress={() => setTab(id)}
              className={`flex-1 py-2.5 rounded-xl items-center ${tab === id ? 'bg-white border border-forest/20' : ''}`}>
              <Text className={`font-semibold text-sm ${tab === id ? 'text-forest' : 'text-muted'}`}>{label}</Text>
            </Tap>
          ))}
        </View>

        {tab === 'müsait' && !accepting ? (
          <Card className="p-6 items-center">
            <Ionicons name="radio-outline" size={40} color={colors.muted} />
            <Text className="text-ink font-bold text-lg mt-4 text-center">Yaxınlıqda sorğu yoxdur</Text>
            <Text className="text-muted text-center mt-2 leading-5">
              Sahib lazım olanda sorğu burada görünəcək. Təqvimi yenil saxlayın.
            </Text>
          </Card>
        ) : null}

        {tab === 'müsait' && accepting && requests.length === 0 ? (
          <>
            <Card className="p-6 items-center mb-4">
              <Ionicons name="radio-outline" size={40} color={colors.muted} />
              <Text className="text-ink font-bold text-lg mt-4 text-center">Hazırda yaxınlıqda sorğu yoxdur</Text>
              <Text className="text-muted text-center mt-2 leading-5">
                Sahib sizin rayonunuzda baxıcı axtaranda sorğu burada görünəcək.
              </Text>
            </Card>
            <Text className="text-ink font-bold text-lg mb-3">Sorğular necə işləyir</Text>
            <HowRow icon="flash-outline" text="Sahiblər təcili hallarda sorğu paylaşır." />
            <HowRow icon="time-outline" text="Sorğu 24 saat açıq qalır, sonra bağlanır." />
            <HowRow icon="people-outline" text="Hər sorğuda 5 yer var — tez müraciət edən üstünlük qazanır." />
            <HowRow icon="shield-checkmark-outline" text="Güclü profil və rəylər daha çox sorğuya çıxış verir." />
          </>
        ) : null}

        {tab === 'müsait' && accepting
          ? requests.map((req) => (
              <Card key={req.id} className="p-4 mb-3">
                <Text className="text-ink font-semibold text-base">{req.ownerName}</Text>
                <Text className="text-amber font-medium mt-1">
                  {req.petName} · {PET_TYPE_LABEL[req.petType]}
                </Text>
                <Text className="text-muted text-sm mt-1">{req.note}</Text>
                <Text className="text-ink text-sm mt-2">
                  {SERVICE_LABEL[req.serviceId]} · {formatDate(req.startDate)}
                </Text>
                <Text className="text-forest font-bold mt-1">Qazanc: {manat(req.earn)}</Text>
                <View className="flex-row gap-2 mt-3">
                  <View className="flex-1">
                    <PrimaryButton
                      label="Müraciət et"
                      onPress={() => {
                        void successTap();
                        decideRequest(req.id, true);
                      }}
                    />
                  </View>
                </View>
              </Card>
            ))
          : null}

        {tab === 'müraciət' ? (
          applied.length ? (
            applied.map((b) => (
              <Card key={b.id} className="p-4 mb-3">
                <Text className="text-ink font-semibold">{b.ownerName}</Text>
                <Text className="text-muted text-sm">{SERVICE_LABEL[b.serviceId]} · gözləmədə</Text>
              </Card>
            ))
          ) : (
            <Card className="p-6 items-center">
              <Text className="text-muted">Hələ müraciət yoxdur.</Text>
            </Card>
          )
        ) : null}

        {tab === 'qaçırılmış' ? (
          <Card className="p-6 items-center">
            <Text className="text-muted text-center">Qaçırılmış sorğular burada görünəcək.</Text>
          </Card>
        ) : null}
      </ScrollView>
    </ScreenPad>
  );
}

function HowRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View className="flex-row items-start mb-4">
      <Ionicons name={icon} size={20} color={colors.forest} style={{ marginTop: 2 }} />
      <Text className="text-muted flex-1 ml-3 leading-5">{text}</Text>
    </View>
  );
}