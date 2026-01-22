import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  /**
   * Joi validation error
   */
  if (err instanceof Joi.ValidationError) {
    statusCode = 400;
    message = 'Validation error';
    details = err.details.map(d => d.message);
  }

  /**
   * JWT errors
   */
  else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
  }

  else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Token expired';
  }

  /**
   * Prisma errors
   */
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case 'P2002':
        message = 'Unique constraint failed';
        details = err.meta;
        break;

      case 'P2025':
        message = 'Record not found';
        break;

      default:
        message = 'Database error';
    }
  }

  /**
   * Custom app errors (si luego los creas)
   */
  else if (err instanceof Error) {
    message = err.message;
  }

  /**
   * Logging centralizado
   */
  logger.error('Unhandled error', {
    statusCode,
    message,
    details,
    path: req.originalUrl,
    method: req.method,
    stack: err instanceof Error ? err.stack : undefined
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details })
  });
}
