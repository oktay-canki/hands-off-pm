import { AppError } from '@/shared/error/AppError';

class UnknownError extends AppError {
  constructor() {
    super({
      message: 'An unknown error occured.',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      isOperational: false,
    });
  }
}

export default UnknownError;
