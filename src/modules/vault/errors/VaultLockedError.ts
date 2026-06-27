import { AppError } from '@/shared/error/AppError';

class VaultLockedError extends AppError {
  constructor() {
    super({
      message: 'Vault is locked',
      code: 'VAULT_LOCKED',
      statusCode: 400,
      isOperational: true,
    });
  }
}

export default VaultLockedError;
