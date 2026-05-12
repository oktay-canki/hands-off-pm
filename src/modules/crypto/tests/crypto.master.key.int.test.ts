import { beforeEach, describe, expect, it } from 'vitest';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';

describe('SodiumCryptoEngine.deriveMasterKey(integration)', () => {
  let engine: CryptoEngine;
  let cryptoConfig: CryptoConfig;

  beforeEach(async () => {
    const sodium = await initSodium();
    const provider = createSodiumProvider(sodium);
    engine = new SodiumCryptoEngine(provider);
    cryptoConfig = getCurrentCryptoConfig();
  });

  it('returns correct key length', async () => {
    const key = await engine.deriveMasterKey(
      'password',
      new Uint8Array(16).fill(1),
    );

    expect(key.length).toBe(cryptoConfig.kdf.masterKeyLength);
  });

  it('derives the same key for same password and salt', async () => {
    const password = 'secure-password';
    const salt = new Uint8Array(16).fill(1);

    const k1 = await engine.deriveMasterKey(password, salt);
    const k2 = await engine.deriveMasterKey(password, salt);

    expect(k1).toEqual(k2);
  });

  it('produces different keys for different salts', async () => {
    const password = 'secure-password';

    const k1 = await engine.deriveMasterKey(
      password,
      new Uint8Array(16).fill(1),
    );
    const k2 = await engine.deriveMasterKey(
      password,
      new Uint8Array(16).fill(2),
    );

    expect(k1).not.toEqual(k2);
  });

  it('produces different keys for different passwords', async () => {
    const salt = new Uint8Array(16).fill(1);

    const k1 = await engine.deriveMasterKey('password1', salt);
    const k2 = await engine.deriveMasterKey('password2', salt);

    expect(k1).not.toEqual(k2);
  });
});
