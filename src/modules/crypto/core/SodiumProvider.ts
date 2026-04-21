import type sodium from 'libsodium-wrappers-sumo';
import { MasterKeyPayload } from '@/modules/crypto/core/MasterKeyPayload';

export type Sodium = typeof sodium;

export interface SodiumProvider {
  randomBytes: (n: number) => Uint8Array;
  pwhash: (payload: MasterKeyPayload) => Uint8Array;

  readonly constants: {
    saltLength: number;
    nonceLength: number;
  };
  readonly kdf: {
    masterKeyLength: number;
    opsLimit: number;
    memLimit: number;
    algorithm: number;
  };
}
