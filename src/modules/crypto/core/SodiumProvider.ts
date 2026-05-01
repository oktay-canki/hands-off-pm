import type sodium from 'libsodium-wrappers-sumo';
import { MasterKeyPayload } from '@/modules/crypto/core/MasterKeyPayload';
import { SubKeyPayload } from '@/modules/crypto/core/SubKeyPayload';

export type Sodium = typeof sodium;

export interface SodiumProvider {
  randomBytes: (n: number) => Uint8Array;
  pwhash: (payload: MasterKeyPayload) => Uint8Array;
  deriveFromKey: (payload: SubKeyPayload) => Uint8Array;

  readonly constants: {
    saltLength: number;
    nonceLength: number;
  };
  readonly kdf: {
    masterKeyLength: number;
    subKeyLength: number;
    opsLimit: number;
    memLimit: number;
    algorithm: number;
  };
}
