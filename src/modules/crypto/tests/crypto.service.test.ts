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
});
