// vault.worker.ts
import { createCryptoService } from '@/lib/bootstrap';
import CryptoService from '@/modules/crypto/CryptoService';
import StorageService from '@/modules/storage/StorageService';
import createVault from '@/modules/vault/createVault';
import ExportService from '@/modules/vault/ExportService';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import ExportFile from '@/modules/vault/types/ExportFile';
import { MergeResult } from '@/modules/vault/types/MergeResult';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import VaultItem from '@/modules/vault/types/VaultItem';
import VaultEngine from '@/modules/vault/VaultEngine';
import { AppError } from '@/shared/error/AppError';
import UnknownError from '@/shared/error/UnknownError';
import { expose } from 'comlink';

class VaultWorkerApi {
  private engine: VaultEngine | null = null;
  private cryptoService: CryptoService | null = null;

  async unlock(
    encryptedVault: EncryptedVault,
    password: string,
  ): Promise<void> {
    const { cryptoService } = await createCryptoService();
    this.cryptoService = cryptoService;
    const storageService = new StorageService();
    const deviceId = await storageService.getDeviceId();
    this.engine = new VaultEngine(encryptedVault, cryptoService, deviceId);
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

  deleteEntries(itemIds: string[]): void {
    for (const itemId of itemIds) {
      this.engine!.deleteEntry(itemId);
    }
  }

  encryptVault(): EncryptedVault {
    return this.engine!.encryptVault();
  }

  async registerVault(userId: string, masterPassword: string) {
    const { cryptoService } = await createCryptoService();
    this.cryptoService = cryptoService;
    const salt = cryptoService.generateSalt();
    const masterKey = await cryptoService.deriveMasterKey(masterPassword, salt);
    const vaultKey = cryptoService.deriveVaultKey(masterKey);
    const vault = createVault(userId, salt);
    const encryptedVault = cryptoService.encryptVault(vault, vaultKey);
    const storageService = new StorageService();
    const deviceId = await storageService.getDeviceId();
    await storageService.persistVault(encryptedVault);
    this.engine = new VaultEngine(encryptedVault, cryptoService, deviceId);
    await this.engine.unlock(masterPassword);
  }

  async exportVault(exportPassword: string): Promise<ExportFile> {
    const items = this.engine!.getAllItems();
    const exportService = new ExportService(this.cryptoService!);
    return exportService.createExport(items, exportPassword);
  }

  async importVault(
    file: ExportFile,
    exportPassword: string,
  ): Promise<MergeResult> {
    const exportService = new ExportService(this.cryptoService!);
    const items = await exportService.readExport(file, exportPassword);
    return this.engine!.mergeItems(items);
  }

  resolveConflicts(items: VaultItem[]): void {
    this.engine!.resolveConflicts(items);
  }
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  console.error('Unexpected worker error:', error);
  return new UnknownError();
}

function withErrorNormalization<T extends object>(target: T): T {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      if (typeof value !== 'function') return value;

      return function (this: unknown, ...args: unknown[]) {
        try {
          const result = value.apply(obj, args);
          if (result instanceof Promise) {
            return result.catch((error: unknown) => {
              throw normalizeError(error);
            });
          }
          return result;
        } catch (error) {
          throw normalizeError(error);
        }
      };
    },
  });
}

expose(withErrorNormalization(new VaultWorkerApi()));

export default VaultWorkerApi;
