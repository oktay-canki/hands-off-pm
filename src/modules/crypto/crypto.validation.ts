import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { SubKey } from '@/modules/crypto/core/Key';
import { getCryptoConfig } from '@/modules/crypto/crypto.config';

export function validateDecryptInput(
  payload: EncryptedPayload,
  key: SubKey,
): void {
  const { ciphertext, nonce, version } = payload;

  // --- Version
  if (version == null) {
    throw new Error('Missing crypto version');
  }

  const config = getCryptoConfig(version);

  // --- Ciphertext
  if (!(ciphertext instanceof Uint8Array)) {
    throw new Error('Ciphertext must be Uint8Array');
  }

  if (ciphertext.length === 0) {
    throw new Error('Ciphertext cannot be empty');
  }

  // --- Nonce
  if (!(nonce instanceof Uint8Array)) {
    throw new Error('Nonce must be Uint8Array');
  }

  if (nonce.length !== config.constants.nonceLength) {
    throw new Error(
      `Invalid nonce length: expected ${config.constants.nonceLength}, got ${nonce.length}`,
    );
  }

  // --- Key
  if (!(key instanceof Uint8Array)) {
    throw new Error('Key must be Uint8Array');
  }

  if (key.length !== config.kdf.subKeyLength) {
    throw new Error(
      `Invalid key length: expected ${config.kdf.subKeyLength}, got ${key.length}`,
    );
  }
}
