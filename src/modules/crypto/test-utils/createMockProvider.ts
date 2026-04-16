import type { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';

const DEFAULT_CONSTANTS = {
  saltLength: 16,
  nonceLength: 24,
} as const;

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
    constants: DEFAULT_CONSTANTS,
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
