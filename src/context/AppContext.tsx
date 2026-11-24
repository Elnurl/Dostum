import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';

import { BAKU_WALK, PLATFORM_FEE, SERVICES } from '@/src/data/catalog';
import {
  BOOKINGS,
  CHATS,
  MESSAGES,
  PETS,
  REPORTS,
  REQUESTS,
  SITTER_PROFILE,
  SITTERS,
  USER,
  WALKS,
  WALLET,
  defaultAvailability,
} from '@/src/data/mock';
import { addDaysIso, nightsBetween, todayIso, uid } from '@/src/lib/format';
import { notify, setupNotifications } from '@/src/lib/notifications';
import type {
  AppMode,
  Booking,
  CareReport,
  Chat,
  ChatMessage,
  DayStatus,
  IncomingRequest,
  Pet,
  ServiceId,
  SitterProfile,
  UserProfile,
  Walk,
  Wallet,
} from '@/src/types';

const STORAGE_KEY = 'dostum-state-v1';

type State = {
  ready: boolean;
  mode: AppMode;
  user: UserProfile;
  pets: Pet[];
  favorites: string[];
  bookings: Booking[];
  chats: Chat[];
  messages: ChatMessage[];
  reports: CareReport[];
  walks: Walk[];
  wallet: Wallet;
  sitter: SitterProfile;
  accepting: boolean;
  requests: IncomingRequest[];
  availability: Record<string, DayStatus>;
  notificationsOn: boolean;
};

type Action =
  | { type: 'HYDRATE'; state: Partial<State> }
  | { type: 'READY' }
  | { type: 'SET_MODE'; mode: AppMode }
  | { type: 'SET_USER'; user: UserProfile }
  | { type: 'SET_AVATAR'; uri: string }
  | { type: 'UPSERT_PET'; pet: Pet }
  | { type: 'REMOVE_PET'; id: string }
  | { type: 'TOGGLE_FAV'; id: string }
  | { type: 'ADD_BOOKING'; booking: Booking; chat: Chat; message: ChatMessage }
  | { type: 'SET_BOOKING_STATUS'; id: string; status: Booking['status'] }
  | { type: 'SEND_MESSAGE'; message: ChatMessage }
  | { type: 'MARK_CHAT_READ'; chatId: string }
  | { type: 'ADD_REPORT'; report: CareReport; message: ChatMessage }
  | { type: 'START_WALK'; walk: Walk; message: ChatMessage }
  | { type: 'TICK_WALK'; id: string; point: Walk['points'][number] }
  | { type: 'STOP_WALK'; id: string; message: ChatMessage }
  | { type: 'SET_ACCEPTING'; value: boolean }
  | { type: 'DECIDE_REQUEST'; id: string; accept: boolean; booking?: Booking; chat?: Chat; message?: ChatMessage }
  | { type: 'SET_SITTER'; sitter: SitterProfile }
  | { type: 'SET_DAY'; date: string; status: DayStatus }
  | { type: 'APPLY_PROMO'; code: string }
  | { type: 'TOPUP'; amount: number }
  | { type: 'PAYOUT'; amount: number }
  | { type: 'ADD_CARD'; last4: string }
  | { type: 'TOGGLE_NOTIF' };

const initialState: State = {
  ready: false,
  mode: 'owner',
  user: USER,
  pets: PETS,
  favorites: [],
  bookings: BOOKINGS,
  chats: CHATS,
  messages: MESSAGES,
  reports: REPORTS,
  walks: WALKS,
  wallet: WALLET,
  sitter: SITTER_PROFILE,
  accepting: true,
  requests: REQUESTS,
  availability: defaultAvailability(),
  notificationsOn: true,
};

