import { AppError } from '@/shared/error/AppError';

export default class NoCharacterCategoryError extends AppError {
  constructor() {
    super({
      message:
        'At least one character category (lowercase, uppercase, numbers, symbols) must be enabled.',
      code: 'NO_CHARACTER_CATEGORY_SELECTED',
      statusCode: 400,
      isOperational: true,
    });
  }
}
