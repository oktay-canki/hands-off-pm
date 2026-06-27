import type { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';
import { MasterKeyPayload } from '@/modules/crypto/core/MasterKeyPayload';
import { SubKeyPayload } from '@/modules/crypto/core/SubKeyPayload';

const DEFAULT_CONSTANTS = {
  saltLength: 16,
  nonceLength: 24,
} as const;

const DEFAULT_KDF = {
  masterKeyLength: 32,
  subKeyLength: 32,
  opsLimit: 2,
  memLimit: 67108864,
  algorithm: 2,
};

type SodiumConstants = SodiumProvider['constants'];
type SodiumProviderMockOverrides = Partial<
  Omit<SodiumProvider, 'constants'>
> & {
  constants?: Partial<SodiumConstants>;
};

export function createMockProvider(
  overrides?: SodiumProviderMockOverrides,
): SodiumProvider {
  const base: SodiumProvider = {
    randomBytes: (n: number) => new Uint8Array(n),
    pwhash: (payload: MasterKeyPayload) => new Uint8Array(payload.outputSize),
    deriveFromKey: (payload: SubKeyPayload) => new Uint8Array(payload.length),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    encrypt: (plaintext, key, nonce, aad) => new Uint8Array([1, 1, 1, 1]),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decrypt: (ciphertext, key, nonce, aad) => new Uint8Array([9, 9, 9]),
    constants: DEFAULT_CONSTANTS,
    kdf: DEFAULT_KDF,
  };

  return {
    ...base,
    ...overrides,
    constants: {
      ...base.constants,
      ...overrides?.constants,
    },
  };
}
