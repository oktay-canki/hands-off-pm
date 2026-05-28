import { CryptoVersion } from '@/modules/crypto/crypto.config';
import { AppError } from '@/shared/error/AppError';

export class UnsupportedCryptoVersionError extends AppError {
  constructor(version?: CryptoVersion) {
    super({
      message: 'Unsupported crypto version',
      code: 'CRYPTO_UNSUPPORTED_VERSION',
      statusCode: 400,
      isOperational: true,
      details: version ? { version } : undefined,
    });
  }
}
