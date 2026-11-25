import { Switch, Text, TextInput, View } from 'react-native';

import { Header } from '@/components/Header';
import { Card, PrimaryButton, ScreenPad } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { successTap } from '@/src/lib/haptics';
import { colors } from '@/src/theme';

export default function AutoReplyScreen() {
  const { sitterBiz, patchSitterBiz, user } = useApp();

  return (
    <ScreenPad>
      <Header title="Avtomatik cavab" />
      <View className="px-5 pb-8">
        <Text className="text-muted leading-6 mb-4">
          Hər yeni sahib dərhal sizdən cavab alır. Bu, normal mesaj kimi gedir — Dostum ilk cavabı sizin yerinizə saymır.
        </Text>
        <Card className="p-4 flex-row items-center justify-between mb-4">
          <Text className="text-ink font-semibold flex-1 pr-2">Avtomatik cavab göndər</Text>
          <Switch
            value={sitterBiz.autoReplyEnabled}
            onValueChange={(autoReplyEnabled) => patchSitterBiz({ autoReplyEnabled })}
            trackColor={{ false: '#E7E5E4', true: colors.forest }}
            thumbColor="#fff"
          />
        </Card>
        <Card className="p-4 mb-3 bg-sheet">
          <Text className="text-muted text-sm mb-2">Sahib</Text>
          <Text className="text-ink">Salam! Şənbə günü gündüz baxımı üçün vaxtınız var?</Text>
        </Card>
        <Card className="p-4 mb-4 bg-moss border-forest/20">
          <Text className="text-muted text-sm mb-2">Siz (avtomatik)</Text>
          <TextInput
            multiline
            value={sitterBiz.autoReplyText}
            onChangeText={(autoReplyText) => patchSitterBiz({ autoReplyText })}
            className="text-ink min-h-[88px]"
            placeholder="Cavab mətni"
          />
        </Card>
        <Text className="text-muted text-xs mb-6">
          Hər sahibə yalnız bir dəfə, ilk mesajdan dərhal sonra göndərilir. Sahiblər mətni olduğu kimi görür — tərcümə olunmur.
        </Text>
        <PrimaryButton
          label="Yadda saxla"
          onPress={() => {
            void successTap();
            patchSitterBiz({ autoReplyEnabled: sitterBiz.autoReplyEnabled });
          }}
        />
        <Text className="text-muted text-xs text-center mt-3">İmza: {user.firstName}</Text>
      </View>
    </ScreenPad>
  );
}