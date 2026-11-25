import type { AccountKind } from '@/src/types';

type RouteInput = {
  signedIn: boolean;
  accountKind: AccountKind | null;
  sitterOnboardingComplete?: boolean;
  sitterContractSigned?: boolean;
};

export function homeHref(input: RouteInput) {
  if (!input.accountKind) return '/rol-secimi';
  if (!input.signedIn) return '/giris';
  if (input.accountKind === 'baytar' || input.accountKind === 'dukan') return '/tezlikle';
  if (input.accountKind === 'baxici') {
    if (!input.sitterContractSigned || !input.sitterOnboardingComplete) return '/baxici-qeydiyyat';
    return '/(sitter)';
  }
  return '/(owner)';
}