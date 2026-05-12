import { beforeEach, describe, expect, it } from 'vitest';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';

describe('SodiumCryptoEngine.generateNonce(integration)', () => {
  let engine: SodiumCryptoEngine;
  let cryptoConfig: CryptoConfig;

  beforeEach(async () => {
    const sodium = await initSodium();
    const provider = createSodiumProvider(sodium);
    engine = new SodiumCryptoEngine(provider);
    cryptoConfig = getCurrentCryptoConfig();
  });

  it('returns a Uint8Array', () => {
    const nonce = engine.generateNonce();

    expect(nonce).toBeInstanceOf(Uint8Array);
  });

  it('returns nonce with correct length (from real config)', () => {
    const nonce = engine.generateNonce();

    expect(nonce.length).toBe(cryptoConfig.constants.nonceLength);
  });

  it('generates different values on multiple calls', () => {
    const nonce1 = engine.generateNonce();
    const nonce2 = engine.generateNonce();

    expect(nonce1).not.toEqual(nonce2);
  });
});
