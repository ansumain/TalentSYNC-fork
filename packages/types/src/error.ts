interface ApiErrorPayload {
  message: string;
  code: string;
  statusCode: number;
}

interface ApiErrorResponse {
  error: ApiErrorPayload;
}

class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor({ statusCode, code, message }: ApiErrorPayload) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

const isAppError = (error: unknown): error is AppError => error instanceof AppError;

const createError = (statusCode: number, code: string, message: string) =>
  new AppError({ statusCode, code, message });

const badRequestError = (message: string, code = 'BAD_REQUEST') =>
  createError(400, code, message);

const unauthorizedError = (message: string, code = 'UNAUTHORIZED') =>
  createError(401, code, message);

const forbiddenError = (message: string, code = 'FORBIDDEN') =>
  createError(403, code, message);

const notFoundError = (message: string, code = 'NOT_FOUND') =>
  createError(404, code, message);

const conflictError = (message: string, code = 'CONFLICT') =>
  createError(409, code, message);

const internalServerError = (message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR') =>
  createError(500, code, message);

const toApiErrorResponse = (error: AppError): ApiErrorResponse => ({
  error: {
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
  },
});

export {
  type ApiErrorPayload,
  type ApiErrorResponse,
  AppError,
  isAppError,
  badRequestError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
  internalServerError,
  toApiErrorResponse
}