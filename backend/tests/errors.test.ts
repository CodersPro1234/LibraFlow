import { describe, it, expect } from 'vitest';
import {
  AppError,
  AuthError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ConflictError,
  ServiceUnavailableError,
} from '../src/utils/errors';

describe('AppError', () => {
  it('crée une AppError avec les valeurs par défaut', () => {
    const err = new AppError('Erreur test');
    expect(err.statusCode).toBe(500);
    expect(err.code).toBe('INTERNAL_ERROR');
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('Erreur test');
  });

  it('crée une AppError non-opérationnelle', () => {
    const err = new AppError('Bug critique', 500, 'CRASH', undefined, false);
    expect(err.isOperational).toBe(false);
  });
});

describe('AuthError', () => {
  it('a statusCode 401 et code UNAUTHORIZED par défaut', () => {
    const err = new AuthError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe('UNAUTHORIZED');
    expect(err.message).toBe('Non autorisé');
  });
});

describe('ForbiddenError', () => {
  it('a statusCode 403 et code FORBIDDEN', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });

  it('accepte des détails optionnels', () => {
    const err = new ForbiddenError('Interdit', 'FORBIDDEN', { required: ['admin'] });
    expect(err.details).toEqual({ required: ['admin'] });
  });
});

describe('NotFoundError', () => {
  it('a statusCode 404 et code NOT_FOUND', () => {
    const err = new NotFoundError('Publication');
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Publication non trouvé(e)');
  });
});

describe('ValidationError', () => {
  it('a statusCode 400 et code VALIDATION_ERROR', () => {
    const err = new ValidationError('Champ invalide');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });
});

describe('ConflictError', () => {
  it('a statusCode 409 et code CONFLICT', () => {
    const err = new ConflictError('Email déjà utilisé');
    expect(err.statusCode).toBe(409);
    expect(err.code).toBe('CONFLICT');
  });
});

describe('ServiceUnavailableError', () => {
  it('a statusCode 503 et code SERVICE_UNAVAILABLE', () => {
    const err = new ServiceUnavailableError('API Campus Faso');
    expect(err.statusCode).toBe(503);
    expect(err.code).toBe('SERVICE_UNAVAILABLE');
    expect(err.message).toBe('API Campus Faso temporairement indisponible');
  });

  it('utilise le nom de service par défaut', () => {
    const err = new ServiceUnavailableError();
    expect(err.message).toBe('Service externe temporairement indisponible');
  });
});
