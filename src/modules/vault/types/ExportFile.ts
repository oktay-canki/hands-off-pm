import { CryptoVersion } from '@/modules/crypto/crypto.config';

interface ExportFile {
  formatVersion: 1; // export file schema version - independent of CryptoVersion
  exportedAt: number;
  salt: string; // base64
  payload: {
    ciphertext: string; // base64
    nonce: string; // base64
    version: CryptoVersion;
  };
}

export default ExportFile;
