import VaultItem from '@/modules/vault/types/VaultItem';

export type ItemConflict = {
  local: VaultItem;
  incoming: VaultItem;
};
