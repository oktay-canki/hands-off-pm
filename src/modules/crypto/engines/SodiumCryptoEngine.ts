import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';
import { KEY_PURPOSE, withKeyBrand } from '@/modules/crypto/core/Key';

export class SodiumCryptoEngine implements CryptoEngine {
  constructor(private provider: SodiumProvider) {}

  async encrypt<T extends object>(
    data: T,
    key: Uint8Array,
  ): Promise<EncryptedPayload> {
    return {} as EncryptedPayload;
  }

  async decrypt<T>(data: EncryptedPayload, key: Uint8Array): Promise<T> {
    return {} as T;
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
}
