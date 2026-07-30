import { AppError } from '@/shared/error/AppError';

class InvalidCredentialsError extends AppError {
  constructor() {
    super({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
      statusCode: 400,
      isOperational: true,
    });
  }
}

export default InvalidCredentialsError;
