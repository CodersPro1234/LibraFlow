import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

type RequestTarget = 'body' | 'query' | 'params';

/**
 * Valide req[target] avec le schéma Zod fourni.
 * En cas d'échec, passe une ZodError à errorHandler (→ 400).
 */
export function validate(schema: ZodSchema, target: RequestTarget = 'body'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    // Remplace par les données parsées (avec coercions et defaults Zod)
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
