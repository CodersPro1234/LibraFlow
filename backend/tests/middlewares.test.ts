import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import app from '../src/server';
import { authenticate } from '../src/middlewares/auth.middleware';
import { requireRole } from '../src/middlewares/roles.middleware';
import { errorHandler } from '../src/middlewares/errorHandler.middleware';
import { AppError, AuthError } from '../src/utils/errors';

const ACCESS_SECRET = process.env['JWT_ACCESS_SECRET']!;

// ── authenticate middleware ───────────────────────────────────────────────────

describe('authenticate middleware', () => {
  it('appelle next avec AuthError si token malformé (non-JWT)', async () => {
    const next = vi.fn();
    const req = {
      headers: { authorization: 'Bearer not.a.valid.jwt' },
    } as unknown as Request;
    const res = {} as Response;

    authenticate(req, res, next);

    await new Promise((r) => setTimeout(r, 0));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('appelle next avec AuthError si token expiré', async () => {
    const expiredToken = jwt.sign(
      { sub: 'user-1', role: 'etudiant' },
      ACCESS_SECRET,
      { expiresIn: -1 }
    );
    const next = vi.fn();
    const req = {
      headers: { authorization: `Bearer ${expiredToken}` },
    } as unknown as Request;
    const res = {} as Response;

    authenticate(req, res, next);

    await new Promise((r) => setTimeout(r, 0));
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('retourne 401 via HTTP si token invalide', async () => {
    const res = await request(app)
      .get('/api/v1/me')
      .set('Authorization', 'Bearer completely.invalid.token');
    expect(res.status).toBe(401);
  });
});

// ── requireRole middleware ────────────────────────────────────────────────────

describe('requireRole middleware', () => {
  it('appelle next avec AuthError si req.user est absent', () => {
    const next = vi.fn();
    const req = {} as Request;
    const res = {} as Response;

    const middleware = requireRole('ministere');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it('appelle next avec ForbiddenError si rôle insuffisant', () => {
    const next = vi.fn();
    const req = { user: { id: 'u1', role: 'etudiant' } } as unknown as Request;
    const res = {} as Response;

    const middleware = requireRole('ministere', 'universite');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
  });

  it('appelle next sans erreur si rôle autorisé', () => {
    const next = vi.fn();
    const req = { user: { id: 'u1', role: 'professeur' } } as unknown as Request;
    const res = {} as Response;

    const middleware = requireRole('professeur', 'universite');
    middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });
});

// ── errorHandler middleware ───────────────────────────────────────────────────

describe('errorHandler middleware', () => {
  function makeRes() {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    return res;
  }

  it('gère AppError non-opérationnelle (isOperational=false)', () => {
    const err = new AppError('Erreur critique', 500, 'CRASH', undefined, false);
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler(err, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: 'CRASH' }) })
    );
  });

  it('gère AppError opérationnelle (isOperational=true)', () => {
    const err = new AuthError('Token manquant');
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler(err, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('gère un throw non-Error (string)', () => {
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler('une erreur string', {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: 'INTERNAL_ERROR' }) })
    );
  });

  it('gère un throw non-Error (null)', () => {
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler(null, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('gère une Error avec statusCode custom (non-AppError)', () => {
    const err = Object.assign(new Error('Service KO'), { statusCode: 503, code: 'SERVICE_DOWN' });
    const res = makeRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler(err, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.objectContaining({ code: 'SERVICE_DOWN' }) })
    );
  });
});
