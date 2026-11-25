import { type Href, Redirect } from 'expo-router';

/** Köhnə qısa axın — tam qeydiyyat wizardına yönləndirir */
export default function BecomeSitterLegacy() {
  return <Redirect href={'/baxici-qeydiyyat' as Href} />;
}