import { createServices } from '@/lib/bootstrap';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';

describe('SodiumCryptoEngine.generateSalt(integration)', () => {
  let crypto: Awaited<ReturnType<typeof createServices>>['crypto'];
  let cryptoConfig: CryptoConfig;

  beforeEach(async () => {
    ({ crypto } = await createServices());
    cryptoConfig = getCurrentCryptoConfig();
  });

  it('returns a Uint8Array', () => {
    const salt = crypto.generateSalt();

    expect(salt).toBeInstanceOf(Uint8Array);
  });

  it('returns salt with correct length (from real config)', () => {
    const salt = crypto.generateSalt();

    expect(salt.length).toBe(cryptoConfig.constants.saltLength);
  });

  it('generates different values on multiple calls', () => {
    const salt1 = crypto.generateSalt();
    const salt2 = crypto.generateSalt();

    expect(salt1).not.toEqual(salt2);
  });
});
