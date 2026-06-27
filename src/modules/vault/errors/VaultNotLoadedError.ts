import { AppError } from '@/shared/error/AppError';

class VaultNotLoadedError extends AppError {
  constructor() {
    super({
      message: 'Vault is not loaded.',
      code: 'VAULT_NOT_LOADED',
      statusCode: 423,
      isOperational: true,
    });
  }
}

export default VaultNotLoadedError;
