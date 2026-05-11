import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import {
  ExportKey,
  KEY_PURPOSE,
  SubKey,
  withKeyBrand,
} from '@/modules/crypto/core/Key';
import {
  CRYPTO_CONFIG,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { createMockProvider } from '@/modules/crypto/tests/test-utils/createMockProvider';

import { beforeEach, describe, expect, it } from 'vitest';

const currentConfig = getCurrentCryptoConfig();
const validPayload = {
  ciphertext: new Uint8Array(32),
  nonce: new Uint8Array(currentConfig.constants.nonceLength),
  version: CRYPTO_CONFIG.current,
} as EncryptedPayload;

describe('Decryption input validation tests', () => {
  let engine: CryptoEngine;
  let key: ExportKey;

  beforeEach(() => {
    const provider = createMockProvider();
    engine = new SodiumCryptoEngine(provider);
    key = withKeyBrand(
      new Uint8Array(currentConfig.kdf.masterKeyLength),
      KEY_PURPOSE.EXPORT,
    );
  });

  it('throws if version is missing', () => {
    const payload = {
      ...validPayload,
      version: undefined as unknown,
    } as EncryptedPayload;

    expect(() => engine.decrypt(payload, key)).toThrow();
  });

  it('throws if nonce length is invalid', () => {
    const payload = {
      ...validPayload,
      nonce: new Uint8Array(10), // wrong length
    } as EncryptedPayload;

    expect(() => engine.decrypt(payload, key)).toThrow();
  });

  it('throws if key length is invalid', () => {
    const badKey = new Uint8Array(10) as SubKey;

    expect(() => engine.decrypt(validPayload, badKey)).toThrow();
  });

  it('throws if ciphertext is empty', () => {
    const payload = {
      ...validPayload,
      ciphertext: new Uint8Array(),
    } as EncryptedPayload;

    expect(() => engine.decrypt(payload, key)).toThrow();
  });

  it('throws if nonce is not Uint8Array', () => {
    const payload = {
      ...validPayload,
      nonce: 'not-a-uint8array' as unknown,
    } as EncryptedPayload;

    expect(() => engine.decrypt(payload, key)).toThrow();
  });
});
