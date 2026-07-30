import { AppError } from '@/shared/error/AppError';

export default class InvalidPasswordLengthError extends AppError {
  constructor() {
    super({
      message: 'Password length must be a positive integer.',
      code: 'INVALID_PASSWORD_LENGTH',
      statusCode: 400,
      isOperational: true,
    });
  }
}
