# dostum

Bakı üçün heyvan baxımı marketplace-i. Bir Expo (React Native) kod bazası **iOS** və **Android**-də işləyir. Bütün menyular Azərbaycan dilindədir.

İki rejim var:

- **Heyvan sahibi** — xidmət seç, baxıcı tap, sifariş et, canlı gəzinti və hesabatlara bax
- **Baxıcı** — sorğuları qəbul et, təqvim, canlı GPS/foto hesabat, qiymətlər

Ödəniş **escrow** simulyasiyasıdır: məbləğ + 15% platforma haqqı xidmət bitənə qədər bloklanır. Backend yoxdur — Bakı rayonları, Azərbaycan adları və `₼` ilə sınaq məlumatı daxildir.

## Telefonda (Expo Go)

1. App Store və ya Play Store-dan **Expo Go** quraşdırın.
2. Bu qovluqda:

```bash
npm install
npx expo start
```

3. QR kodu Expo Go ilə oxudun (eyni Wi-Fi).

iOS Simulator yalnız Mac + Xcode-da açılır (`i` düyməsi). Bu layihəni Mac-ə köçürüb eyni əmri işlədə bilərsiniz.

## Veb önizləmə

```bash
npm run web
```

Bəzi native funksiyalar (kamera, GPS, push) vebdə məhduddur; tam təcrübə telefonda və ya simulyatorda görünür.

## Əsas axın

1. **Xidmətlər** — gecələmə, gündüz baxımı, evə baş çəkmə, it gəzdirmə, evdə gecə-gündüz
2. **Axtarış** — Nəsimi, Yasamal, Səbail, Nərimanov, Xətai, Binəqədi
3. **Sifariş et** — qiymət + 15%, escrow
4. **Daha çox → Mənim dostlarım** — heyvan profili
5. **Baxıcı ol** — baxıcı tablarına keçid
6. Panelə düşən sorğunu **Qəbul et**, çatdan GPS və foto hesabat göndər

Promo-kod (sınaq): `DOSTUM10`

## Texniki yığın

Expo SDK 58, Expo Router, TypeScript, NativeWind, Reanimated, Gesture Handler, Bottom Sheet, `expo-location`, `expo-image-picker`, `expo-notifications`.
