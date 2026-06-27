import { EncryptedPayload } from '@/modules/crypto/core/EncryptedPayload';

type EncryptedVaultItem = {
  itemId: string;
  title: string;
  payload: EncryptedPayload;
};

export default EncryptedVaultItem;
