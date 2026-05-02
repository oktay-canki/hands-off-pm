import { Ciphertext } from '@/modules/crypto/core/Branding';

export function asCiphertext(data: Uint8Array): Ciphertext {
  return data as Ciphertext;
}
