import { describe, it, expect, vi } from 'vitest';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { createMockProvider } from '@/modules/crypto/tests/test-utils/createMockProvider';

describe('SodiumCryptoEngine.generateNonce', () => {
  it('should return Uint8Array', () => {
    const engine = new SodiumCryptoEngine(createMockProvider());

    const nonce = engine.generateNonce();

    expect(nonce).toBeInstanceOf(Uint8Array);
  });

  it('should return nonce with correct length', () => {
    const engine = new SodiumCryptoEngine(
      createMockProvider({ constants: { nonceLength: 24 } }),
    );

    const nonce = engine.generateNonce();

    expect(nonce.length).toBe(24);
  });

  it('should call randomBytes with nonceLength', () => {
    const randomBytes = vi.fn((n: number) => new Uint8Array(n));

    const engine = new SodiumCryptoEngine(
      createMockProvider({
        randomBytes,
        constants: { nonceLength: 32 },
      }),
    );

    engine.generateNonce();

    expect(randomBytes).toHaveBeenCalledWith(32);
  });
});
