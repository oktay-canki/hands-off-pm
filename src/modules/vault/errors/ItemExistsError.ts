import { AppError } from '@/shared/error/AppError';

class ItemExistsError extends AppError {
  constructor() {
    super({
      message: 'Duplicate item id',
      code: 'ITEM_EXISTS',
      statusCode: 409,
      isOperational: true,
    });
  }
}

export default ItemExistsError;
