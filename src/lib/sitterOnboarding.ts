import type { SitterOnboardingDraft } from '@/src/types';

export const defaultSitterDraft = (): SitterOnboardingDraft => ({
  stepIndex: 0,
  contractSigned: false,
  locationGranted: false,
  address: '',
  district: 'Nəsimi',
  homeType: 'menzil',
  carePetTypes: [],
  offersServices: [],
  ownPetTypes: [],
  ownPetPhotos: [],
  servicePrices: {},
  monthlyTarget: 500,
  shortBio: '',
  experienceText: '',
  gallery: [],
  legalFirstName: '',
  legalLastName: '',
  fin: '',
  qualityPassed: false,
});

export type SitterStepId =
  | 'contract'
  | 'goal'
  | 'location'
  | 'demand'
  | 'environment'
  | 'care-types'
  | 'services'
  | 'has-pets'
  | 'own-pet-types'
  | 'own-pet-photo'
  | 'add-pet-more'
  | 'pricing'
  | 'short-bio'
  | 'experience'
  | 'gallery'
  | 'monthly-target'
  | 'motivation'
  | 'ready-checklist'
  | 'preview-profile'
  | 'preview-web'
  | 'preview-search'
  | 'clients-info'
  | 'payment-info'
  | 'impression-walk'
  | 'impression-visit'
  | 'legal-name'
  | 'id-verify'
  | 'card'
  | 'finish';

type StepDef = { id: SitterStepId; when?: (d: SitterOnboardingDraft) => boolean };

const ALL_STEPS: StepDef[] = [
  { id: 'contract' },
  { id: 'goal' },
  { id: 'location' },
  { id: 'demand' },
  { id: 'environment' },
  { id: 'care-types' },
  { id: 'services' },
  { id: 'has-pets' },
  { id: 'own-pet-types', when: (d) => d.hasOwnPets === true },
  { id: 'own-pet-photo', when: (d) => d.hasOwnPets === true },
  { id: 'add-pet-more', when: (d) => d.hasOwnPets === true },
  { id: 'pricing' },
  { id: 'short-bio' },
  { id: 'experience' },
  { id: 'gallery' },
  { id: 'monthly-target' },
  { id: 'motivation' },
  { id: 'ready-checklist' },
  { id: 'preview-profile' },
  { id: 'preview-web' },
  { id: 'preview-search' },
  { id: 'clients-info' },
  { id: 'payment-info' },
  { id: 'impression-walk' },
  { id: 'impression-visit' },
  { id: 'legal-name' },
  { id: 'id-verify' },
  { id: 'card' },
  { id: 'finish' },
];

export function activeSitterSteps(draft: SitterOnboardingDraft): SitterStepId[] {
  return ALL_STEPS.filter((s) => !s.when || s.when(draft)).map((s) => s.id);
}

export function sitterProgress(draft: SitterOnboardingDraft): number {
  const steps = activeSitterSteps(draft);
  if (steps.length <= 1) return 0;
  const idx = Math.min(draft.stepIndex, steps.length - 1);
  return idx / (steps.length - 1);
}

export const PET_TYPE_LABELS: Record<string, string> = {
  it: 'İtlər',
  pisik: 'Pişiklər',
  qus: 'Quşlar',
  dovsan: 'Kiçik ev heyvanları',
  diger: 'Digər',
};