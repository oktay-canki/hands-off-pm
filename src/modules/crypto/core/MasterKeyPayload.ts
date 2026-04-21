export type MasterKeyPayload = {
  readonly outputSize: number;
  readonly password: string;
  readonly salt: Uint8Array;
  readonly opsLimit: number;
  readonly memLimit: number;
  readonly algorithm: number;
};
