import { CryptoVersion } from '@/modules/crypto/crypto.config';

export type EncryptedPayload = {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
  version: CryptoVersion;
};
