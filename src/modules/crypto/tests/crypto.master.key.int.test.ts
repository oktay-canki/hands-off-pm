import { createServices } from '@/lib/bootstrap';
import { beforeEach, describe, expect, it } from 'vitest';
import { CRYPTO_CONFIG } from '../config/crypto.config';

describe('SodiumCryptoEngine.deriveMasterKey(integration)', () => {
  let crypto: Awaited<ReturnType<typeof createServices>>['crypto'];

  beforeEach(async () => {
    ({ crypto } = await createServices());
  });

  it('returns correct key length', async () => {
    const key = await crypto.deriveMasterKey(
      'password',
      new Uint8Array(16).fill(1),
    );

    expect(key.length).toBe(CRYPTO_CONFIG.kdf.masterKeyLength);
  });

  it('derives the same key for same password and salt', async () => {
    const password = 'secure-password';
    const salt = new Uint8Array(16).fill(1);

    const k1 = await crypto.deriveMasterKey(password, salt);
    const k2 = await crypto.deriveMasterKey(password, salt);

    expect(k1).toEqual(k2);
  });

  it('produces different keys for different salts', async () => {
    const password = 'secure-password';

    const k1 = await crypto.deriveMasterKey(
      password,
      new Uint8Array(16).fill(1),
    );
    const k2 = await crypto.deriveMasterKey(
      password,
      new Uint8Array(16).fill(2),
    );

    expect(k1).not.toEqual(k2);
  });

  it('produces different keys for different passwords', async () => {
    const salt = new Uint8Array(16).fill(1);

    const k1 = await crypto.deriveMasterKey('password1', salt);
    const k2 = await crypto.deriveMasterKey('password2', salt);

    expect(k1).not.toEqual(k2);
  });
});