function persistable(state: State): Partial<State> {
  const { ready: _ready, ...rest } = state;
  return rest;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.state, ready: true };
    case 'READY':
      return { ...state, ready: true };
    case 'SET_MODE':
      return { ...state, mode: action.mode };
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SET_AVATAR':
      return { ...state, user: { ...state.user, avatar: action.uri } };
    case 'UPSERT_PET': {
      const exists = state.pets.some((p) => p.id === action.pet.id);
      return {
        ...state,
        pets: exists ? state.pets.map((p) => (p.id === action.pet.id ? action.pet : p)) : [...state.pets, action.pet],
      };
    }
    case 'REMOVE_PET':
      return { ...state, pets: state.pets.filter((p) => p.id !== action.id) };
    case 'TOGGLE_FAV': {
      const has = state.favorites.includes(action.id);
      return {
        ...state,
        favorites: has ? state.favorites.filter((id) => id !== action.id) : [...state.favorites, action.id],
      };
    }
    case 'ADD_BOOKING':
      return {
        ...state,
        bookings: [action.booking, ...state.bookings],
        chats: [action.chat, ...state.chats.filter((c) => c.id !== action.chat.id)],
        messages: [...state.messages, action.message],
        wallet: {
          ...state.wallet,
          available: Math.max(0, state.wallet.available - action.booking.total),
          escrow: state.wallet.escrow + action.booking.total,
          history: [
            {
              id: uid('t'),
              title: `Escrow — ${action.chat.title}`,
              amount: -action.booking.total,
              at: new Date().toISOString(),
              kind: 'escrow',
            },
            ...state.wallet.history,
          ],
        },
      };
    case 'SET_BOOKING_STATUS': {
      const booking = state.bookings.find((b) => b.id === action.id);
      let wallet = state.wallet;
      if (booking && action.status === 'tamamlanmis' && booking.status !== 'tamamlanmis') {
        wallet = {
          ...wallet,
          escrow: Math.max(0, wallet.escrow - booking.total),
          history: [
            {
              id: uid('t'),
              title: 'Xidmət tamamlandı — escrow açıldı',
              amount: 0,
              at: new Date().toISOString(),
              kind: 'release',
            },
            ...wallet.history,
          ],
        };
        if (booking.forUserAs === 'sitter') {
          wallet = {
            ...wallet,
            sitterMonth: wallet.sitterMonth + booking.subtotal,
            sitterReady: wallet.sitterReady + booking.subtotal,
          };
        }
      }
      if (booking && action.status === 'imtina' && booking.status === 'gozlemede' && booking.forUserAs === 'owner') {
        wallet = {
          ...wallet,
          escrow: Math.max(0, wallet.escrow - booking.total),
          available: wallet.available + booking.total,
          history: [
            {
              id: uid('t'),
              title: 'Escrow qaytarıldı',
              amount: booking.total,
              at: new Date().toISOString(),
              kind: 'release',
            },
            ...wallet.history,
          ],
        };
      }
      return {
        ...state,
        bookings: state.bookings.map((b) => (b.id === action.id ? { ...b, status: action.status } : b)),
        wallet,
      };
    }
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        chats: state.chats.map((c) =>
          c.id === action.message.chatId ? { ...c, subtitle: action.message.text, unread: action.message.fromMe ? c.unread : c.unread + 1 } : c,
        ),
      };
    case 'MARK_CHAT_READ':
      return { ...state, chats: state.chats.map((c) => (c.id === action.chatId ? { ...c, unread: 0 } : c)) };
    case 'ADD_REPORT':
      return {
        ...state,
        reports: [action.report, ...state.reports],
        messages: [...state.messages, action.message],
        chats: state.chats.map((c) => (c.id === action.report.chatId ? { ...c, subtitle: action.report.note, unread: c.unread + 1 } : c)),
      };
    case 'START_WALK':
      return {
        ...state,
        walks: [action.walk, ...state.walks.filter((w) => w.bookingId !== action.walk.bookingId)],
        messages: [...state.messages, action.message],
      };
    case 'TICK_WALK':
      return {
        ...state,
        walks: state.walks.map((w) => (w.id === action.id ? { ...w, points: [...w.points, action.point] } : w)),
      };
    case 'STOP_WALK':
      return {
        ...state,
        walks: state.walks.map((w) => (w.id === action.id ? { ...w, active: false, endedAt: new Date().toISOString() } : w)),
        messages: [...state.messages, action.message],
      };
    case 'SET_ACCEPTING':
      return { ...state, accepting: action.value };
    case 'DECIDE_REQUEST': {
      const next: State = { ...state, requests: state.requests.filter((r) => r.id !== action.id) };
      if (action.accept && action.booking && action.chat && action.message) {
        next.bookings = [action.booking, ...next.bookings];
        next.chats = [action.chat, ...next.chats];
        next.messages = [...next.messages, action.message];
        next.availability = { ...next.availability, [action.booking.startDate]: 'busy' };
      }
      return next;
    }
    case 'SET_SITTER':
      return { ...state, sitter: action.sitter };
    case 'SET_DAY':
      return { ...state, availability: { ...state.availability, [action.date]: action.status } };
    case 'APPLY_PROMO':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          promo: action.code,
          available: state.wallet.available + 10,
          history: [
            { id: uid('t'), title: `Promo ${action.code}`, amount: 10, at: new Date().toISOString(), kind: 'promo' },
            ...state.wallet.history,
          ],
        },
      };
    case 'TOPUP':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          available: state.wallet.available + action.amount,
          history: [
            { id: uid('t'), title: 'Balans artırıldı', amount: action.amount, at: new Date().toISOString(), kind: 'topup' },
            ...state.wallet.history,
          ],
        },
      };
    case 'PAYOUT':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          sitterReady: Math.max(0, state.wallet.sitterReady - action.amount),
          history: [
            { id: uid('t'), title: 'Çıxarış karta köçürüldü', amount: action.amount, at: new Date().toISOString(), kind: 'payout' },
            ...state.wallet.history,
          ],
        },
      };
    case 'ADD_CARD':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          cards: [
            ...state.wallet.cards,
            { id: uid('card'), brand: 'Kapital Bank Mastercard', last4: action.last4, holder: `${state.user.firstName} ${state.user.lastName}`.toUpperCase() },
          ],
        },
      };
    case 'TOGGLE_NOTIF':
      return { ...state, notificationsOn: !state.notificationsOn };
    default:
      return state;
  }
}

