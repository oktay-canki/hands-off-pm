import { KeyPurpose } from '@/modules/crypto/core/KeyPurpose';

export type DerivedKey = CryptoKey & {
  readonly __brand: 'derived-key';
  readonly purpose: KeyPurpose;
};
