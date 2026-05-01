import { CRYPTO_CONFIG } from '@/modules/crypto/config/crypto.config';
import { Sodium, SodiumProvider } from '@/modules/crypto/core/SodiumProvider';
import { MasterKeyPayload } from '@/modules/crypto/core/MasterKeyPayload';

export function createSodiumProvider(sodium: Sodium): SodiumProvider {
  return {
    randomBytes: (n: number): Uint8Array => {
      return sodium.randombytes_buf(n);
    },
    pwhash: ({
      outputSize,
      password,
      salt,
      opsLimit,
      memLimit,
      algorithm,
    }: MasterKeyPayload) => {
      return sodium.crypto_pwhash(
        outputSize,
        password,
        salt,
        opsLimit,
        memLimit,
        algorithm,
      );
    },
    deriveFromKey: ({ length, subKeyId, context, key }) => {
      return sodium.crypto_kdf_derive_from_key(length, subKeyId, context, key);
    },
    constants: CRYPTO_CONFIG.constants,
    kdf: CRYPTO_CONFIG.kdf,
  };
}
