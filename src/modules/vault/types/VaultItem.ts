import VaultEntry from '@/modules/vault/types/VaultEntry';
import VaultEntryTombstone from '@/modules/vault/types/VaultEntryTombstone';

type VaultItem = VaultEntry | VaultEntryTombstone;

export default VaultItem;
