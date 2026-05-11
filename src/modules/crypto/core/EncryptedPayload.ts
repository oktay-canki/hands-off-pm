import { Ciphertext } from '@/modules/crypto/core/Branding';
import { CryptoVersion } from '@/modules/crypto/crypto.config';

export type EncryptedPayload = {
  ciphertext: Ciphertext;
  nonce: Uint8Array;
  version: CryptoVersion;
};
