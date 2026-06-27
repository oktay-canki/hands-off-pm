export class VaultId {
  static create(): string {
    return `vault-${crypto.randomUUID()}`;
  }
}
