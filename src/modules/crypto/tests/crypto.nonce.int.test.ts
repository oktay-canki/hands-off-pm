import { createServices } from '@/lib/bootstrap';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';

describe('SodiumCryptoEngine.generateNonce(integration)', () => {
  let crypto: Awaited<ReturnType<typeof createServices>>['crypto'];
  let cryptoConfig: CryptoConfig;

  beforeEach(async () => {
    ({ crypto } = await createServices());
    cryptoConfig = getCurrentCryptoConfig();
  });

  it('returns a Uint8Array', () => {
    const nonce = crypto.generateNonce();

    expect(nonce).toBeInstanceOf(Uint8Array);
  });

  it('returns nonce with correct length (from real config)', () => {
    const nonce = crypto.generateNonce();

    expect(nonce.length).toBe(cryptoConfig.constants.nonceLength);
  });

  it('generates different values on multiple calls', () => {
    const nonce1 = crypto.generateNonce();
    const nonce2 = crypto.generateNonce();

    expect(nonce1).not.toEqual(nonce2);
  });
});
