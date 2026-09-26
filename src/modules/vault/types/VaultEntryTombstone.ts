type VaultEntryTombstone = {
  itemId: string;
  type: 'tombstone';
  deletedAt: number;

  version: number;
  deviceId: string;
};

export default VaultEntryTombstone;
