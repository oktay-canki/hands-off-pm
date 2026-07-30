import { AppError } from '@/shared/error/AppError';

export default class IncompatibleEnvironmentError extends AppError {
  constructor() {
    super({
      message:
        'No secure crypto implementation found. This code must run in a browser or Node 18+ environment.',
      code: 'INCOMPATIBLE_ENVIRONMENT',
      statusCode: 400,
      isOperational: true,
    });
  }
}
