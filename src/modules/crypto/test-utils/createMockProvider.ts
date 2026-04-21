import type { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';
import { MasterKeyPayload } from '@/modules/crypto/core/MasterKeyPayload';

const DEFAULT_CONSTANTS = {
  saltLength: 16,
  nonceLength: 24,
} as const;

const DEFAULT_KDF = {
  masterKeyLength: 32,
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
