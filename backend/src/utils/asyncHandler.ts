import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Enveloppe un controller async pour propager les erreurs vers errorHandler.
 * Évite le try/catch répété dans chaque controller.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
