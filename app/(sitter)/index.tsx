import { router } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PawMark } from '@/components/PawMark';
import { Card, EmptyState, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { formatDate, manat, PET_TYPE_LABEL, SERVICE_LABEL } from '@/src/lib/format';
import { successTap, tap } from '@/src/lib/haptics';
import { accent } from '@/src/lib/ui';
import { colors } from '@/src/theme';

export default function SitterHome() {
  const insets = useSafeAreaInsets();
  const { accepting, setAccepting, sitterEarnings, requests, decideRequest, user } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <ScreenPad>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32, paddingHorizontal: 20 }}
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
        <PawMark size={36} showWordmark />
        <Text className="text-ink font-bold text-2xl mt-3">Salam, {user.firstName}</Text>
        <Text className="text-muted mb-4">Baxıcı paneli</Text>

        <Card className="p-4 mb-4 bg-moss border-forest">
          <Text className="text-forest font-bold text-base">Sifarişlərdən 0% komissiya</Text>
          <Text className="text-muted text-sm mt-1 leading-5">
            Qazancınızın tamamı sizə qalır — platforma xidmət haqqı sahib tərəfindən ödənilir.
          </Text>
        </Card>

        <Card className="p-4 mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-ink font-semibold">Sifariş qəbul edirəm</Text>
            <Text className="text-muted text-sm mt-0.5">
              {accepting ? 'Onlaynsınız — yeni sorğular gələcək' : 'Oflaynsınız — sorğu gəlmir'}
            </Text>
          </View>
          <Switch
            value={accepting}
            onValueChange={(v) => {
              void tap();
              setAccepting(v);
            }}
            trackColor={{ false: '#E7E5E4', true: colors.forest }}
            thumbColor="#fff"
          />
        </Card>

        <View className="flex-row gap-2 mb-5">
          <Earn label="Bu ay" value={manat(sitterEarnings.month)} />
          <Earn label="Bloklanmış" value={manat(sitterEarnings.blocked)} />
          <Earn label="Çıxarışa hazır" value={manat(sitterEarnings.ready)} />
        </View>

        <Text className="text-ink font-bold text-lg mb-2">Gələn sifarişlər</Text>
        {!accepting ? (
          <EmptyState title="Oflaynsınız" text="Sorğuları görmək üçün qəbulu açın." />
        ) : requests.length === 0 ? (
          <EmptyState title="Yeni sorğu yoxdur" text="Boş vaxtlarınızı təqvimdə açıq saxlayın." />
        ) : (
          requests.map((req) => (
            <Card key={req.id} className="p-4 mb-3">
              <Text className="text-ink font-semibold text-base">{req.ownerName}</Text>
              <Text className="text-amber font-medium mt-1">
                {req.petName} · {PET_TYPE_LABEL[req.petType]} · {req.petBreed} · {req.petAge} yaş
              </Text>
              <Text className="text-muted text-sm mt-1">{req.note}</Text>
              <Text className="text-ink text-sm mt-2">
                {SERVICE_LABEL[req.serviceId]} · {formatDate(req.startDate)}
                {req.endDate !== req.startDate ? ` – ${formatDate(req.endDate)}` : ''}
                {req.hours ? ` · ${req.hours} saat` : ''}
              </Text>
              <Text className="text-amber font-bold mt-1">Qazanc: {manat(req.earn)}</Text>
              <View className="flex-row gap-2 mt-3">
                <View className="flex-1">
                  <PrimaryButton
                    label="Qəbul et"
                    onPress={() => {
                      void successTap();
                      decideRequest(req.id, true);
                    }}
                  />
                </View>
                <Tap
                  onPress={() => decideRequest(req.id, false)}
                  className="flex-1 rounded-2xl py-4 items-center border border-line bg-white">
                  <Text className="text-ink font-semibold">İmtina et</Text>
                </Tap>
              </View>
            </Card>
          ))
        )}

        <Tap onPress={() => router.push('/cuzdan')} className="mt-2">
          <Text className="text-forest font-semibold text-center">Cüzdan və çıxarış →</Text>
        </Tap>
      </ScrollView>
    </ScreenPad>
  );
}

function Earn({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 bg-white border border-line rounded-2xl p-3">
      <Text className="text-muted text-[11px]">{label}</Text>
      <Text className="text-ink font-bold mt-1">{value}</Text>
    </View>
  );
}
