import type sodium from 'libsodium-wrappers';

export type Sodium = typeof sodium;

export interface SodiumProvider {
  randomBytes: (n: number) => Uint8Array;
  constants: {
    readonly saltLength: number;
  };
}
