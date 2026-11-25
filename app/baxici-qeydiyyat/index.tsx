import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';

import { ContractHoldButton } from '@/components/onboarding/ContractHoldButton';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { SelectCard } from '@/components/onboarding/SelectCard';
import { PhotoSheet } from '@/components/PhotoSheet';
import { Card, Chip, GhostButton } from '@/components/ui';
import { useApp } from '@/src/context/AppContext';
import { SERVICES } from '@/src/data/catalog';
import { manat } from '@/src/lib/format';
import {
  activeSitterSteps,
  defaultSitterDraft,
  PET_TYPE_LABELS,
  sitterProgress,
  type SitterStepId,
} from '@/src/lib/sitterOnboarding';
import { successTap } from '@/src/lib/haptics';
import type { District, HomeType, PetType, ServiceId, SitterGoal } from '@/src/types';
import { DISTRICTS } from '@/src/types';

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

function stepMeta(id: SitterStepId): { title: string; subtitle?: string; primary?: string } {
  const map: Record<SitterStepId, { title: string; subtitle?: string; primary?: string }> = {
    contract: {
      title: 'Dostum baxıcı öhdəliyi',
      subtitle: 'Heyvanı əmanət alan kimi etibarlı olmaq üçün ilk addım — rəqəmsal sözləşmə.',
    },
    goal: { title: 'Baxıcılıq məqsədiniz nədir?', subtitle: 'Daha sonra təklifləri buna uyğun təklif edəcəyik.' },
    location: { title: 'Ünvan və xəritə', subtitle: 'Yaxınlıqda sizi tapmaq üçün məkan icazəsi lazımdır.' },
    demand: {
      title: 'Sizin ərazidə baxıcı lazımdır',
      subtitle: 'Son 30 gündə yüzlərlə sahib uyğun baxıcı tapa bilməyib.',
    },
    environment: { title: 'Yaşayış mühiti', subtitle: 'Heyvanlar harada qalırlar?' },
    'care-types': { title: 'Hansı heyvanlara qayğı göstərə bilərsiniz?', subtitle: 'Bir neçəsini seçin.' },
    services: { title: 'Hansı xidmətləri təklif edirsiniz?', subtitle: 'Qiymətləri növbəti addımda yazacaqsınız.' },
    'has-pets': { title: 'Öz heyvanınız var?', subtitle: 'Varsa, profiliniz daha inandırıcı görünür.' },
    'own-pet-types': { title: 'Hansı heyvanlar sizdə var?', subtitle: 'Bir neçəsini seçə bilərsiniz.' },
    'own-pet-photo': { title: 'Öz heyvanınızın şəkli', subtitle: 'Ən azı bir foto əlavə edin.' },
    'add-pet-more': { title: 'Başqa heyvan əlavə etmək?', subtitle: 'İstəyə bağlıdır.' },
    pricing: { title: 'Xidmət qiymətləriniz', subtitle: 'Qiymət manatla, gecə/saat/ziyarət üçün.' },
    'short-bio': { title: 'Qısa təqdimat', subtitle: 'Sahiblərə bir neçə cümlə ilə özünüzü tanıdıdın.' },
    experience: { title: 'Təcrübəniz', subtitle: 'Ümumi təcrübə, ilk yardım, əvvəlki müştərilər.' },
    gallery: { title: 'Profil şəkilləri', subtitle: 'Minimum 1, tövsiyə olunan 4+ foto.' },
    'monthly-target': { title: 'Aylıq hədəf', subtitle: 'Neçə manat qazanmaq istəyirsiniz?' },
    motivation: { title: 'Gecikmə itkisidir', subtitle: '50+ rezervasiya keçən baxıcıların nömrə 1 məsləhəti.' },
    'ready-checklist': { title: 'Profiliniz canlıya hazırdır', subtitle: 'Yoxlayın və davam edin.' },
    'preview-profile': { title: 'Profili yoxlayın', subtitle: 'Sahiblər belə görəcək.' },
    'preview-web': { title: 'Vebdə necə görünəcəksiniz', subtitle: 'dostum.az profiliniz' },
    'preview-search': { title: 'Axtarışda necə çıxacaqsınız', subtitle: 'Google və daxili axtarış.' },
    'clients-info': {
      title: 'Müştəriləri necə tapırsınız',
      subtitle: 'Sahiblər vebdə və tətbiqdə profilinizi görür, Dostum vasitəsilə yazır.',
    },
    'payment-info': {
      title: 'Ödəniş necə işləyir',
      subtitle: 'Siz öz tarifinizi saxlayırsınız — komissiya sahib tərəfindən ödənilir.',
    },
    'impression-walk': { title: 'Sahibə güvən verin', subtitle: 'Canlı GPS gəzinti izləməsi.' },
    'impression-visit': { title: 'Ev ziyarəti hesabatı', subtitle: 'Foto və qısa yeniləmələr.' },
    'legal-name': { title: 'Rəsmi adınız', subtitle: 'Şəxsiyyət vəsiqəsindəki kimi.' },
    'id-verify': { title: 'Şəxsiyyət təsdiqi', subtitle: 'FİN, vəsiqə şəkli və canlı selfi.' },
    card: { title: 'Ödəniş kartı', subtitle: 'Qazancın köçürülməsi üçün (sınaq rejimi).' },
    finish: { title: 'Hazırdır!', subtitle: 'Profiliniz nəzarətə göndərilir və panel açılır.', primary: 'Baxıcı panelinə keç' },
  };
  return map[id];
}

