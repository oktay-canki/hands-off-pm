import { Plaintext } from '@/modules/crypto/core/Branding';
import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { SubKey } from '@/modules/crypto/core/Key';
import { asPlaintext } from '@/modules/crypto/utils/asPlaintext';

class CryptoService {
  constructor(private readonly engine: CryptoEngine) {}

  encrypt<T>(data: T, key: SubKey): EncryptedPayload {
    const plaintext = this.serialize(data);
    const payload = this.engine.encrypt(plaintext, key);

    return payload;
  }

  decrypt<T>(payload: EncryptedPayload, key: SubKey): T {
    const plaintext = this.engine.decrypt(payload, key);

    return this.deserialize<T>(plaintext);
  }

  private serialize(data: unknown): Plaintext {
    const encoder = new TextEncoder();
    return asPlaintext(encoder.encode(JSON.stringify(data)));
  }

  private deserialize<T>(bytes: Uint8Array): T {
    try {
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new Error('Decryption failed: invalid plaintext');
    }
  }
}

export default CryptoService;
