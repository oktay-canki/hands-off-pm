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
import { Plaintext } from '@/modules/crypto/core/Branding';
import { asPlaintext } from '@/modules/crypto/utils/asPlaintext';
import { asCiphertext } from '@/modules/crypto/utils/asCiphertext';
import { CRYPTO_CONFIG, CryptoVersion } from '@/modules/crypto/crypto.config';
import { validateDecryptInput } from '@/modules/crypto/crypto.validation';

export class SodiumCryptoEngine implements CryptoEngine {
  constructor(private provider: SodiumProvider) {}

  encrypt(plaintext: Plaintext, key: SubKey): EncryptedPayload {
    const nonce = this.generateNonce();
    const ciphertext = this.provider.encrypt(plaintext, key, nonce);

    return {
      ciphertext: asCiphertext(ciphertext),
      nonce,
      version: CRYPTO_CONFIG.current,
    };
  }

  decrypt(payload: EncryptedPayload, key: SubKey): Plaintext {
    validateDecryptInput(payload, key);

    const { ciphertext, nonce } = payload;
    const plaintext = this.provider.decrypt(ciphertext, key, nonce);

    return asPlaintext(plaintext);
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
    subKeyId: number,
  ): KeyBrand<T> {
    const context = KDF_CONTEXTS[purpose];

    const subKey = this.provider.deriveFromKey({
      length: this.provider.kdf.subKeyLength,
      key: masterKey,
      subKeyId,
      context,
    });

    return withKeyBrand(subKey, purpose);
  }

  private resolveConfig(version: CryptoVersion) {
    const config = CRYPTO_CONFIG.versions[version];

    if (!config) {
      throw new Error('Unsupported crypto version.'); // TODO: standardize with custom errors
    }

    return config;
  }
}
