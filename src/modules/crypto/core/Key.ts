export const KEY_PURPOSE = {
  MASTER: 'master-key',
  ENTRY: 'entry',
  VAULT: 'vault',
  EXPORT: 'export',
  SYNC: 'sync',
} as const;

export type KeyPurpose = (typeof KEY_PURPOSE)[keyof typeof KEY_PURPOSE];

export type SubKeyPurpose = Exclude<KeyPurpose, typeof KEY_PURPOSE.MASTER>;

export const KDF_CONTEXTS: Record<SubKeyPurpose, string> = {
  entry: 'ENTRY___',
  vault: 'VAULT___',
  export: 'EXPORT__',
  sync: 'SYNC____',
};

export type KeyBrand<T extends KeyPurpose> = Uint8Array & {
  readonly __keyBrand: T;
};

export function withKeyBrand<T extends KeyPurpose>(
  bytes: Uint8Array,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _purpose: T,
): KeyBrand<T> {
  return bytes as KeyBrand<T>;
}

export type SubKey = KeyBrand<SubKeyPurpose>;

export type MasterKey = KeyBrand<typeof KEY_PURPOSE.MASTER>;
export type EntryKey = KeyBrand<typeof KEY_PURPOSE.ENTRY>;
export type VaultKey = KeyBrand<typeof KEY_PURPOSE.VAULT>;
export type ExportKey = KeyBrand<typeof KEY_PURPOSE.EXPORT>;
