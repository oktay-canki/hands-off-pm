import { createServices } from '@/lib/bootstrap';
import { beforeEach, describe, expect, it } from 'vitest';
import { CRYPTO_CONFIG } from '@/modules/crypto/config/crypto.config';

describe('SodiumCryptoEngine.generateSalt(integration)', () => {
  let crypto: Awaited<ReturnType<typeof createServices>>['crypto'];

  beforeEach(async () => {
    ({ crypto } = await createServices());
  });

  it('returns a Uint8Array', () => {
    const salt = crypto.generateSalt();

    expect(salt).toBeInstanceOf(Uint8Array);
  });

  it('returns salt with correct length (from real config)', () => {
    const salt = crypto.generateSalt();

    expect(salt.length).toBe(CRYPTO_CONFIG.constants.saltLength);
  });

  it('generates different values on multiple calls', () => {
    const salt1 = crypto.generateSalt();
    const salt2 = crypto.generateSalt();

    expect(salt1).not.toEqual(salt2);
  });
});
