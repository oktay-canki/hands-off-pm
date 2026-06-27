import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import {
  KeyBrand,
  MasterKey,
  SubKey,
  SubKeyPurpose,
} from '@/modules/crypto/core/Key';

export interface CryptoEngine {
  encrypt(bytes: Uint8Array, key: SubKey): EncryptedPayload;
  decrypt(payload: EncryptedPayload, key: SubKey): Uint8Array;

  generateSalt(): Uint8Array;
  generateNonce(): Uint8Array;
  deriveMasterKey(password: string, salt: Uint8Array): Promise<MasterKey>;
  deriveSubKey<T extends SubKeyPurpose>(
    masterKey: MasterKey,
    purpose: T,
  ): KeyBrand<T>;
}