type Ctx = State & {
  sitters: typeof SITTERS;
  setMode: (mode: AppMode) => void;
  setUser: (user: UserProfile) => void;
  setAvatar: (uri: string) => void;
  savePet: (pet: Pet) => void;
  removePet: (id: string) => void;
  toggleFavorite: (id: string) => void;
  createBooking: (input: { sitterId: string; serviceId: ServiceId; petIds: string[]; startDate: string; endDate: string; hours?: number }) => Booking;
  setBookingStatus: (id: string, status: Booking['status']) => void;
  sendMessage: (chatId: string, text: string) => void;
  markChatRead: (chatId: string) => void;
  sendReport: (input: { bookingId: string; chatId: string; note: string; photoUri?: string; tasks: string[] }) => void;
  startWalk: (bookingId: string, chatId: string) => Promise<void>;
  stopWalk: (walkId: string) => void;
  setAccepting: (value: boolean) => void;
  decideRequest: (id: string, accept: boolean) => void;
  setSitter: (sitter: SitterProfile) => void;
  toggleDay: (date: string) => void;
  applyPromo: (code: string) => boolean;
  topup: (amount: number) => void;
  payout: (amount: number) => void;
  addCard: (last4: string) => void;
  toggleNotifications: () => void;
  sitterById: (id: string) => (typeof SITTERS)[number] | undefined;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await setupNotifications();
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as Partial<State>;
          dispatch({ type: 'HYDRATE', state: parsed });
          return;
        }
      } catch {
        /* first run */
      }
      if (!cancelled) dispatch({ type: 'READY' });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persistable(state))).catch(() => undefined);
  }, [state]);

  useEffect(() => {
    const active = state.walks.find((w) => w.active);
    if (!active) return;
    const timer = setInterval(() => {
      const nextIndex = Math.min(active.points.length, BAKU_WALK.length - 1);
      const coord = BAKU_WALK[nextIndex];
      if (!coord || active.points.length >= BAKU_WALK.length) return;
      dispatch({
        type: 'TICK_WALK',
        id: active.id,
        point: { ...coord, at: new Date().toISOString() },
      });
    }, 2800);
    return () => clearInterval(timer);
  }, [state.walks]);

  const setMode = useCallback((mode: AppMode) => dispatch({ type: 'SET_MODE', mode }), []);
  const setUser = useCallback((user: UserProfile) => dispatch({ type: 'SET_USER', user }), []);
  const setAvatar = useCallback((uri: string) => dispatch({ type: 'SET_AVATAR', uri }), []);
  const savePet = useCallback((pet: Pet) => dispatch({ type: 'UPSERT_PET', pet }), []);
  const removePet = useCallback((id: string) => dispatch({ type: 'REMOVE_PET', id }), []);
  const toggleFavorite = useCallback((id: string) => dispatch({ type: 'TOGGLE_FAV', id }), []);
  const setBookingStatus = useCallback((id: string, status: Booking['status']) => {
    dispatch({ type: 'SET_BOOKING_STATUS', id, status });
    if (status === 'aktiv') void notify('Sifariş qəbul olundu', 'Baxıcı sifarişinizi qəbul etdi.');
    if (status === 'tamamlanmis') void notify('Xidmət tamamlandı', 'Escrow açıdı, ödəniş baxıcıya keçdi.');
  }, []);

  const createBooking = useCallback<Ctx['createBooking']>(
    ({ sitterId, serviceId, petIds, startDate, endDate, hours }) => {
      const sitter = SITTERS.find((s) => s.id === sitterId);
      const service = sitter?.services.find((s) => s.serviceId === serviceId) ?? { price: 15, unit: 'gün' };
      const catalog = SERVICES.find((s) => s.id === serviceId);
      const qty =
        serviceId === 'it-gezdirme' || serviceId === 'eve-bas-cekme'
          ? Math.max(1, hours ?? 1)
          : nightsBetween(startDate, endDate);
      const subtotal = service.price * qty;
      const fee = Math.round(subtotal * PLATFORM_FEE * 100) / 100;
      const booking: Booking = {
        id: uid('b'),
        sitterId,
        ownerName: `${state.user.firstName} ${state.user.lastName}`,
        petIds,
        serviceId,
        startDate,
        endDate,
        hours: serviceId === 'it-gezdirme' || serviceId === 'eve-bas-cekme' ? qty : undefined,
        subtotal,
        fee,
        total: Math.round((subtotal + fee) * 100) / 100,
        status: 'gozlemede',
        forUserAs: 'owner',
        createdAt: new Date().toISOString(),
      };
      const existing = state.chats.find((c) => c.sitterId === sitterId);
      const chat: Chat = existing ?? {
        id: uid('c'),
        sitterId,
        title: sitter?.name ?? 'Baxıcı',
        subtitle: 'Yeni sifariş göndərildi',
        photo: sitter?.photo ?? '',
        unread: 1,
        bookingId: booking.id,
      };
      const message: ChatMessage = {
        id: uid('m'),
        chatId: chat.id,
        fromMe: false,
        kind: 'system',
        text: `Sifariş göndərildi: ${catalog?.title ?? serviceId}. Məbləğ ${booking.total} ₼ escrow-da bloklandı.`,
        at: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_BOOKING', booking, chat: { ...chat, bookingId: booking.id, unread: 1 }, message });
      void notify('Sifariş göndərildi', `${sitter?.name ?? 'Baxıcı'} cavabını gözləyir. Məbləğ təhlükəsiz saxlanılır.`);
      return booking;
    },
    [state.user, state.chats],
  );

  const sendMessage = useCallback((chatId: string, text: string) => {
    dispatch({
      type: 'SEND_MESSAGE',
      message: { id: uid('m'), chatId, fromMe: true, kind: 'text', text, at: new Date().toISOString() },
    });
  }, []);

  const markChatRead = useCallback((chatId: string) => dispatch({ type: 'MARK_CHAT_READ', chatId }), []);

  const sendReport = useCallback<Ctx['sendReport']>(({ bookingId, chatId, note, photoUri, tasks }) => {
    const report: CareReport = {
      id: uid('rep'),
      bookingId,
      chatId,
      note,
      photoUri,
      tasks,
      at: new Date().toISOString(),
    };
    const message: ChatMessage = {
      id: uid('m'),
      chatId,
      fromMe: true,
      kind: photoUri ? 'photo' : 'task',
      text: note || tasks.join(', '),
      photoUri,
      at: report.at,
    };
    dispatch({ type: 'ADD_REPORT', report, message });
    void notify('Yeni qayğı hesabatı', note || 'Baxıcı tapşırıqları yenilədi.');
  }, []);

  const startWalk = useCallback(async (bookingId: string, chatId: string) => {
    let point = BAKU_WALK[0];
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.granted) {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        point = { lat: loc.coords.latitude, lng: loc.coords.longitude };
      }
    } catch {
      /* simulyasiya */
    }
    const walk: Walk = {
      id: uid('w'),
      bookingId,
      chatId,
      active: true,
      startedAt: new Date().toISOString(),
      points: [{ ...point, at: new Date().toISOString() }],
    };
    const message: ChatMessage = {
      id: uid('m'),
      chatId,
      fromMe: true,
      kind: 'walk',
      text: 'Gəzinti başladı — canlı GPS izləmə aktivdir.',
      at: walk.startedAt,
    };
    dispatch({ type: 'START_WALK', walk, message });
    void notify('Gəzinti başladı', 'Canlı marşrut sahibə göndərilir.');
  }, []);

  const stopWalk = useCallback((walkId: string) => {
    const walk = state.walks.find((w) => w.id === walkId);
    if (!walk) return;
    dispatch({
      type: 'STOP_WALK',
      id: walkId,
      message: {
        id: uid('m'),
        chatId: walk.chatId,
        fromMe: true,
        kind: 'walk',
        text: 'Gəzinti bitdi. Dostunuz evə qayıdır.',
        at: new Date().toISOString(),
      },
    });
  }, [state.walks]);

  const setAccepting = useCallback((value: boolean) => dispatch({ type: 'SET_ACCEPTING', value }), []);

  const decideRequest = useCallback(
    (id: string, accept: boolean) => {
      const req = state.requests.find((r) => r.id === id);
      if (!req) return;
      if (!accept) {
        dispatch({ type: 'DECIDE_REQUEST', id, accept: false });
        return;
      }
      const booking: Booking = {
        id: uid('b'),
        sitterId: 'me',
        ownerName: req.ownerName,
        petIds: [],
        guestPetName: req.petName,
        guestPetNote: `${req.petBreed}, ${req.petAge} yaş. ${req.note}`,
        serviceId: req.serviceId,
        startDate: req.startDate,
        endDate: req.endDate,
        hours: req.hours,
        subtotal: req.earn,
        fee: Math.round(req.earn * PLATFORM_FEE * 100) / 100,
        total: req.earn,
        status: 'aktiv',
        forUserAs: 'sitter',
        createdAt: new Date().toISOString(),
      };
      const chat: Chat = {
        id: uid('c'),
        sitterId: 'owner-' + req.id,
        title: req.ownerName,
        subtitle: `${req.petName} üçün sifariş qəbul edildi`,
        photo: 'https://randomuser.me/api/portraits/women/33.jpg',
        unread: 0,
        bookingId: booking.id,
      };
      const message: ChatMessage = {
        id: uid('m'),
        chatId: chat.id,
        fromMe: true,
        kind: 'system',
        text: 'Sifarişi qəbul etdiniz. Canlı hesabat göndərə bilərsiniz.',
        at: new Date().toISOString(),
      };
      dispatch({ type: 'DECIDE_REQUEST', id, accept: true, booking, chat, message });
      void notify('Yeni sifariş', `${req.ownerName} — ${req.petName}`);
    },
    [state.requests],
  );

  const setSitter = useCallback((sitter: SitterProfile) => dispatch({ type: 'SET_SITTER', sitter }), []);
  const toggleDay = useCallback(
    (date: string) => {
      const current = state.availability[date] ?? 'free';
      dispatch({ type: 'SET_DAY', date, status: current === 'free' ? 'busy' : 'free' });
    },
    [state.availability],
  );
  const applyPromo = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (normalized !== 'DOSTUM10' && normalized !== 'LEO10') return false;
      if (state.wallet.promo) return false;
      dispatch({ type: 'APPLY_PROMO', code: normalized });
      return true;
    },
    [state.wallet.promo],
  );
  const topup = useCallback((amount: number) => dispatch({ type: 'TOPUP', amount }), []);
  const payout = useCallback((amount: number) => dispatch({ type: 'PAYOUT', amount }), []);
  const addCard = useCallback((last4: string) => dispatch({ type: 'ADD_CARD', last4 }), []);
  const toggleNotifications = useCallback(() => dispatch({ type: 'TOGGLE_NOTIF' }), []);
  const sitterById = useCallback((id: string) => SITTERS.find((s) => s.id === id), []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      sitters: SITTERS,
      setMode,
      setUser,
      setAvatar,
      savePet,
      removePet,
      toggleFavorite,
      createBooking,
      setBookingStatus,
      sendMessage,
      markChatRead,
      sendReport,
      startWalk,
      stopWalk,
      setAccepting,
      decideRequest,
      setSitter,
      toggleDay,
      applyPromo,
      topup,
      payout,
      addCard,
      toggleNotifications,
      sitterById,
    }),
    [
      state,
      setMode,
      setUser,
      setAvatar,
      savePet,
      removePet,
      toggleFavorite,
      createBooking,
      setBookingStatus,
      sendMessage,
      markChatRead,
      sendReport,
      startWalk,
      stopWalk,
      setAccepting,
      decideRequest,
      setSitter,
      toggleDay,
      applyPromo,
      topup,
      payout,
      addCard,
      toggleNotifications,
      sitterById,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp AppProvider daxilində çağırılmalıdır');
  return ctx;
}

export function quotePrice(sitter: (typeof SITTERS)[number], serviceId: ServiceId, startDate: string, endDate: string, hours = 1) {
  const service = sitter.services.find((s) => s.serviceId === serviceId);
  const price = service?.price ?? 15;
  const qty =
    serviceId === 'it-gezdirme' || serviceId === 'eve-bas-cekme' ? Math.max(1, hours) : nightsBetween(startDate, endDate);
  const subtotal = price * qty;
  const fee = Math.round(subtotal * PLATFORM_FEE * 100) / 100;
  return { price, qty, unit: service?.unit ?? 'gün', subtotal, fee, total: Math.round((subtotal + fee) * 100) / 100 };
}

export function upcomingDays(count = 10) {
  const start = todayIso();
  return Array.from({ length: count }, (_, i) => addDaysIso(start, i));
}
