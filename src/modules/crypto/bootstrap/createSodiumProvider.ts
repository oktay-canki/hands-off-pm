import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { Sodium, SodiumProvider } from '@/modules/crypto/core/SodiumProvider';
import { MasterKeyPayload } from '@/modules/crypto/core/MasterKeyPayload';

export function createSodiumProvider(
  sodium: Sodium,
  config?: CryptoConfig,
): SodiumProvider {
  const cryptoConfig = config ?? getCurrentCryptoConfig();

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
    encrypt: (plaintext, key, nonce, aad) => {
      // Ensure common instance/constructor for preventing realm issues
      // Libsodium does instance checks!!
      const m = new Uint8Array(plaintext);
      const n = new Uint8Array(nonce);
      const k = new Uint8Array(key);

      return sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
        m,
        aad ?? null,
        null, // secret nonce (always null)
        n,
        k,
      );
    },
    decrypt: (ciphertext, key, nonce, aad) => {
      // Ensure common instance/constructor for preventing realm issues
      // Libsodium does instance checks!!
      const ct = new Uint8Array(ciphertext);
      const n = new Uint8Array(nonce);
      const k = new Uint8Array(key);

      return sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
        null, // nsec (always null)
        ct,
        aad ?? null,
        n,
        k,
      );
    },
    constants: cryptoConfig.constants,
    kdf: cryptoConfig.kdf,
  };
}
