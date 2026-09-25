import { AppError } from '@/shared/error/AppError';

class UnsupportedExportFormatError extends AppError {
  constructor() {
    super({
      message: 'This file is not a valid export file',
      code: 'UNSUPPORTED_EXPORT_FORMAT',
      statusCode: 400,
      isOperational: true,
    });
  }
}

export default UnsupportedExportFormatError;
