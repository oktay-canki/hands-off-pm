import type { SodiumProvider } from '@/modules/crypto/core/SodiumProvider';

export function createMockProvider(
  overrides?: Partial<SodiumProvider>,
): SodiumProvider {
  return {
    randomBytes: (n: number) => new Uint8Array(n),
    constants: { saltLength: 16 },
    ...overrides,
  };
}
