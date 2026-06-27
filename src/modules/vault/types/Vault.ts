import EncryptedVaultItem from '@/modules/vault/types/EncryptedVaultItem';

type Vault = {
  userId: string;
  vaultId: string;
  salt: Uint8Array;
  items: EncryptedVaultItem[];
  createdAt: number;
  updatedAt: number;
};

export default Vault;
