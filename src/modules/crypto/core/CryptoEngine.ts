import { DerivedKey } from '@/modules/crypto/core/DerivedKey';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';

export interface CryptoEngine {
  encrypt<T extends object>(
    data: T,
    key: DerivedKey,
  ): Promise<EncryptedPayload>;
  decrypt<T>(data: EncryptedPayload, key: DerivedKey): Promise<T>;
  generateSalt(): Uint8Array;
}
