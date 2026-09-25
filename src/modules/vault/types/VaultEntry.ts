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

  version: number;
  deviceId: string;
};

export default VaultEntry;
