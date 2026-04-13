import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { DerivedKey } from '@/modules/crypto/core/DerivedKey';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';

export class SodiumCryptoEngine implements CryptoEngine {
  async encrypt<T extends object>(
    data: T,
    key: DerivedKey,
  ): Promise<EncryptedPayload> {
    return {} as EncryptedPayload;
  }

  async decrypt<T>(data: EncryptedPayload, key: DerivedKey): Promise<T> {
    return {} as T;
  }
}
