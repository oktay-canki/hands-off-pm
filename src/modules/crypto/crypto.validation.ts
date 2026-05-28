import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { SubKey } from '@/modules/crypto/core/Key';
import { getCryptoConfig } from '@/modules/crypto/crypto.config';
import { InvalidDecryptionInputError } from '@/modules/crypto/error/InvalidDecryptInputError';

export function validateDecryptInput(
  payload: EncryptedPayload,
  key: SubKey,
): void {
  const { ciphertext, nonce, version } = payload;

  // --- Missing Version
  if (version == null) {
    throw new InvalidDecryptionInputError();
  }

  const config = getCryptoConfig(version);

  // --- Ciphertext
  if (!(ciphertext instanceof Uint8Array)) {
    throw new InvalidDecryptionInputError();
  }

  if (ciphertext.length === 0) {
    throw new InvalidDecryptionInputError();
  }

  // --- Nonce
  if (!(nonce instanceof Uint8Array)) {
    throw new InvalidDecryptionInputError();
  }

  if (nonce.length !== config.constants.nonceLength) {
    throw new InvalidDecryptionInputError();
  }

  // --- Key
  if (!(key instanceof Uint8Array)) {
    throw new InvalidDecryptionInputError();
  }

  if (key.length !== config.kdf.subKeyLength) {
    throw new InvalidDecryptionInputError();
  }
}
