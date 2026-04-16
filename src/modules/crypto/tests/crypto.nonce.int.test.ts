import { createServices } from '@/lib/bootstrap';
import { beforeEach, describe, expect, it } from 'vitest';
import { CRYPTO_CONFIG } from '@/modules/crypto/config/crypto.config';

describe('SodiumCryptoEngine.generateNonce(integration)', () => {
  let crypto: Awaited<ReturnType<typeof createServices>>['crypto'];

  beforeEach(async () => {
    ({ crypto } = await createServices());
  });

  it('returns a Uint8Array', () => {
    const nonce = crypto.generateNonce();

    expect(nonce).toBeInstanceOf(Uint8Array);
  });

  it('returns nonce with correct length (from real config)', () => {
    const nonce = crypto.generateNonce();

    expect(nonce.length).toBe(CRYPTO_CONFIG.constants.nonceLength);
  });

  it('generates different values on multiple calls', () => {
    const nonce1 = crypto.generateNonce();
    const nonce2 = crypto.generateNonce();

    expect(nonce1).not.toEqual(nonce2);
  });
});
