import { AppError } from '@/shared/error/AppError';

class InvalidExportPasswordError extends AppError {
  constructor() {
    super({
      message: 'Incorrect export password, or the file is corrupted',
      code: 'INVALID_EXPORT_PASSWORD',
      statusCode: 401,
      isOperational: true,
    });
  }
}

export default InvalidExportPasswordError;
