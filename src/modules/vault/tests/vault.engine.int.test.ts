import { createCryptoService } from '@/lib/bootstrap';
import createVault from '@/modules/vault/createVault';
import VaultEntry from '@/modules/vault/types/VaultEntry';
import { ItemId } from '@/modules/vault/value-objects/ItemId';
import VaultEngine from '@/modules/vault/VaultEngine';
import { beforeEach, describe, expect, it } from 'vitest';

const username = 'test_user';
const password = 'test1234';
const { cryptoService } = await createCryptoService();
const salt = cryptoService.generateSalt();
const masterKey = await cryptoService.deriveMasterKey(password, salt);
const vaultKey = cryptoService.deriveVaultKey(masterKey);
const entryKey = cryptoService.deriveEntryKey(masterKey);
const vault = createVault(username, salt);
const encryptedVault = cryptoService.encryptVault(vault, vaultKey);

describe('Unlock vault tests', () => {
  let vaultEngine: VaultEngine;

  beforeEach(() => {
    vaultEngine = new VaultEngine(encryptedVault, cryptoService, 'a');
  });

  it('successfully unlocks vault', async () => {
    await vaultEngine.unlock(password);

    expect(vaultEngine.isUnlocked()).toBe(true);
  });

  it('fails to unlock with invalid password', async () => {
    await expect(vaultEngine.unlock('wrong-password')).rejects.toThrow();
  });

  it('locks vault after failed unlock', async () => {
    await expect(vaultEngine.unlock('bad')).rejects.toThrow();

    expect(vaultEngine.isUnlocked()).toBe(false);
  });
});

describe('Add item tests', () => {
  let vaultEngine: VaultEngine;

  beforeEach(async () => {
    vaultEngine = new VaultEngine(encryptedVault, cryptoService, 'a');
    await vaultEngine.unlock(password);
  });

  it('successfully adds item to vault', () => {
    const item: VaultEntry = {
      itemId: ItemId.create(),
      type: 'entry',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: 'Test',
      username: 'user',
      password: 'pass',
      deviceId: 'a',
      version: 1,
    };

    vaultEngine.addItem(item);

    const entries = vaultEngine.getEntries();

    expect(entries.length).toBe(1);
    expect(entries[0]!.itemId).toEqual(item.itemId);
  });

  it('throws error when adding duplicate item', () => {
    const item: VaultEntry = {
      itemId: ItemId.create(),
      type: 'entry',
      title: 'test',
      password: 'pass',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deviceId: 'a',
      version: 1,
    };

    vaultEngine.addItem(item);

    expect(() => {
      vaultEngine.addItem(item);
    }).toThrow();

    const entries = vaultEngine.getEntries();
    expect(entries.length).toBe(1);
    expect(entries[0]!.itemId).toEqual(item.itemId);
  });
});

describe('Update item tests', () => {
  let vaultEngine: VaultEngine;

  beforeEach(async () => {
    vaultEngine = new VaultEngine(encryptedVault, cryptoService, 'a');
    await vaultEngine.unlock(password);
  });

  it('successfully updates an existing item', () => {
    const newTitle = 'new title',
      username = 'user';

    const item: VaultEntry = {
      itemId: ItemId.create(),
      type: 'entry',
      title: 'old title',
      username: username,
      password: 'pass',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as VaultEntry;

    vaultEngine.addItem(item);

    vaultEngine.updateItem(item.itemId, {
      title: newTitle,
    });

    const result = vaultEngine.getEntry(item.itemId);

    expect(result.title).toBe(newTitle);
    expect(result.username).toBe(username);
    expect(result.itemId).toEqual(item.itemId);
    expect(result.type).toBe('entry');
  });

  it('throws error when item is missing', () => {
    const nonExistingId = ItemId.create();

    expect(() => {
      vaultEngine.updateItem(nonExistingId, {
        title: 'New title',
      });
    }).toThrow();

    expect(vaultEngine.getEntries().length).toBe(0);
  });

  it('throws error when updating tombstone item', () => {
    const item: VaultEntry = {
      itemId: ItemId.create(),
      type: 'entry',
      title: 'Initial',
      username: 'user',
      password: 'pass',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as VaultEntry;

    vaultEngine.addItem(item);
    vaultEngine.deleteEntry(item.itemId);

    expect(() => {
      vaultEngine.updateItem(item.itemId, {
        title: 'Should not work',
      });
    }).toThrow();
  });
});

describe('Delete item tests', () => {
  let vaultEngine: VaultEngine;

  beforeEach(async () => {
    vaultEngine = new VaultEngine(encryptedVault, cryptoService, 'a');
    await vaultEngine.unlock(password);
  });

  it('successfully deletes an existing entry and creates tombstone', () => {
    const item: VaultEntry = {
      itemId: ItemId.create(),
      type: 'entry',
      title: 'To be deleted',
      username: 'user',
      password: 'pass',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as VaultEntry;

    vaultEngine.addItem(item);
    vaultEngine.deleteEntry(item.itemId);

    const entries = vaultEngine.getEntries();
    expect(entries.length).toBe(0);

    const vault = vaultEngine.getVault();
    expect(vault.items.length).toBe(1);
    const stored = vault.items[0]!;

    const decrypted = cryptoService.decryptItem(stored, entryKey);

    expect(decrypted.type).toBe('tombstone');
  });

  it('throws error when trying to delete a tombstone', () => {
    const item: VaultEntry = {
      itemId: ItemId.create(),
      type: 'entry',
      title: 'Item',
      username: 'user',
      password: 'pass',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as VaultEntry;

    vaultEngine.addItem(item);

    // first delete → becomes tombstone
    vaultEngine.deleteEntry(item.itemId);

    // second delete → should fail
    expect(() => {
      vaultEngine.deleteEntry(item.itemId);
    }).toThrow();

    const vault = vaultEngine.getVault();

    expect(vault.items.length).toBe(1);
  });

  it('throws error when deleting non-existent item', () => {
    const nonExistentId = ItemId.create();

    expect(() => {
      vaultEngine.deleteEntry(nonExistentId);
    }).toThrow();

    const vault = vaultEngine.getVault();

    expect(vault.items.length).toBe(0);
  });
});
