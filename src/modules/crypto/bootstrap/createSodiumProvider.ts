import { CRYPTO_CONFIG } from '@/modules/crypto/config/crypto.config';
import { Sodium, SodiumProvider } from '@/modules/crypto/core/SodiumProvider';

export function createSodiumProvider(sodium: Sodium): SodiumProvider {
  return {
    randomBytes: (n: number): Uint8Array => {
      return sodium.randombytes_buf(n);
    },
    constants: CRYPTO_CONFIG.constants,
  };
}
