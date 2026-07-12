import { AppError } from '@/shared/error/AppError';

class FailedToPersistLocallyError extends AppError {
  constructor() {
    super({
      message: 'Failed to persist changes locally',
      code: 'FAILED_TO_PERSIST_LOCALLY',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToPersistLocallyError;
