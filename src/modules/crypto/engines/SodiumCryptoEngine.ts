import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { DerivedKey } from '@/modules/crypto/core/DerivedKey';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';

export class SodiumCryptoEngine implements CryptoEngine {
  constructor(private provider: SodiumProvider) {}

  async encrypt<T extends object>(
    data: T,
    key: DerivedKey,
  ): Promise<EncryptedPayload> {
    return {} as EncryptedPayload;
  }

  async decrypt<T>(data: EncryptedPayload, key: DerivedKey): Promise<T> {
    return {} as T;
  }

  generateSalt(): Uint8Array {
    return this.provider.randomBytes(this.provider.constants.saltLength);
  }

  generateNonce(): Uint8Array {
    return this.provider.randomBytes(this.provider.constants.nonceLength);
  }
}
