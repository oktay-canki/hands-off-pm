import { initSodium } from '@/lib/sodium';
import { createSodiumProvider } from '@/modules/crypto/bootstrap/createSodiumProvider';
import { KEY_PURPOSE, SubKey, withKeyBrand } from '@/modules/crypto/core/Key';
import CryptoService from '@/modules/crypto/CryptoService';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { beforeEach, describe, expect, it } from 'vitest';

describe('CryptoService integration tests', () => {
  let service: CryptoService;
  let key: SubKey;

  beforeEach(async () => {
    const sodium = await initSodium();
    const provider = createSodiumProvider(sodium);
    const engine = new SodiumCryptoEngine(provider);
    service = new CryptoService(engine);
    key = withKeyBrand(sodium.randombytes_buf(32), KEY_PURPOSE.EXPORT);
  });

  it('encrypts and decrypts data correctly', () => {
    const data = { foo: 'bar', count: 1 };

    const payload = service.encrypt(data, key);
    const result = service.decrypt<typeof data>(payload, key);

    expect(result).toEqual(data);
  });
});
