type VaultEntry = {
  itemId: string;
  type: 'entry';
  title: string;
  username?: string;
  password: string;
  url?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export default VaultEntry;
