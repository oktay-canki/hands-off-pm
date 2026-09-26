import CryptoService from '@/modules/crypto/CryptoService';
import { base64ToBytes, bytesToBase64 } from '@/modules/crypto/utils/base64';
import FailedToExportError from '@/modules/vault/errors/FailedToExportError';
import InvalidExportPasswordError from '@/modules/vault/errors/InvalidExportPasswordError';
import UnsupportedExportFormatError from '@/modules/vault/errors/UnsupportedExportFormatError';
import ExportFile from '@/modules/vault/types/ExportFile';
import VaultItem from '@/modules/vault/types/VaultItem';

const EXPORT_FORMAT_VERSION = 1;

class ExportService {
  constructor(private readonly crypto: CryptoService) {}

  async createExport(
    items: VaultItem[],
    exportPassword: string,
  ): Promise<ExportFile> {
    try {
      const salt = this.crypto.generateSalt();
      const exportKey = await this.deriveExportKey(exportPassword, salt);
      const payload = this.crypto.encrypt<VaultItem[]>(items, exportKey);

      return {
        formatVersion: EXPORT_FORMAT_VERSION,
        exportedAt: Date.now(),
        salt: bytesToBase64(salt),
        payload: {
          ciphertext: bytesToBase64(payload.ciphertext),
          nonce: bytesToBase64(payload.nonce),
          version: payload.version,
        },
      };
    } catch {
      throw new FailedToExportError();
    }
  }

  async readExport(
    file: ExportFile,
    exportPassword: string,
  ): Promise<VaultItem[]> {
    if (file.formatVersion !== EXPORT_FORMAT_VERSION) {
      throw new UnsupportedExportFormatError();
    }

    const salt = base64ToBytes(file.salt);
    const exportKey = await this.deriveExportKey(exportPassword, salt);

    try {
      return this.crypto.decrypt<VaultItem[]>(
        {
          ciphertext: base64ToBytes(file.payload.ciphertext),
          nonce: base64ToBytes(file.payload.nonce),
          version: file.payload.version,
        },
        exportKey,
      );
    } catch {
      throw new InvalidExportPasswordError();
    }
  }

  private async deriveExportKey(password: string, salt: Uint8Array) {
    const masterKey = await this.crypto.deriveMasterKey(password, salt);
    return this.crypto.deriveExportKey(masterKey);
  }
}

export default ExportService;
