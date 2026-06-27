import { beforeEach, describe, expect, it } from 'vitest';
import { KEY_PURPOSE } from '@/modules/crypto/core/Key';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';

describe('SodiumCryptoEngine.deriveSubKey(integration)', () => {
  let engine: SodiumCryptoEngine;
  let cryptoConfig: CryptoConfig;
  let fixedSalt: Uint8Array;

  beforeEach(async () => {
    const sodium = await initSodium();
    const provider = createSodiumProvider(sodium);
    engine = new SodiumCryptoEngine(provider);
    cryptoConfig = getCurrentCryptoConfig();
    fixedSalt = engine.generateSalt();
  });

  it('returns correct key length', async () => {
    const masterKey = await engine.deriveMasterKey('password', fixedSalt);
    const key = engine.deriveSubKey(masterKey, 'vault');

    expect(key.length).toBe(cryptoConfig.kdf.subKeyLength);
  });

  it('derives the same subkey for same inputs', async () => {
    const masterKey = await engine.deriveMasterKey('password', fixedSalt);
    const k1 = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT);
    const k2 = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT);

    expect(k1).toEqual(k2);
  });

  it('produces different keys for different purposes', async () => {
    const masterKey = await engine.deriveMasterKey('password', fixedSalt);
    const vaultKey = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT);
    const entryKey = engine.deriveSubKey(masterKey, KEY_PURPOSE.ENTRY);

    expect(vaultKey).not.toEqual(entryKey);
  });

  /* Not needed after change in SubKeyId / SubKey context handling */
  /*
  it('produces different keys for different subKeyIds', async () => {
    const masterKey = await engine.deriveMasterKey('password', fixedSalt);
    const k1 = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);
    const k2 = engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 2);

    expect(k1).not.toEqual(k2);
  });
  */
});
