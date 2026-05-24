/**
 * Classe de base pour toutes les erreurs métier de l'application.
 * Format de réponse uniforme : { error: { code, message, details } }
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  /** false = erreur de programmation (panic), true = erreur attendue (métier) */
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: unknown,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** 401 — Token absent, invalide ou expiré */
export class AuthError extends AppError {
  constructor(message: string = 'Non autorisé', code: string = 'UNAUTHORIZED') {
    super(message, 401, code);
  }
}

/** 403 — Authentifié mais rôle insuffisant ou compte suspendu */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Accès interdit', code: string = 'FORBIDDEN', details?: unknown) {
    super(message, 403, code, details);
  }
}

/** 404 — Ressource introuvable */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Ressource') {
    super(`${resource} non trouvé(e)`, 404, 'NOT_FOUND');
  }
}

/** 400 — Payload invalide (complète la validation Zod) */
export class ValidationError extends AppError {
  constructor(message: string = 'Données invalides', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/** 409 — Doublon (email, INE, etc.) */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflit de données', code: string = 'CONFLICT') {
    super(message, 409, code);
  }
}

/** 503 — Service tiers (Campus Faso, IA) indisponible */
export class ServiceUnavailableError extends AppError {
  constructor(service: string = 'Service externe') {
    super(`${service} temporairement indisponible`, 503, 'SERVICE_UNAVAILABLE');
  }
}
