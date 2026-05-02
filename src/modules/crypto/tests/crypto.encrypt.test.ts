import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SodiumCryptoEngine } from '@/modules/crypto/engines/SodiumCryptoEngine';
import { createMockProvider } from '@/modules/crypto/test-utils/createMockProvider';
import { asPlaintext } from '@/modules/crypto/utils/asPlaintext';
import { Plaintext } from '@/modules/crypto/core/Branding';
import { KEY_PURPOSE, VaultKey, withKeyBrand } from '@/modules/crypto/core/Key';

describe('SodiumCryptoEngine.encrypt tests', () => {
  let plaintext: Plaintext;
  let key: VaultKey;

  beforeEach(() => {
    plaintext = asPlaintext(new Uint8Array([1, 2, 3]));
    key = withKeyBrand(new Uint8Array([1, 1, 1]), KEY_PURPOSE.VAULT);
  });

  it('returns a valid EncryptedPayload', () => {
    const provider = createMockProvider();
    const engine = new SodiumCryptoEngine(provider);

    const result = engine.encrypt(plaintext, key);

    expect(result).toHaveProperty('ciphertext');
    expect(result).toHaveProperty('nonce');
    expect(result).toHaveProperty('version');
  });

  it('calls provider.encrypt with correct args', () => {
    const provider = createMockProvider();
    provider.encrypt = vi.fn().mockReturnValue(new Uint8Array(32));
    const engine = new SodiumCryptoEngine(provider);

    engine.encrypt(plaintext, key);

    expect(provider.encrypt).toHaveBeenCalledWith(
      plaintext,
      key,
      expect.any(Uint8Array), // nonce
    );
  });

  it('does not mutate plaintext or key', () => {
    const provider = createMockProvider();
    const engine = new SodiumCryptoEngine(provider);

    const plaintextCopy = new Uint8Array(plaintext);
    const keyCopy = new Uint8Array(key);

    engine.encrypt(plaintext, key);

    expect(plaintext).toEqual(plaintextCopy);
    expect(key).toEqual(keyCopy);
  });
});
