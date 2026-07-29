import { AppError } from '@/shared/error/AppError';

class FailedToRegisterError extends AppError {
  constructor() {
    super({
      message: 'Something went wrong when creating your vault.',
      code: 'FAILED_TO_REGISTER',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToRegisterError;
