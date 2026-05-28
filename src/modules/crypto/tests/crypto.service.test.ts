import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { KEY_PURPOSE, SubKey, withKeyBrand } from '@/modules/crypto/core/Key';
import CryptoService from '@/modules/crypto/CryptoService';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CryptoService unit tests', () => {
  let key: SubKey;

  beforeEach(() => {
    key = withKeyBrand(new Uint8Array(32), KEY_PURPOSE.EXPORT);
  });

  it('serializes data before encryption', () => {
    const encryptMock = vi.fn().mockReturnValue({} as EncryptedPayload);

    const engine = {
      encrypt: encryptMock,
      decrypt: vi.fn(),
    } as unknown as CryptoEngine;
    const service = new CryptoService(engine);

    const data = { foo: 'bar' };

    service.encrypt(data, key);

    expect(encryptMock).toHaveBeenCalledTimes(1);

    const passed = encryptMock.mock.calls[0]![0];

    expect(passed.constructor.name).toBe('Uint8Array');
  });

  it('deserializes decrypted bytes into object', () => {
    const obj = { hello: 'world' };
    const bytes = new TextEncoder().encode(JSON.stringify(obj));

    const engine = {
      encrypt: vi.fn(),
      decrypt: vi.fn().mockReturnValue(bytes),
    } as unknown as CryptoEngine;

    const service = new CryptoService(engine);

    const result = service.decrypt<typeof obj>({} as EncryptedPayload, key);

    expect(result).toEqual(obj);
  });

  it('throws if decrypted plaintext is invalid JSON', () => {
    const invalidBytes = new Uint8Array([1, 2, 3]); // not valid JSON

    const engine = {
      encrypt: vi.fn(),
      decrypt: vi.fn().mockReturnValue(invalidBytes),
    } as unknown as CryptoEngine;

    const service = new CryptoService(engine);

    expect(() => service.decrypt({} as EncryptedPayload, key)).toThrow();
  });
});
