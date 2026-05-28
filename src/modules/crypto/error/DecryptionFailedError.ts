import { AppError } from '@/shared/error/AppError';

export class DecryptionFailedError extends AppError {
  constructor() {
    super({
      message: 'Decryption failed',
      code: 'CRYPTO_DECRYPTION_FAILED',
      statusCode: 400,
      isOperational: true,
    });
  }
}
