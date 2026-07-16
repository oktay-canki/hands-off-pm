import { AppError } from '@/shared/error/AppError';

export default class InvalidCharIndexError extends AppError {
  constructor() {
    super({
      message: 'Invalid index for character pool length.',
      code: 'INVALID_CHAR_INDEX',
      statusCode: 400,
      isOperational: true,
    });
  }
}
