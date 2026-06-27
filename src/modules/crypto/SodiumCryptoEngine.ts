import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';
import {
  KDF_CONTEXTS,
  KEY_PURPOSE,
  KeyBrand,
  MasterKey,
  SubKey,
  SubKeyPurpose,
  withKeyBrand,
} from '@/modules/crypto/core/Key';
import { CRYPTO_CONFIG, CryptoVersion } from '@/modules/crypto/crypto.config';
import { validateDecryptInput } from '@/modules/crypto/crypto.validation';
import { UnsupportedCryptoVersionError } from '@/modules/crypto/error/UnsupportedCryptoVersionError';

export class SodiumCryptoEngine implements CryptoEngine {
  constructor(private provider: SodiumProvider) {}

  encrypt(bytes: Uint8Array, key: SubKey): EncryptedPayload {
    const nonce = this.generateNonce();
    const ciphertext = this.provider.encrypt(bytes, key, nonce);

    return {
      ciphertext,
      nonce,
      version: CRYPTO_CONFIG.current,
    };
  }

  decrypt(payload: EncryptedPayload, key: SubKey): Uint8Array {
    validateDecryptInput(payload, key);

    const { ciphertext, nonce } = payload;
    return this.provider.decrypt(ciphertext, key, nonce);
  }

  generateSalt(): Uint8Array {
    return this.provider.randomBytes(this.provider.constants.saltLength);
  }

  generateNonce(): Uint8Array {
    return this.provider.randomBytes(this.provider.constants.nonceLength);
  }

  async deriveMasterKey(password: string, salt: Uint8Array) {
    const rawMasterKey = this.provider.pwhash({
      outputSize: this.provider.kdf.masterKeyLength,
      password,
      salt,
      opsLimit: this.provider.kdf.opsLimit,
      memLimit: this.provider.kdf.memLimit,
      algorithm: this.provider.kdf.algorithm,
    });

    return withKeyBrand(rawMasterKey, KEY_PURPOSE.MASTER);
  }

  deriveSubKey<T extends SubKeyPurpose>(
    masterKey: MasterKey,
    purpose: T,
  ): KeyBrand<T> {
    const context = KDF_CONTEXTS[purpose];

    const subKey = this.provider.deriveFromKey({
      length: this.provider.kdf.subKeyLength,
      key: masterKey,
      subKeyId: 0,
      context,
    });

    return withKeyBrand(subKey, purpose);
  }

  private resolveConfig(version: CryptoVersion) {
    const config = CRYPTO_CONFIG.versions[version];

    if (!config) {
      throw new UnsupportedCryptoVersionError();
    }

    return config;
  }
}
