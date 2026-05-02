import { Ciphertext } from '@/modules/crypto/core/Branding';

export type EncryptedPayload = {
  ciphertext: Ciphertext;
  nonce: Uint8Array;
  version: number;
};
