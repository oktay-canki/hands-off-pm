import { AppError } from '@/shared/error/AppError';

class ItemDeletedError extends AppError {
  constructor() {
    super({
      message: 'This item is deleted',
      code: 'ITEM_DELETED',
      statusCode: 410,
      isOperational: true,
    });
  }
}

export default ItemDeletedError;
