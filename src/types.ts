export const DISTRICTS = ['Nəsimi', 'Yasamal', 'Səbail', 'Nərimanov', 'Xətai', 'Binəqədi'] as const;
export type District = (typeof DISTRICTS)[number];

export type AppMode = 'owner' | 'sitter';
export type PetType = 'it' | 'pisik' | 'qus' | 'dovsan' | 'diger';
export type PetSex = 'erkek' | 'disi';
export type PetSize = 'kicik' | 'orta' | 'boyuk';
export type ServiceId = 'geceleme' | 'gunduz' | 'eve-bas-cekme' | 'it-gezdirme' | 'evde-gece-gunduz';
export type BookingStatus = 'gozlemede' | 'aktiv' | 'tamamlanmis' | 'imtina';
export type HomeType = 'menzil' | 'heyet';
export type MessageKind = 'text' | 'photo' | 'video' | 'system' | 'walk' | 'task';
export type DayStatus = 'free' | 'busy';
/** Sittsy: pulsuz mesaj → görüş → sifariş */
export type MeetGreetStage = 'mesaj' | 'gorus' | 'hazir' | 'sifaris';

export type ServiceIdOrAll = ServiceId | 'all';

export type UserProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  district: District;
  emergencyName: string;
  emergencyPhone: string;
  avatar?: string;
};

export type Pet = {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  ageYears: number;
  weightKg: number;
  sex: PetSex;
  sterilized: boolean;
  photos: string[];
  vaccines: string;
  allergies: string;
  medications: string;
  feeding: string;
  behavior: string;
  vetName: string;
  vetPhone: string;
};

export type SitterService = {
  serviceId: ServiceId;
  price: number;
  unit: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  petName: string;
};

export type Sitter = {
  id: string;
  name: string;
  photo: string;
  district: District;
  rating: number;
  reviewCount: number;
  acceptsRecurring?: boolean;
  bio: string;
  verified: boolean;
  homeType: HomeType;
  hasOwnPets: boolean;
  ownPetsNote: string;
  experienceYears: number;
  acceptedSizes: PetSize[];
  gallery: string[];
  services: SitterService[];
  reviews: Review[];
  short: string;
};

export type Booking = {
  id: string;
  sitterId: string;
  ownerName: string;
  petIds: string[];
  guestPetName?: string;
  guestPetNote?: string;
  serviceId: ServiceId;
  startDate: string;
  endDate: string;
  hours?: number;
  subtotal: number;
  fee: number;
  total: number;
  status: BookingStatus;
  forUserAs: 'owner' | 'sitter';
  createdAt: string;
  ownerReview?: { rating: number; text: string; at: string };
};

export type Chat = {
  id: string;
  sitterId: string;
  title: string;
  subtitle: string;
  photo: string;
  unread: number;
  bookingId?: string;
  meetGreet?: MeetGreetStage;
  freeChat?: boolean;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  fromMe: boolean;
  kind: MessageKind;
  text: string;
  photoUri?: string;
  videoUri?: string;
  at: string;
};

export type CareReport = {
  id: string;
  bookingId: string;
  chatId: string;
  photoUri?: string;
  note: string;
  tasks: string[];
  at: string;
};

export type Walk = {
  id: string;
  bookingId: string;
  chatId: string;
  active: boolean;
  points: { lat: number; lng: number; at: string }[];
  startedAt: string;
  endedAt?: string;
};

export type WalletTx = {
  id: string;
  title: string;
  amount: number;
  at: string;
  kind: 'escrow' | 'release' | 'topup' | 'payout' | 'promo';
};

export type Card = {
  id: string;
  brand: string;
  last4: string;
  holder: string;
};

export type Wallet = {
  available: number;
  escrow: number;
  sitterMonth: number;
  sitterReady: number;
  promo?: string;
  cards: Card[];
  history: WalletTx[];
};

export type SitterProfile = {
  bio: string;
  district: District;
  homeType: HomeType;
  hasOwnPets: boolean;
  ownPetsNote: string;
  experienceYears: number;
  acceptedSizes: PetSize[];
  gallery: string[];
  services: SitterService[];
  verified: boolean;
  idPhoto?: string;
  selfie?: string;
  fin: string;
  planActive?: boolean;
  qualityPassed?: boolean;
};

export type IncomingRequest = {
  id: string;
  bookingId?: string;
  ownerName: string;
  petName: string;
  petType: PetType;
  petAge: number;
  petBreed: string;
  note: string;
  serviceId: ServiceId;
  startDate: string;
  endDate: string;
  hours?: number;
  earn: number;
};
