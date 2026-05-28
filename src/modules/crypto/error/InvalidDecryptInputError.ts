import { AppError } from '@/shared/error/AppError';

export class InvalidDecryptionInputError extends AppError {
  constructor() {
    super({
      message: 'Invalid encrypted input',
      code: 'CRYPTO_INVALID_DECRYPT_INPUT',
      statusCode: 400,
      isOperational: true,
    });
  }
}
