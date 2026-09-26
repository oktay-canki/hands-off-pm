import { EntryKey, VaultKey } from '@/modules/crypto/core/Key';
import CryptoService from '@/modules/crypto/CryptoService';
import ItemDeletedError from '@/modules/vault/errors/ItemDeletedError';
import ItemDoesNotExistError from '@/modules/vault/errors/ItemDoesNotExistError';
import ItemExistsError from '@/modules/vault/errors/ItemExistsError';
import VaultLockedError from '@/modules/vault/errors/VaultLockedError';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import EncryptedVaultItem from '@/modules/vault/types/EncryptedVaultItem';
import { MergeResult } from '@/modules/vault/types/MergeResult';
import Vault from '@/modules/vault/types/Vault';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import VaultItem from '@/modules/vault/types/VaultItem';

class VaultEngine {
  private vault: Vault | null = null;
  private sessionKeys: {
    vaultKey: VaultKey;
    entryKey: EntryKey;
  } | null = null;

  constructor(
    private encryptedVault: EncryptedVault,
    private crypto: CryptoService,
    private deviceId: string,
  ) {}

  async unlock(password: string) {
    try {
      const masterKey = await this.crypto.deriveMasterKey(
        password,
        this.encryptedVault.salt,
      );
      const vaultKey = this.crypto.deriveVaultKey(masterKey);
      const vault = this.crypto.decryptVault(this.encryptedVault, vaultKey);

      const entryKey = this.crypto.deriveEntryKey(masterKey);

      this.vault = vault;
      this.sessionKeys = {
        vaultKey,
        entryKey,
      };
    } catch (error) {
      this.lock();
      throw error;
    }
  }

  lock() {
    this.vault = null;
    this.sessionKeys = null;
  }

  isUnlocked(): boolean {
    return this.vault !== null && this.sessionKeys !== null;
  }

  private assertUnlocked() {
    if (!this.isUnlocked()) {
      throw new VaultLockedError();
    }
  }

  getVault(): Vault {
    this.assertUnlocked();
    return this.vault!;
  }

  encryptVault(): EncryptedVault {
    this.assertUnlocked();

    return this.crypto.encryptVault(this.vault!, this.sessionKeys!.vaultKey);
  }

  setVault(encryptedVault: EncryptedVault) {
    this.assertUnlocked();

    const vault = this.crypto.decryptVault(
      encryptedVault,
      this.sessionKeys!.vaultKey,
    );

    this.vault = vault;
  }

  addItem(item: VaultItem) {
    this.assertUnlocked();

    const itemExists = this.findItemById(item.itemId);
    if (itemExists) throw new ItemExistsError();

    const stampedItem: VaultItem = {
      ...item,
      version: 1,
      deviceId: this.deviceId,
    };

    const encryptedItem = this.crypto.encryptItem(
      stampedItem,
      this.sessionKeys!.entryKey,
    );

    this.vault!.items.push(encryptedItem);
  }

  getEntries(): VaultEntry[] {
    this.assertUnlocked();

    return this.vault!.items.map((item) =>
      this.crypto.decryptItem(item, this.sessionKeys!.entryKey),
    ).filter((item) => item.type === 'entry');
  }

  getEntry(itemId: string): VaultEntry {
    this.assertUnlocked();

    const encryptedEntry = this.findItemById(itemId);
    if (!encryptedEntry) throw new ItemDoesNotExistError();

    const entry = this.crypto.decryptItem(
      encryptedEntry,
      this.sessionKeys!.entryKey,
    );

    if (entry.type === 'tombstone') throw new ItemDeletedError();

    return entry;
  }

  getAllItems(): VaultItem[] {
    this.assertUnlocked();
    return this.vault!.items.map((item) =>
      this.crypto.decryptItem(item, this.sessionKeys!.entryKey),
    );
  }

  updateItem(itemId: string, updates: Partial<VaultEntry>) {
    this.assertUnlocked();

    const index = this.vault!.items.findIndex((i) => i.itemId === itemId);
    if (index === -1) throw new ItemDoesNotExistError();
    const encryptedItem = this.vault!.items[index];

    const item = this.crypto.decryptItem(
      encryptedItem!,
      this.sessionKeys!.entryKey,
    );

    if (item.type === 'tombstone') {
      throw new ItemDeletedError();
    }

    const now = Date.now();

    const updatedEntry: VaultEntry = {
      ...item,
      ...updates,
      itemId: item.itemId,
      type: 'entry',
      createdAt: item.createdAt,
      updatedAt: now,
      version: item.version + 1,
      deviceId: this.deviceId,
    };

    const updatedEncryptedEntry = this.crypto.encryptItem(
      updatedEntry,
      this.sessionKeys!.entryKey,
    );

    this.vault!.items[index] = updatedEncryptedEntry;
  }

  deleteEntry(itemId: string) {
    this.assertUnlocked();

    const encryptedItem = this.findItemById(itemId);
    if (!encryptedItem) throw new ItemDoesNotExistError();

    const item = this.crypto.decryptItem(
      encryptedItem,
      this.sessionKeys!.entryKey,
    );
    if (item.type === 'tombstone') throw new ItemDeletedError();

    const now = Date.now();
    const tombstone = this.crypto.encryptItem(
      {
        itemId: encryptedItem.itemId,
        type: 'tombstone',
        deletedAt: now,
        version: item.version + 1,
        deviceId: this.deviceId,
      },
      this.sessionKeys!.entryKey,
    );

    this.vault!.items = this.vault!.items.filter((e) => e.itemId !== itemId);
    this.vault!.items.push(tombstone);
  }

  private findItemById(itemId: string): EncryptedVaultItem | undefined {
    return this.vault!.items.find((e) => {
      return e.itemId === itemId;
    });
  }

  mergeItems(importedItems: VaultItem[]): MergeResult {
    this.assertUnlocked();

    const result: MergeResult = {
      entries: { added: 0, updated: 0, skipped: 0 },
      tombstones: { added: 0, updated: 0, skipped: 0 },
      conflicts: [],
    };

    for (const incoming of importedItems) {
      const bucket =
        incoming.type === 'entry' ? result.entries : result.tombstones;

      const index = this.vault!.items.findIndex(
        (e) => e.itemId === incoming.itemId,
      );

      if (index === -1) {
        const encrypted = this.crypto.encryptItem(
          incoming,
          this.sessionKeys!.entryKey,
        );

        this.vault!.items.push(encrypted);
        bucket.added++;
        continue;
      }

      const local = this.crypto.decryptItem(
        this.vault!.items[index]!,
        this.sessionKeys!.entryKey,
      );

      // Different devices → never automatically choose a version.
      if (incoming.deviceId !== local.deviceId) {
        result.conflicts.push({ local, incoming });
        continue;
      }

      // Same device → version determines whether anything changed.
      if (incoming.version > local.version) {
        const encrypted = this.crypto.encryptItem(
          incoming,
          this.sessionKeys!.entryKey,
        );

        this.vault!.items[index] = encrypted;
        bucket.updated++;
      } else {
        bucket.skipped++;
      }
    }

    return result;
  }

  private acceptIncomingItem(item: VaultItem) {
    this.assertUnlocked();

    const index = this.vault!.items.findIndex((e) => e.itemId === item.itemId);
    if (index === -1) throw new ItemDoesNotExistError();

    const encrypted = this.crypto.encryptItem(item, this.sessionKeys!.entryKey);
    this.vault!.items[index] = encrypted;
  }

  resolveConflicts(items: VaultItem[]) {
    this.assertUnlocked();
    for (const item of items) {
      this.acceptIncomingItem(item);
    }
  }
}

export default VaultEngine;
