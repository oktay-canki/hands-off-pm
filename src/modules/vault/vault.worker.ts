// vault.worker.ts
import { createCryptoService } from '@/lib/bootstrap';
import StorageService from '@/modules/storage/StorageService';
import createVault from '@/modules/vault/createVault';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import VaultItem from '@/modules/vault/types/VaultItem';
import VaultEngine from '@/modules/vault/VaultEngine';
import { expose } from 'comlink';

class VaultWorkerApi {
  private engine: VaultEngine | null = null;

  async unlock(
    encryptedVault: EncryptedVault,
    password: string,
  ): Promise<void> {
    const { cryptoService } = await createCryptoService();
    this.engine = new VaultEngine(encryptedVault, cryptoService);
    await this.engine.unlock(password);
  }

  lock(): void {
    this.engine?.lock();
    this.engine = null;
  }

  isUnlocked(): boolean {
    return this.engine?.isUnlocked() ?? false;
  }

  getEntries(): VaultEntry[] {
    return this.engine!.getEntries();
  }

  getEntry(itemId: string): VaultEntry {
    return this.engine!.getEntry(itemId);
  }

  addItem(item: VaultItem): void {
    this.engine!.addItem(item);
  }

  updateItem(itemId: string, updates: Partial<VaultEntry>): void {
    this.engine!.updateItem(itemId, updates);
  }

  deleteEntry(itemId: string): void {
    this.engine!.deleteEntry(itemId);
  }

  encryptVault(): EncryptedVault {
    return this.engine!.encryptVault();
  }

  async registerVault(userId: string, masterPassword: string) {
    const { cryptoService } = await createCryptoService();
    const salt = cryptoService.generateSalt();
    const masterKey = await cryptoService.deriveMasterKey(masterPassword, salt);
    const vaultKey = cryptoService.deriveVaultKey(masterKey);
    const vault = createVault(userId, salt);
    const encryptedVault = cryptoService.encryptVault(vault, vaultKey);
    const storageService = new StorageService();
    await storageService.persistVault(encryptedVault);
    this.engine = new VaultEngine(encryptedVault, cryptoService);
    await this.engine.unlock(masterPassword);
  }
}

expose(new VaultWorkerApi());

export default VaultWorkerApi;
