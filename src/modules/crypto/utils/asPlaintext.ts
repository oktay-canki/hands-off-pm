import { Plaintext } from '@/modules/crypto/core/Branding';

export function asPlaintext(data: Uint8Array): Plaintext {
  return data as Plaintext;
}
