import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';

type EncryptedVault = {
  userId: string;
  vaultId: string;
  payload: EncryptedPayload;
  salt: Uint8Array;
};

export default EncryptedVault;
