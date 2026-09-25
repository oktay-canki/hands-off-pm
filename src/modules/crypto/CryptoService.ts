import { CryptoEngine } from '@/modules/crypto/core/CryptoEngine';
import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';
import {
  EntryKey,
  ExportKey,
  KEY_PURPOSE,
  MasterKey,
  SubKey,
  VaultKey,
} from '@/modules/crypto/core/Key';
import ZKPMCodec from '@/modules/crypto/utils/ZKPMCodec';
import EncryptedVault from '@/modules/vault/types/EncryptedVault';
import EncryptedVaultItem from '@/modules/vault/types/EncryptedVaultItem';
import Vault from '@/modules/vault/types/Vault';
import VaultItem from '@/modules/vault/types/VaultItem';

class CryptoService {
  constructor(private readonly engine: CryptoEngine) {}

  encryptVault(vault: Vault, vaultKey: VaultKey): EncryptedVault {
    const payload = this.encrypt<Vault>(vault, vaultKey);
    return {
      userId: vault.userId,
      vaultId: vault.vaultId,
      payload,
      salt: vault.salt,
    };
  }

  decryptVault(encryptedVault: EncryptedVault, vaultKey: VaultKey): Vault {
    const vault = this.decrypt<Vault>(encryptedVault.payload, vaultKey);

    return vault;
  }

  encryptItem(item: VaultItem, entryKey: EntryKey): EncryptedVaultItem {
    const payload = this.encrypt<VaultItem>(item, entryKey);

    return {
      itemId: item.itemId,
      title: item.type === 'entry' ? item.title : 'deleted',
      payload,
    };
  }

  decryptItem(
    encryptedItem: EncryptedVaultItem,
    entryKey: EntryKey,
  ): VaultItem {
    const item = this.decrypt<VaultItem>(encryptedItem.payload, entryKey);

    return item;
  }

  async deriveMasterKey(
    password: string,
    salt: Uint8Array,
  ): Promise<MasterKey> {
    const masterKey = await this.engine.deriveMasterKey(password, salt);
    return masterKey;
  }

  deriveVaultKey(masterKey: MasterKey): VaultKey {
    return this.engine.deriveSubKey(masterKey, KEY_PURPOSE.VAULT);
  }

  deriveEntryKey(masterKey: MasterKey): EntryKey {
    return this.engine.deriveSubKey(masterKey, KEY_PURPOSE.ENTRY);
  }

  deriveExportKey(masterKey: MasterKey): ExportKey {
    return this.engine.deriveSubKey(masterKey, KEY_PURPOSE.EXPORT);
  }

  encrypt<T>(data: T, key: SubKey): EncryptedPayload {
    const bytes = new ZKPMCodec().encode(data);
    const payload = this.engine.encrypt(bytes, key);

    return payload;
  }

  decrypt<T>(payload: EncryptedPayload, key: SubKey): T {
    const bytes = this.engine.decrypt(payload, key);

    return new ZKPMCodec().decode<T>(bytes);
  }

  generateSalt(): Uint8Array {
    return this.engine.generateSalt();
  }
}

export default CryptoService;
