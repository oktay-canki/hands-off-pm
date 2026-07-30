import { AppError } from '@/shared/error/AppError';

class VaultNotFoundError extends AppError {
  constructor() {
    super({
      message: 'No such vault exists.',
      code: 'VAULT_NOT_FOUND',
      statusCode: 404,
      isOperational: true,
    });
  }
}

export default VaultNotFoundError;
