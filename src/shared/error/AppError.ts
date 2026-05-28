export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor({
    message,
    code,
    statusCode = 500,
    isOperational = true,
    details,
  }: {
    message: string;
    code: string;
    statusCode?: number;
    isOperational?: boolean;
    details?: unknown;
  }) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
