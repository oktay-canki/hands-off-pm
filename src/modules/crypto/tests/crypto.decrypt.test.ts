import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockProvider } from '@/modules/crypto/tests/test-utils/createMockProvider';
import { SodiumCryptoEngine } from '@/modules/crypto/SodiumCryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import { KEY_PURPOSE, VaultKey, withKeyBrand } from '@/modules/crypto/core/Key';

describe('SodiumCryptoEngine.decrypt tests', () => {
  let key: VaultKey;

  beforeEach(() => {
    key = withKeyBrand(new Uint8Array(32), KEY_PURPOSE.VAULT);
  });

  it('calls provider.decrypt with correct arguments', () => {
    const provider = createMockProvider();
    provider.decrypt = vi.fn().mockReturnValue(new Uint8Array(16));
    const engine = new SodiumCryptoEngine(provider);

    const payload = {
      ciphertext: new Uint8Array([1, 2, 3]),
      nonce: new Uint8Array(new Uint8Array(24)),
      version: 1,
    } as EncryptedPayload;

    engine.decrypt(payload, key);

    expect(provider.decrypt).toHaveBeenCalledWith(
      payload.ciphertext,
      key,
      payload.nonce,
    );
  });
});
