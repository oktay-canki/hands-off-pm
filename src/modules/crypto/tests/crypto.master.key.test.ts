import { describe, expect, it, vi } from 'vitest';
import { createMockProvider } from '@/modules/crypto/test-utils/createMockProvider';
import { SodiumCryptoEngine } from '@/modules/crypto/engines/SodiumCryptoEngine';

describe('CryptoEngine.deriveMasterKey', () => {
  it('calls pwhash with correct parameters', async () => {
    const provider = createMockProvider();
    provider.pwhash = vi.fn().mockReturnValue(new Uint8Array(32));

    const engine = new SodiumCryptoEngine(provider);
    const password = 'test-password';
    const salt = new Uint8Array([1, 2, 3]);
    await engine.deriveMasterKey(password, salt);

    expect(provider.pwhash).toHaveBeenCalledWith({
      outputSize: provider.kdf.masterKeyLength,
      password,
      salt,
      opsLimit: provider.kdf.opsLimit,
      memLimit: provider.kdf.memLimit,
      algorithm: provider.kdf.algorithm,
    });
  });

  it('returns master key with correct length', async () => {
    const provider = createMockProvider();
    const engine = new SodiumCryptoEngine(provider);
    const key = await engine.deriveMasterKey(
      'password',
      new Uint8Array([1, 2, 3]),
    );

    expect(key.length).toBe(provider.kdf.masterKeyLength);
  });

  it('returns valid Uint8Array type', async () => {
    const provider = createMockProvider();
    const engine = new SodiumCryptoEngine(provider);
    const key = await engine.deriveMasterKey(
      'password',
      new Uint8Array([1, 2, 3]),
    );

    expect(key).toBeInstanceOf(Uint8Array);
  });
});
