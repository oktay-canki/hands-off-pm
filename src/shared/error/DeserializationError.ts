import { AppError } from '@/shared/error/AppError';

export class DeserializationError extends AppError {
  constructor() {
    super({
      message: 'Deserialization failed',
      code: 'DESERIALIZATION_FAILED',
      statusCode: 400,
      isOperational: true,
    });
  }
}