export default function BaxiciQeydiyyatScreen() {
  const { sitterDraft, patchSitterDraft, user, completeSitterOnboarding } = useApp();
  const draft = sitterDraft;
  const steps = useMemo(() => activeSitterSteps(draft), [draft]);
  const stepId = steps[Math.min(draft.stepIndex, steps.length - 1)] ?? 'contract';
  const meta = stepMeta(stepId);
  const progress = sitterProgress(draft);

  const [idOpen, setIdOpen] = useState(false);
  const [selfieOpen, setSelfieOpen] = useState(false);
  const [petPhotoOpen, setPetPhotoOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  function goNext() {
    if (!canContinue(stepId, draft)) {
      Alert.alert('Tamamlayın', 'Bu addımı bitirmək üçün lazım olan məlumatları daxil edin.');
      return;
    }
    const next = Math.min(draft.stepIndex + 1, steps.length - 1);
    if (stepId === 'finish') {
      completeSitterOnboarding();
      void successTap();
      router.replace('/(sitter)');
      return;
    }
    patchSitterDraft({ stepIndex: next });
  }

  function goBack() {
    if (draft.stepIndex === 0) {
      router.replace('/(owner)/daha-cox');
      return;
    }
    patchSitterDraft({ stepIndex: Math.max(0, draft.stepIndex - 1) });
  }

  async function askLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İcazə lazımdır', 'Xəritədə göstərmək üçün məkan icazəsi verin.');
      return;
    }
    const pos = await Location.getCurrentPositionAsync({});
    patchSitterDraft({
      locationGranted: true,
      address: draft.address || user.address || `Bakı (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`,
    });
  }

  const body = (
    <View>
      {stepId === 'contract' ? (
        <>
          <Card className="p-4 mb-4">
            <Text className="text-ink leading-6">• Hər heyvana öz heyvanım kimi qayğı göstərəcəyəm.</Text>
            <Text className="text-ink leading-6 mt-2">• Sahiblərə tez cavab verəcəyəm, hətta imtina olanda belə.</Text>
            <Text className="text-ink leading-6 mt-2">• Razu olduğum vaxtda görünəcəyəm.</Text>
            <Text className="text-ink leading-6 mt-2">• Rezervasiya və ödənişləri Dostum üzərindən aparacağam.</Text>
          </Card>
          <ContractHoldButton
            signed={draft.contractSigned}
            signerName={draft.contractName}
            onSigned={() =>
              patchSitterDraft({
                contractSigned: true,
                contractSignedAt: new Date().toISOString(),
                contractName: `${user.firstName} ${user.lastName}`.trim(),
              })
            }
          />
        </>
      ) : null}

      {stepId === 'goal' ? (
        <>
          {(
            [
              ['elas', 'Əlavə gəlir', 'Ayda bir neçə rezervasiya'],
              ['yarim', 'Yarım ştat', 'Həftəlik sabit sifarişlər'],
              ['tam', 'Tam ştat', 'Baxıçılığı peşə kimi'],
            ] as const
          ).map(([id, t, s]) => (
            <SelectCard
              key={id}
              selected={draft.goal === id}
              title={t}
              subtitle={s}
              onPress={() => patchSitterDraft({ goal: id as SitterGoal })}
            />
          ))}
        </>
      ) : null}

      {stepId === 'location' ? (
        <>
          <View className="rounded-3xl overflow-hidden border border-line bg-moss mb-4" style={{ height: 200 }}>
            <Text className="absolute left-4 top-4 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-ink">
              Bakı · {draft.district}
            </Text>
            <View className="absolute left-1/2 top-1/2 -ml-4 -mt-6">
              <Ionicons name="location" size={36} color="#2D6A35" />
            </View>
          </View>
          <GhostButton label={draft.locationGranted ? 'Məkan təsdiqləndi ✓' : 'Məkana icazə ver'} onPress={() => void askLocation()} />
          <Text className="text-muted text-xs mt-3 mb-1">Rayon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {DISTRICTS.map((d) => (
              <Chip key={d} label={d} active={draft.district === d} onPress={() => patchSitterDraft({ district: d as District })} />
            ))}
          </ScrollView>
          <Text className="text-muted text-xs mb-1">Ünvan</Text>
          <TextInput
            value={draft.address}
            onChangeText={(address) => patchSitterDraft({ address })}
            placeholder="Küçə, bina"
            className="bg-white border border-line rounded-xl px-3 py-3 text-ink"
          />
        </>
      ) : null}

      {stepId === 'demand' ? (
        <Card className="p-4 bg-red-50 border-red-200">
          <Text className="text-center text-danger font-bold text-lg">82 sahib yaxınlıqda baxıcı tapa bilməyib</Text>
          <Text className="text-muted text-center mt-2 leading-5">
            Son 30 gündə {draft.district} ərazisində tələbat çoxdur. Profilinizi aktivləşdirin.
          </Text>
        </Card>
      ) : null}

      {stepId === 'environment' ? (
        <>
          <SelectCard
            selected={draft.homeType === 'menzil'}
            title="Mənzil"
            onPress={() => patchSitterDraft({ homeType: 'menzil' as HomeType })}
          />
          <SelectCard
            selected={draft.homeType === 'heyet'}
            title="Həyət evi"
            onPress={() => patchSitterDraft({ homeType: 'heyet' as HomeType })}
          />
        </>
      ) : null}

      {stepId === 'care-types' ? (
        (Object.keys(PET_TYPE_LABELS) as PetType[]).map((t) => (
          <SelectCard
            key={t}
            multi
            selected={draft.carePetTypes.includes(t)}
            title={PET_TYPE_LABELS[t] ?? t}
            onPress={() => patchSitterDraft({ carePetTypes: toggle(draft.carePetTypes, t) })}
          />
        ))
      ) : null}

      {stepId === 'services' ? (
        SERVICES.map((s) => (
          <SelectCard
            key={s.id}
            multi
            selected={draft.offersServices.includes(s.id)}
            title={`${s.emoji} ${s.title}`}
            subtitle={s.description}
            onPress={() => patchSitterDraft({ offersServices: toggle(draft.offersServices, s.id as ServiceId) })}
          />
        ))
      ) : null}

      {stepId === 'has-pets' ? (
        <>
          <SelectCard selected={draft.hasOwnPets === true} title="Bəli, heyvanım var" onPress={() => patchSitterDraft({ hasOwnPets: true })} />
          <SelectCard
            selected={draft.hasOwnPets === false}
            title="Xeyr, hazırda yoxdur"
            onPress={() => patchSitterDraft({ hasOwnPets: false, ownPetTypes: [], ownPetPhotos: [] })}
          />
        </>
      ) : null}

      {stepId === 'own-pet-types' ? (
        (Object.keys(PET_TYPE_LABELS) as PetType[]).map((t) => (
          <SelectCard
            key={t}
            multi
            selected={draft.ownPetTypes.includes(t)}
            title={PET_TYPE_LABELS[t] ?? t}
            onPress={() => patchSitterDraft({ ownPetTypes: toggle(draft.ownPetTypes, t) })}
          />
        ))
      ) : null}

      {stepId === 'own-pet-photo' ? (
        <>
          <GhostButton label={draft.ownPetPhotos[0] ? 'Foto əlavə olunub ✓' : 'Heyvan fotosu əlavə et'} onPress={() => setPetPhotoOpen(true)} />
          {draft.ownPetPhotos[0] ? (
            <Image source={{ uri: draft.ownPetPhotos[0] }} className="w-full h-48 rounded-2xl mt-3" contentFit="cover" />
          ) : null}
        </>
      ) : null}

      {stepId === 'add-pet-more' ? (
        <Card className="p-4">
          <Text className="text-muted">İndi kifayətdir. Daha sonra profildən əlavə heyvan əlavə edə bilərsiniz.</Text>
        </Card>
      ) : null}

      {stepId === 'pricing' ? (
        draft.offersServices.map((sid) => {
          const info = SERVICES.find((s) => s.id === sid);
          return (
            <View key={sid} className="mb-3">
              <Text className="text-ink font-semibold mb-1">{info?.title ?? sid}</Text>
              <TextInput
                keyboardType="numeric"
                value={String(draft.servicePrices[sid] ?? '')}
                onChangeText={(v) =>
                  patchSitterDraft({
                    servicePrices: { ...draft.servicePrices, [sid]: Number(v.replace(/\D/g, '')) || 0 },
                  })
                }
                placeholder="Qiymət (₼)"
                className="bg-white border border-line rounded-xl px-3 py-3 text-ink"
              />
            </View>
          );
        })
      ) : null}

      {stepId === 'short-bio' ? (
        <TextInput
          multiline
          value={draft.shortBio}
          onChangeText={(shortBio) => patchSitterDraft({ shortBio })}
          placeholder="Məs: Nəsimidə yaşayıram, pişiklərə və itlərə qayğı göstərməyi sevirəm."
          className="bg-white border border-line rounded-xl px-3 py-3 text-ink min-h-[120px]"
        />
      ) : null}

      {stepId === 'experience' ? (
        <TextInput
          multiline
          value={draft.experienceText}
          onChangeText={(experienceText) => patchSitterDraft({ experienceText })}
          placeholder="Təcrübə, təlim, müştəri hekayələri..."
          className="bg-white border border-line rounded-xl px-3 py-3 text-ink min-h-[160px]"
        />
      ) : null}

      {stepId === 'gallery' ? (
        <>
          <GhostButton label="Şəkil əlavə et" onPress={() => setGalleryOpen(true)} />
          <View className="flex-row flex-wrap mt-2">
            {draft.gallery.map((uri) => (
              <Image key={uri} source={{ uri }} style={{ width: 88, height: 88, borderRadius: 12, margin: 4 }} contentFit="cover" />
            ))}
          </View>
        </>
      ) : null}

      {stepId === 'monthly-target' ? (
        <>
          {[500, 1000, 2000, 3000].map((n) => (
            <SelectCard
              key={n}
              selected={draft.monthlyTarget === n}
              title={`${manat(n)} / ay`}
              onPress={() => patchSitterDraft({ monthlyTarget: n })}
            />
          ))}
        </>
      ) : null}

      {stepId === 'motivation' ? (
        <Card className="p-4 bg-sheet">
          <Text className="text-ink italic leading-6">
            «Profili dərhal bitirin. Gözlədiyim hər gün itmiş rezervasiya deməkdir.»
          </Text>
          <Text className="text-muted text-sm mt-3">50+ rezervasiyası olan Dostum baxıcıları</Text>
        </Card>
      ) : null}

      {stepId === 'ready-checklist' ? (
        <Card className="p-4">
          {[
            `${draft.gallery.length || draft.ownPetPhotos.length} foto`,
            `${draft.experienceText.split(/\s+/).filter(Boolean).length} söz təcrübə`,
            `${draft.offersServices.length} xidmət qiyməti`,
            draft.contractSigned ? 'Sözləşmə imzalandı' : 'Sözləşmə yoxdur',
            `${manat(draft.monthlyTarget)} aylıq hədəf`,
          ].map((line) => (
            <View key={line} className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={18} color="#2D6A35" />
              <Text className="text-ink ml-2">{line}</Text>
            </View>
          ))}
        </Card>
      ) : null}

      {['preview-profile', 'preview-web', 'preview-search'].includes(stepId) ? (
        <Card className="p-4">
          <Text className="text-ink font-bold text-lg">
            {user.firstName} {draft.legalLastName || user.lastName}
          </Text>
          <Text className="text-muted">{draft.district} · ★ 5.0</Text>
          <Text className="text-forest text-sm mt-2">ID təsdiqləndi ✓</Text>
          <Text className="text-ink mt-3">{draft.shortBio || draft.experienceText.slice(0, 120)}</Text>
          <Text className="text-muted text-xs mt-3">
            {stepId === 'preview-web' ? 'dostum.az profili' : stepId === 'preview-search' ? 'Axtarış önizləməsi' : 'Mobil profil'}
          </Text>
        </Card>
      ) : null}

      {['clients-info', 'payment-info', 'impression-walk', 'impression-visit'].includes(stepId) ? (
        <Card className="p-4">
          <Text className="text-ink leading-6">
            {stepId === 'clients-info' && 'Sahiblər axtarışda profilinizi görür və mesajla sifariş edir. Təqviminizi yenil saxlayın.'}
            {stepId === 'payment-info' && 'Siz 100% tarifinizi alırsınız. Platforma komissiyası sahibə əlavə olunur.'}
            {stepId === 'impression-walk' && 'Gəzinti zamanı GPS marşrutu, foto və qısa statistikalar sahibə canlı gedir.'}
            {stepId === 'impression-visit' && 'Ev ziyarətində tapşırıqlar, foto və qısa mesajlar hesabat kimi gedir.'}
          </Text>
        </Card>
      ) : null}

      {stepId === 'legal-name' ? (
        <>
          <Text className="text-muted text-xs mb-1">Ad</Text>
          <TextInput
            value={draft.legalFirstName}
            onChangeText={(legalFirstName) => patchSitterDraft({ legalFirstName })}
            className="bg-white border border-line rounded-xl px-3 py-3 text-ink mb-3"
          />
          <Text className="text-muted text-xs mb-1">Soyad</Text>
          <TextInput
            value={draft.legalLastName}
            onChangeText={(legalLastName) => patchSitterDraft({ legalLastName })}
            className="bg-white border border-line rounded-xl px-3 py-3 text-ink"
          />
        </>
      ) : null}

      {stepId === 'id-verify' ? (
        <>
          <Text className="text-muted text-xs mb-1">FİN</Text>
          <TextInput
            value={draft.fin}
            onChangeText={(fin) => patchSitterDraft({ fin })}
            autoCapitalize="characters"
            className="bg-white border border-line rounded-xl px-3 py-3 text-ink mb-3"
          />
          <GhostButton label={draft.idPhoto ? 'Vəsiqə ✓' : 'Şəxsiyyət vəsiqəsi'} onPress={() => setIdOpen(true)} />
          <View className="h-2" />
          <GhostButton label={draft.selfie ? 'Selfi ✓' : 'Canlı selfi'} onPress={() => setSelfieOpen(true)} />
        </>
      ) : null}

      {stepId === 'card' ? (
        <TextInput
          keyboardType="numeric"
          maxLength={4}
          value={draft.cardLast4 ?? ''}
          onChangeText={(cardLast4) => patchSitterDraft({ cardLast4 })}
          placeholder="Kartın son 4 rəqəmi"
          className="bg-white border border-line rounded-xl px-3 py-3 text-ink"
        />
      ) : null}

      {stepId === 'finish' ? (
        <Card className="p-4">
          <Text className="text-ink leading-6">
            Profil məlumatları yoxlanışa göndərilir. Sənədlər təsdiqlənəndən sonra axtarışda görünəcəksiniz.
          </Text>
        </Card>
      ) : null}
    </View>
  );

  return (
  <>
    <OnboardingShell
      progress={progress}
      title={meta.title}
      subtitle={meta.subtitle}
      primaryLabel={meta.primary ?? 'Davam et'}
      onPrimary={goNext}
      onBack={goBack}
      primaryDisabled={!canContinue(stepId, draft) && stepId !== 'add-pet-more' && !['motivation', 'demand', 'clients-info', 'payment-info', 'impression-walk', 'impression-visit', 'preview-profile', 'preview-web', 'preview-search', 'ready-checklist', 'finish'].includes(stepId)}
    >
      {body}
    </OnboardingShell>
    <PhotoSheet open={idOpen} onClose={() => setIdOpen(false)} onPicked={(idPhoto) => patchSitterDraft({ idPhoto })} />
    <PhotoSheet open={selfieOpen} onClose={() => setSelfieOpen(false)} onPicked={(selfie) => patchSitterDraft({ selfie })} />
    <PhotoSheet
      open={petPhotoOpen}
      onClose={() => setPetPhotoOpen(false)}
      onPicked={(uri) => patchSitterDraft({ ownPetPhotos: [uri, ...draft.ownPetPhotos].slice(0, 4) })}
    />
    <PhotoSheet
      open={galleryOpen}
      onClose={() => setGalleryOpen(false)}
      onPicked={(uri) => patchSitterDraft({ gallery: [...draft.gallery, uri].slice(0, 8) })}
    />
  </>
  );
}

