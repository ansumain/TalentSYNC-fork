import type { ErrorRequestHandler, RequestHandler } from 'express';
import {
  AppError,
  badRequestError,
  internalServerError,
  isAppError,
  notFoundError,
  toApiErrorResponse,
} from '@talentsync/types';

const isJSONError = (error: unknown): error is SyntaxError & { status: number; body?: unknown } =>
  error instanceof SyntaxError && 'status' in error && 'body' in error;

const checkErrorFormat = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (isJSONError(error)) {
    return badRequestError('Invalid JSON payload', 'INVALID_JSON_PAYLOAD');
  }

  return internalServerError();
};

const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(notFoundError(`Route ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND'));
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const appError = checkErrorFormat(error);

  if (appError.statusCode >= 500) {
    console.error('Unhandled application-service error:', {
      method: req.method,
      path: req.originalUrl,
      error,
    });
  }

  res.status(appError.statusCode).json(toApiErrorResponse(appError));
};

export { notFoundHandler, globalErrorHandler };