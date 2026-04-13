export const KEY_PURPOSE = {
  MASTER: 'master',
  ENTRY: 'entry',
  VAULT: 'vault',
  EXPORT: 'export',
  SYNC: 'sync',
} as const;

export type KeyPurpose = (typeof KEY_PURPOSE)[keyof typeof KEY_PURPOSE];
