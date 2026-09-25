import { AppError } from '@/shared/error/AppError';

class FailedToImportError extends AppError {
  constructor() {
    super({
      message: 'Failed to import vault',
      code: 'FAILED_TO_IMPORT',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToImportError;
