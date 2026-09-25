import { openDB, DBSchema, IDBPDatabase } from 'idb';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import VaultNotFoundError from '@/modules/vault/errors/VaultNotFoundError';

interface ZKPMSchema extends DBSchema {
  vaults: {
    key: string; // userId
    value: EncryptedVault;
  };
  device: {
    key: string;
    value: string;
  };
}

const DB_NAME = 'zkpm';
const DB_VERSION = 2;
const DEVICE_ID_KEY = 'deviceId';

class StorageService {
  private db: IDBPDatabase<ZKPMSchema> | null = null;
  private deviceId: string | null = null;

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
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('vaults', { keyPath: 'userId' });
        }
        if (oldVersion < 2) {
          db.createObjectStore('device');
        }
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

  async getDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    const db = await this.getDb();
    const existing = await db.get('device', DEVICE_ID_KEY);
    if (existing) {
      this.deviceId = existing;
      return existing;
    }

    const id = crypto.randomUUID();
    await db.put('device', id, DEVICE_ID_KEY);
    this.deviceId = id;
    return id;
  }
}

export default StorageService;
