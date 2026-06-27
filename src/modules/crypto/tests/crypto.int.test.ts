import { beforeEach, describe, expect, it } from 'vitest';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { KEY_PURPOSE, SubKey, withKeyBrand } from '@/modules/crypto/core/Key';
import {
  CRYPTO_CONFIG,
  CryptoVersion,
  getCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';

describe('SodiumCryptoEngine encrypt/decrypt(integration) tests', () => {
  let engine: SodiumCryptoEngine;
  const plaintext: Uint8Array = new Uint8Array([2, 4, 6, 8]);
  const key: SubKey = withKeyBrand(new Uint8Array(32), KEY_PURPOSE.EXPORT);

  beforeEach(async () => {
    const sodium = await initSodium();
    const provider = createSodiumProvider(sodium);
    engine = new SodiumCryptoEngine(provider);
  });

  it('encrypt → decrypt returns original plaintext', () => {
    const encrypted = engine.encrypt(plaintext, key);
    const decrypted = engine.decrypt(encrypted, key);

    expect(decrypted).toEqual(plaintext);
  });

  it('produces different ciphertext for same input', () => {
    const e1 = engine.encrypt(plaintext, key);
    const e2 = engine.encrypt(plaintext, key);

    expect(e1.ciphertext).not.toEqual(e2.ciphertext);
  });

  it('fails decryption when ciphertext is modified', () => {
    const encrypted = engine.encrypt(plaintext, key);

    encrypted.ciphertext[0]! ^= 1; // tamper data

    expect(() => {
      engine.decrypt(encrypted, key);
    }).toThrow();
  });

  it.each(Object.keys(CRYPTO_CONFIG.versions))(
    'roundtrip works for version %s',
    async (version) => {
      const config = getCryptoConfig(Number(version) as CryptoVersion);
      const sodium = await initSodium();
      const provider = createSodiumProvider(sodium, config);
      const cEngine = new SodiumCryptoEngine(provider);

      const encrypted = cEngine.encrypt(plaintext, key);
      const decrypted = cEngine.decrypt(encrypted, key);

      expect(decrypted).toEqual(plaintext);
    },
  );
});
