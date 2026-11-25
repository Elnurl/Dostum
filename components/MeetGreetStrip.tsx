import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { GhostButton, PrimaryButton, Tap } from '@/components/ui';
import type { MeetGreetStage, ServiceId } from '@/src/types';

const STEPS: { id: MeetGreetStage; label: string }[] = [
  { id: 'mesaj', label: 'Mesaj' },
  { id: 'gorus', label: 'Görüş' },
  { id: 'hazir', label: 'Sifariş' },
];

export function MeetGreetStrip({
  stage,
  sitterId,
  serviceId,
  onAdvance,
}: {
  stage: MeetGreetStage;
  sitterId: string;
  serviceId?: ServiceId;
  onAdvance: (next: MeetGreetStage) => void;
}) {
  const idx = STEPS.findIndex((s) => s.id === stage);

  return (
    <View className="bg-white border border-line rounded-2xl p-3 mb-3">
      <Text className="text-muted text-xs font-semibold mb-2">SİFARİŞƏ QEDƏR</Text>
      <View className="flex-row mb-3">
        {STEPS.map((step, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <View key={step.id} className="flex-1 items-center">
              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  done ? 'bg-forest-dark' : active ? 'bg-forest' : 'bg-line'
                }`}>
                <Text className={`text-xs font-bold ${done || active ? 'text-white' : 'text-muted'}`}>{i + 1}</Text>
              </View>
              <Text className={`text-[10px] mt-1 font-semibold ${active ? 'text-forest' : 'text-muted'}`}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {stage === 'mesaj' ? (
        <>
          <Text className="text-ink text-sm mb-2">Mesaj pulsuzdur — kart tələb olunmur.</Text>
          <PrimaryButton label="Görüş və ya zəng planla" onPress={() => onAdvance('gorus')} />
        </>
      ) : null}

      {stage === 'gorus' ? (
        <>
          <Text className="text-ink text-sm mb-2">Baxıcı ilə tanışlıq üçün qısa görüş təyin edin.</Text>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <PrimaryButton label="Görüş təsdiqləndi" onPress={() => onAdvance('hazir')} />
            </View>
            <Tap onPress={() => onAdvance('mesaj')} className="px-3 justify-center">
              <Text className="text-muted text-sm">Geri</Text>
            </Tap>
          </View>
        </>
      ) : null}

      {stage === 'hazir' ? (
        <>
          <Text className="text-ink text-sm mb-2">Hər şey uyğundursa — indi sifariş edə bilərsiniz.</Text>
          <PrimaryButton
            label="Sifariş et"
            onPress={() =>
              router.push({
                pathname: '/sifaris',
                params: { sitterId, service: serviceId ?? 'geceleme' },
              })
            }
          />
          <View className="h-2" />
          <GhostButton label="Əvvəl daha mesaj yaz" onPress={() => onAdvance('mesaj')} />
        </>
      ) : null}
    </View>
  );
}