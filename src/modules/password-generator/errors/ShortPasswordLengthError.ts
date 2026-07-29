import { AppError } from '@/shared/error/AppError';

export default class ShortPasswordLengthError extends AppError {
  constructor() {
    super({
      message:
        'Password length is too short to include at least one character from each of the enabled categories.',
      code: 'INVALID_PASSWORD_LENGTH',
      statusCode: 400,
      isOperational: true,
    });
  }
}
