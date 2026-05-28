import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import {
  KeyBrand,
  MasterKey,
  SubKey,
  SubKeyPurpose,
} from '@/modules/crypto/core/Key';
import { Plaintext } from '@/modules/crypto/core/Branding';

export interface CryptoEngine {
  encrypt(plaintext: Plaintext, key: SubKey): EncryptedPayload;
  decrypt(payload: EncryptedPayload, key: SubKey): Plaintext;

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
