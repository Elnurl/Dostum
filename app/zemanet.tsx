import { ScrollView, Text } from 'react-native';

import { Header } from '@/components/Header';
import { Card, ScreenPad } from '@/components/ui';

export default function GuaranteeScreen() {
  return (
    <ScreenPad>
      <Header title="Platforma zəmanəti" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-ink font-bold text-xl mb-2">dostum sizi və dostunuzu qoruyur</Text>
        <Text className="text-muted mb-4">
          Bakı üzrə heyvan baxımı sifarişlərində ödəniş, şəxsiyyət və sığorta qaydaları eyni standartla işləyir.
        </Text>
        <Card className="p-4 mb-3">
          <Text className="text-ink font-semibold mb-1">Escrow — təhlükəsiz ödəniş</Text>
          <Text className="text-muted leading-5">
            Sifariş verəndə məbləğ + 15% xidmət haqqı kartınızdan çıxır, amma baxıcıya keçmir. Pul xidmət bitənə qədər
            bloklanır. Problem olsa, dəstək komandası araşdırır.
          </Text>
        </Card>
        <Card className="p-4 mb-3">
          <Text className="text-ink font-semibold mb-1">Kimlik təsdiqi</Text>
          <Text className="text-muted leading-5">
            Baxıcılar şəxsiyyət vəsiqəsi və canlı selfi göndərir. «Şəxsiyyəti təsdiqlənib» nişanı yalnız yoxlamadan
            keçənlərdə görünür.
          </Text>
        </Card>
        <Card className="p-4 mb-3">
          <Text className="text-ink font-semibold mb-1">Sığorta limiti</Text>
          <Text className="text-muted leading-5">
            Aktiv rezervasiya zamanı ev və heyvanla bağlı zərər üçün 2 000 ₼-dək platforma zəmanəti (sınaq şərtləri).
            Baytar xərci sənədlə təsdiqlənməlidir.
          </Text>
        </Card>
        <Card className="p-4 mb-3">
          <Text className="text-ink font-semibold mb-1">Canlı hesabat</Text>
          <Text className="text-muted leading-5">
            Gəzinti GPS-i, foto və tapşırıq işarələri mesajlarda qalır. Bu, həm sizin rahatlığınız, həm də mübahisə
            zamanı sübutdur.
          </Text>
        </Card>
      </ScrollView>
    </ScreenPad>
  );
}
