import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PhotoSheet } from '@/components/PhotoSheet';
import { Avatar, Card, Chip, GhostButton, PrimaryButton, ScreenPad, Tap } from '@/components/ui';
import { SERVICES } from '@/src/data/catalog';
import { useApp } from '@/src/context/AppContext';
import { manat, SIZE_LABEL } from '@/src/lib/format';
import { colors } from '@/src/theme';
import { DISTRICTS, type PetSize } from '@/src/types';

const SIZES: PetSize[] = ['kicik', 'orta', 'boyuk'];

export default function SitterProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, sitter, setSitter, setMode, setAvatar } = useApp();
  const [photoOpen, setPhotoOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  function updatePrice(serviceId: string, price: number) {
    setSitter({
      ...sitter,
      services: sitter.services.map((s) => (s.serviceId === serviceId ? { ...s, price } : s)),
    });
  }

  function toggleSize(size: PetSize) {
    const has = sitter.acceptedSizes.includes(size);
    setSitter({
      ...sitter,
      acceptedSizes: has ? sitter.acceptedSizes.filter((s) => s !== size) : [...sitter.acceptedSizes, size],
    });
  }

  return (
    <ScreenPad>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40, paddingHorizontal: 20 }}>
        <Text className="text-ink font-bold text-2xl">Baxıcı profili</Text>
        <View className="items-center my-4">
          <Avatar uri={user.avatar} name={`${user.firstName} ${user.lastName}`} size={88} />
          <Text className="text-ink font-semibold text-lg mt-2">
            {user.firstName} {user.lastName}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="shield-checkmark" size={16} color={sitter.verified ? colors.forest : colors.muted} />
            <Text className={`ml-1 font-semibold ${sitter.verified ? 'text-forest' : 'text-muted'}`}>
              {sitter.verified ? 'Şəxsiyyəti təsdiqlənib' : 'Təsdiq gözlənilir'}
            </Text>
          </View>
        </View>

        <Text className="text-muted text-xs font-semibold mb-2">XİDMƏTLƏR VƏ QİYMƏTLƏR</Text>
        <Card className="p-4 mb-4">
          {sitter.services.map((s) => {
            const meta = SERVICES.find((x) => x.id === s.serviceId);
            return (
              <View key={s.serviceId} className="flex-row items-center mb-3">
                <Text className="flex-1 text-ink">
                  {meta?.title} — {manat(s.price)}/{s.unit}
                </Text>
                <Tap onPress={() => updatePrice(s.serviceId, Math.max(5, s.price - 1))} className="w-8 h-8 rounded-full bg-cream items-center justify-center">
                  <Text className="text-ink font-bold">−</Text>
                </Tap>
                <Tap onPress={() => updatePrice(s.serviceId, s.price + 1)} className="w-8 h-8 rounded-full bg-moss items-center justify-center ml-2">
                  <Text className="text-forest font-bold">+</Text>
                </Tap>
              </View>
            );
          })}
        </Card>

        <Text className="text-muted text-xs font-semibold mb-2">QƏBUL EDİLƏN ÖLÇÜ</Text>
        <View className="flex-row flex-wrap mb-4">
          {SIZES.map((size) => (
            <Chip key={size} label={SIZE_LABEL[size]} active={sitter.acceptedSizes.includes(size)} onPress={() => toggleSize(size)} />
          ))}
        </View>

        <Text className="text-muted text-xs font-semibold mb-2">EV ŞƏRAİTİ</Text>
        <Card className="p-4 mb-4">
          <View className="flex-row flex-wrap mb-2">
            <Chip
              label="Mənzil"
              active={sitter.homeType === 'menzil'}
              onPress={() => setSitter({ ...sitter, homeType: 'menzil' })}
            />
            <Chip
              label="Həyət evi"
              active={sitter.homeType === 'heyet'}
              onPress={() => setSitter({ ...sitter, homeType: 'heyet' })}
            />
          </View>
          <Chip
            label={sitter.hasOwnPets ? 'Öz heyvanım var' : 'Öz heyvanım yoxdur'}
            active={sitter.hasOwnPets}
            onPress={() => setSitter({ ...sitter, hasOwnPets: !sitter.hasOwnPets })}
          />
          <TextInput
            value={sitter.ownPetsNote}
            onChangeText={(ownPetsNote) => setSitter({ ...sitter, ownPetsNote })}
            className="bg-cream rounded-xl px-3 py-2 mt-2 text-ink"
            placeholder="Öz heyvanı haqqında qeyd"
          />
          <Text className="text-muted text-xs mt-3 mb-1">Təcrübə (il)</Text>
          <View className="flex-row items-center">
            <Tap
              onPress={() => setSitter({ ...sitter, experienceYears: Math.max(0, sitter.experienceYears - 1) })}
              className="w-8 h-8 rounded-full bg-cream items-center justify-center">
              <Text>−</Text>
            </Tap>
            <Text className="mx-3 text-ink font-semibold">{sitter.experienceYears} il</Text>
            <Tap
              onPress={() => setSitter({ ...sitter, experienceYears: sitter.experienceYears + 1 })}
              className="w-8 h-8 rounded-full bg-moss items-center justify-center">
              <Text className="text-forest">+</Text>
            </Tap>
          </View>
          <Text className="text-muted text-xs mt-3 mb-1">Rayon</Text>
          <View className="flex-row flex-wrap">
            {DISTRICTS.map((d) => (
              <Chip key={d} label={d} active={sitter.district === d} onPress={() => setSitter({ ...sitter, district: d })} />
            ))}
          </View>
        </Card>

        <Text className="text-muted text-xs font-semibold mb-2">QALEREYA</Text>
        <View className="flex-row flex-wrap mb-4">
          {sitter.gallery.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={{ width: 80, height: 80, borderRadius: 12, marginRight: 8, marginBottom: 8, backgroundColor: colors.moss }}
              contentFit="cover"
            />
          ))}
          <Tap
            onPress={() => setGalleryOpen(true)}
            className="w-20 h-20 rounded-xl bg-white border border-dashed border-line items-center justify-center">
            <Ionicons name="add" size={22} color={colors.forest} />
          </Tap>
        </View>

        <Text className="text-muted text-xs font-semibold mb-2">KİMLİK TƏSDİQİ</Text>
        <Card className="p-4 mb-4">
          <Text className="text-ink">FİN: {sitter.fin || '—'}</Text>
          <Text className="text-muted text-sm mt-1">Şəxsiyyət vəsiqəsi və canlı selfi yoxlanışı simulyasiya olunur.</Text>
          <Tap onPress={() => router.push('/baxici-ol')} className="mt-2">
            <Text className="text-forest font-semibold">Sənədləri yenilə</Text>
          </Tap>
        </Card>

        <PrimaryButton
          label="Sahib rejiminə qayıt"
          tone="forest"
          onPress={() => {
            setMode('owner');
            router.replace('/(owner)');
          }}
        />
        <View className="h-3" />
        <GhostButton
          label="Profil şəklini dəyiş"
          onPress={() => setPhotoOpen(true)}
        />
      </ScrollView>
      <PhotoSheet open={photoOpen} onClose={() => setPhotoOpen(false)} onPicked={setAvatar} />
      <PhotoSheet
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onPicked={(uri) => {
          setSitter({ ...sitter, gallery: [...sitter.gallery, uri] });
          Alert.alert('Əlavə olundu', 'Foto qalereyaya düşdü.');
        }}
      />
    </ScreenPad>
  );
}
