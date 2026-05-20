import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Erreur de validation Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Erreur métier applicative
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err }, 'Erreur non opérationnelle');
    }
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  // Erreur inattendue (bug de programmation)
  logger.error({ err }, 'Erreur inattendue non gérée');
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Une erreur interne est survenue',
    },
  });
}
