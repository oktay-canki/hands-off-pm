import { beforeEach, describe, expect, it } from 'vitest';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';

describe('SodiumCryptoEngine.generateSalt(integration)', () => {
  let engine: SodiumCryptoEngine;
  let cryptoConfig: CryptoConfig;

  beforeEach(async () => {
    const sodium = await initSodium();
    const provider = createSodiumProvider(sodium);
    engine = new SodiumCryptoEngine(provider);
    cryptoConfig = getCurrentCryptoConfig();
  });

  it('returns a Uint8Array', () => {
    const salt = engine.generateSalt();

    expect(salt).toBeInstanceOf(Uint8Array);
  });

  it('returns salt with correct length (from real config)', () => {
    const salt = engine.generateSalt();

    expect(salt.length).toBe(cryptoConfig.constants.saltLength);
  });

  it('generates different values on multiple calls', () => {
    const salt1 = engine.generateSalt();
    const salt2 = engine.generateSalt();

    expect(salt1).not.toEqual(salt2);
  });
});
