import { createServices } from '@/lib/bootstrap';
import { beforeEach, describe, expect, it } from 'vitest';
import { KEY_PURPOSE } from '@/modules/crypto/core/Key';
import {
  CryptoConfig,
  getCurrentCryptoConfig,
} from '@/modules/crypto/crypto.config';

describe('SodiumCryptoEngine.deriveSubKey(integration)', () => {
  let crypto: Awaited<ReturnType<typeof createServices>>['crypto'];
  let cryptoConfig: CryptoConfig;
  let fixedSalt: Uint8Array;

  beforeEach(async () => {
    ({ crypto } = await createServices());
    cryptoConfig = getCurrentCryptoConfig();
    fixedSalt = crypto.generateSalt();
  });

  it('returns correct key length', async () => {
    const masterKey = await crypto.deriveMasterKey('password', fixedSalt);
    const key = crypto.deriveSubKey(masterKey, 'vault', 1);

    expect(key.length).toBe(cryptoConfig.kdf.subKeyLength);
  });

  it('derives the same subkey for same inputs', async () => {
    const masterKey = await crypto.deriveMasterKey('password', fixedSalt);
    const k1 = crypto.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);
    const k2 = crypto.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);

    expect(k1).toEqual(k2);
  });

  it('produces different keys for different purposes', async () => {
    const masterKey = await crypto.deriveMasterKey('password', fixedSalt);
    const vaultKey = crypto.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);
    const entryKey = crypto.deriveSubKey(masterKey, KEY_PURPOSE.ENTRY, 1);

    expect(vaultKey).not.toEqual(entryKey);
  });

  it('produces different keys for different subKeyIds', async () => {
    const masterKey = await crypto.deriveMasterKey('password', fixedSalt);
    const k1 = crypto.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 1);
    const k2 = crypto.deriveSubKey(masterKey, KEY_PURPOSE.VAULT, 2);

    expect(k1).not.toEqual(k2);
  });
});
