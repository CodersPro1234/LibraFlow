import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthError } from '../utils/errors';
import type { JwtPayload } from '../types';

/**
 * Vérifie le Bearer JWT et injecte req.user.
 * À placer avant tout middleware requireRole().
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AuthError('Token manquant ou malformé'));
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
    req.user = {
      id: payload.sub,
      role: payload.role,
      nom: payload.nom,
    };
    next();
  } catch {
    next(new AuthError('Token invalide ou expiré'));
  }
}
