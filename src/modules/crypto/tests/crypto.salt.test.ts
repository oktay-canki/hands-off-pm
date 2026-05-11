import { describe, it, expect, vi } from 'vitest';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { createMockProvider } from '@/modules/crypto/tests/test-utils/createMockProvider';

describe('SodiumCryptoEngine.generateSalt', () => {
  it('should return Uint8Array', () => {
    const engine = new SodiumCryptoEngine(createMockProvider());

    const salt = engine.generateSalt();

    expect(salt).toBeInstanceOf(Uint8Array);
  });

  it('should return salt with correct length', () => {
    const engine = new SodiumCryptoEngine(
      createMockProvider({ constants: { saltLength: 24 } }),
    );

    const salt = engine.generateSalt();

    expect(salt.length).toBe(24);
  });

  it('should call randomBytes with saltLength', () => {
    const randomBytes = vi.fn((n: number) => new Uint8Array(n));

    const engine = new SodiumCryptoEngine(
      createMockProvider({
        randomBytes,
        constants: { saltLength: 32 },
      }),
    );

    engine.generateSalt();

    expect(randomBytes).toHaveBeenCalledWith(32);
  });
});
