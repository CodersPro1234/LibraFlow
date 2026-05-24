import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthError, ForbiddenError } from '../utils/errors';
import type { Role } from '../types';

/**
 * Vérifie que le user connecté possède un des rôles autorisés.
 * Doit être précédé du middleware authenticate().
 *
 * @example
 * router.patch('/valider', authenticate, requireRole('universite'), controller)
 */
export function requireRole(...roles: Role[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthError());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(
        new ForbiddenError(
          `Accès réservé aux rôles : ${roles.join(', ')}. Votre rôle : ${req.user.role}`,
          'FORBIDDEN',
          { required: roles, actual: req.user.role }
        )
      );
      return;
    }
    next();
  };
}
