import Vault from '@/modules/vault/types/Vault';
import { VaultId } from '@/modules/vault/value-objects/VaultId';

function createVault(userId: string, salt: Uint8Array): Vault {
  return {
    userId,
    vaultId: VaultId.create(),
    salt,
    items: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export default createVault;
