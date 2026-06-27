import { AppError } from '@/shared/error/AppError';

class ItemDoesNotExistError extends AppError {
  constructor() {
    super({
      message: 'Specified item does not exist.',
      code: 'ITEM_DOES_NOT_EXIST',
      statusCode: 404,
      isOperational: true,
    });
  }
}

export default ItemDoesNotExistError;
