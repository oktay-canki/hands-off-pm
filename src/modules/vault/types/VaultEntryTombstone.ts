type VaultEntryTombstone = {
  itemId: string;
  type: 'tombstone';
  deletedAt: number;
};

export default VaultEntryTombstone;
