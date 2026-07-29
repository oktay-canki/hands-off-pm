import { AppError } from '@/shared/error/AppError';

class FailedToUpdateEntryError extends AppError {
  constructor() {
    super({
      message: 'Failed to update entry.',
      code: 'FAILED_TO_UPDATE_ENTRY',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToUpdateEntryError;
