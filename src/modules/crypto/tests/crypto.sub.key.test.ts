import { describe, expect, it, vi } from 'vitest';
import { createMockProvider } from '@/modules/crypto/tests/test-utils/createMockProvider';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import {
  KDF_CONTEXTS,
  KEY_PURPOSE,
  MasterKey,
} from '@/modules/crypto/core/Key';

describe('CryptoEngine.deriveSubKey', () => {
  it('calls deriveFromKey with correct parameters', () => {
    const provider = createMockProvider();
    provider.deriveFromKey = vi
      .fn()
      .mockReturnValue(new Uint8Array(provider.kdf.subKeyLength));
    const engine = new SodiumCryptoEngine(provider);
    const masterKey = new Uint8Array(provider.kdf.masterKeyLength) as MasterKey;

    engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);

    expect(provider.deriveFromKey).toHaveBeenCalledWith({
      length: provider.kdf.subKeyLength,
      key: masterKey,
      subKeyId: 1,
      context: KDF_CONTEXTS[KEY_PURPOSE.VAULT],
    });
  });

  it('uses correct context per subkey purpose', () => {
    const provider = createMockProvider();
    provider.deriveFromKey = vi
      .fn()
      .mockReturnValue(new Uint8Array(provider.kdf.subKeyLength));
    const engine = new SodiumCryptoEngine(provider);
    const masterKey = new Uint8Array(provider.kdf.masterKeyLength) as MasterKey;

    engine.deriveSubKey(masterKey, KEY_PURPOSE.ENTRY, 1);

    expect(provider.deriveFromKey).toHaveBeenCalledWith(
      expect.objectContaining({
        context: KDF_CONTEXTS[KEY_PURPOSE.ENTRY],
      }),
    );
  });

  it('is deterministic for same inputs', () => {
    const provider = createMockProvider();
    const fakeKey = new Uint8Array([1, 2, 3]);

    provider.deriveFromKey = vi.fn().mockReturnValue(fakeKey);

    const engine = new SodiumCryptoEngine(provider);
    const masterKey = new Uint8Array(provider.kdf.masterKeyLength) as MasterKey;
    const k1 = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);
    const k2 = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);

    expect(k1).toEqual(k2);
  });

  it('passes subKeyId correctly', () => {
    const provider = createMockProvider();
    provider.deriveFromKey = vi.fn().mockReturnValue(new Uint8Array(32));

    const engine = new SodiumCryptoEngine(provider);
    const masterKey = new Uint8Array(32) as MasterKey;

    engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 10);

    expect(provider.deriveFromKey).toHaveBeenCalledWith(
      expect.objectContaining({
        subKeyId: 10,
      }),
    );
  });
});
