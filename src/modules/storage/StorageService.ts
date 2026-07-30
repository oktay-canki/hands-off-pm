import { openDB, DBSchema, IDBPDatabase } from 'idb';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import VaultNotFoundError from '@/modules/vault/errors/VaultNotFoundError';

interface ZKPMSchema extends DBSchema {
  vaults: {
    key: string; // userId
    value: EncryptedVault;
  };
}

const DB_NAME = 'zkpm';
const DB_VERSION = 1;

class StorageService {
  private db: IDBPDatabase<ZKPMSchema> | null = null;

  private async getDb(): Promise<IDBPDatabase<ZKPMSchema>> {
    if (this.db) return this.db;

    // Request persistent storage
    if (navigator.storage?.persist) {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        await navigator.storage.persist();
      }
    }

    this.db = await openDB<ZKPMSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('vaults', { keyPath: 'userId' });
      },
    });

    return this.db;
  }

  async loadVault(userId: string): Promise<EncryptedVault> {
    const db = await this.getDb();
    const vault = await db.get('vaults', userId);
    if (!vault) throw new VaultNotFoundError();
    return vault;
  }

  async persistVault(encryptedVault: EncryptedVault): Promise<void> {
    const db = await this.getDb();
    await db.put('vaults', encryptedVault);
  }
}

export default StorageService;
