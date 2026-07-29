import { AppError } from '@/shared/error/AppError';

class FailedToAddEntryError extends AppError {
  constructor() {
    super({
      message: 'Failed to add entry.',
      code: 'FAILED_TO_ADD_ENTRY',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToAddEntryError;
