import { AppError } from '@/shared/error/AppError';

class FailedToDeleteEntryError extends AppError {
  constructor() {
    super({
      message: 'Failed to delete entry.',
      code: 'FAILED_TO_DELETE_ENTRY',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToDeleteEntryError;
