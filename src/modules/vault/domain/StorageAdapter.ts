import { EncryptedVaultBlob } from '@/modules/vault/domain/EncryptedVaultBlob';

export interface StorageAdapter {
  loadVault(): Promise<EncryptedVaultBlob | null>;
  saveVault(blob: EncryptedVaultBlob): Promise<void>;
}
