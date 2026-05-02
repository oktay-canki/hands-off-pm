import { beforeEach, describe, expect, it } from 'vitest';
import { SodiumCryptoEngine } from '@/modules/crypto/engines/SodiumCryptoEngine';
import { createServices } from '@/lib/bootstrap';
import { Plaintext } from '@/modules/crypto/core/Branding';
import { asPlaintext } from '@/modules/crypto/utils/asPlaintext';
import { KEY_PURPOSE, SubKey, withKeyBrand } from '@/modules/crypto/core/Key';

describe('SodiumCryptoEngine encrypt/decrypt(integration) tests', () => {
  let engine: SodiumCryptoEngine;
  let plaintext: Plaintext;
  let key: SubKey;

  beforeEach(async () => {
    engine = (await createServices()).crypto;
    plaintext = asPlaintext(new Uint8Array([2, 4, 6, 8]));
    key = withKeyBrand(new Uint8Array(32), KEY_PURPOSE.EXPORT);
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
});
