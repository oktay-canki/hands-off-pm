export const KEY_PURPOSE = {
  MASTER: 'master-key',
} as const;

export type KeyPurpose = (typeof KEY_PURPOSE)[keyof typeof KEY_PURPOSE];

type KeyBrand<T extends KeyPurpose> = Uint8Array & {
  readonly __keyBrand: T;
};

export function withKeyBrand<T extends KeyPurpose>(
  bytes: Uint8Array,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _purpose: T,
): KeyBrand<T> {
  return bytes as KeyBrand<T>;
}

export type MasterKey = KeyBrand<typeof KEY_PURPOSE.MASTER>;