function canContinue(stepId: SitterStepId, d: ReturnType<typeof defaultSitterDraft>) {
  switch (stepId) {
    case 'contract':
      return d.contractSigned;
    case 'goal':
      return Boolean(d.goal);
    case 'location':
      return d.locationGranted && d.address.trim().length > 3;
    case 'care-types':
      return d.carePetTypes.length > 0;
    case 'services':
      return d.offersServices.length > 0;
    case 'has-pets':
      return d.hasOwnPets !== undefined;
    case 'own-pet-types':
      return d.ownPetTypes.length > 0;
    case 'own-pet-photo':
      return d.ownPetPhotos.length > 0;
    case 'pricing':
      return d.offersServices.every((s) => (d.servicePrices[s] ?? 0) > 0);
    case 'short-bio':
      return d.shortBio.trim().length >= 12;
    case 'experience':
      return d.experienceText.trim().length >= 24;
    case 'gallery':
      return d.gallery.length >= 1;
    case 'legal-name':
      return d.legalFirstName.trim().length > 1 && d.legalLastName.trim().length > 1;
    case 'id-verify':
      return d.fin.trim().length >= 5 && Boolean(d.idPhoto && d.selfie);
    case 'card':
      return (d.cardLast4?.length ?? 0) === 4;
    case 'environment':
      return Boolean(d.homeType);
    default:
      return true;
  }
}