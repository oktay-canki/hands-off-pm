import { AppError } from '@/shared/error/AppError';

class FailedToExportError extends AppError {
  constructor() {
    super({
      message: 'Failed to export vault',
      code: 'FAILED_TO_EXPORT',
      statusCode: 500,
      isOperational: true,
    });
  }
}

export default FailedToExportError;
