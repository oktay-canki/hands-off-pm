import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { KeyBrand, MasterKey, SubKeyPurpose } from '@/modules/crypto/core/Key';

export interface CryptoEngine {
  encrypt<T extends object>(
    data: T,
    key: Uint8Array,
  ): Promise<EncryptedPayload>;
  decrypt<T>(data: EncryptedPayload, key: Uint8Array): Promise<T>;
  generateSalt(): Uint8Array;
  generateNonce(): Uint8Array;
  deriveMasterKey(password: string, salt: Uint8Array): Promise<MasterKey>;
  deriveSubKey<T extends SubKeyPurpose>(
    masterKey: MasterKey,
    purpose: T,
    subKeyId: number,
    length: number,
  ): KeyBrand<T>;
}
