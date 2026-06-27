import EncryptedVault from '@/modules/vault/types/EncryptedVault';

class StorageService {
  async loadVault(userId: string): Promise<EncryptedVault> {
    return {} as EncryptedVault;
  }

  async persistVault(encryptedVault: EncryptedVault) {}
}

export default StorageService;
