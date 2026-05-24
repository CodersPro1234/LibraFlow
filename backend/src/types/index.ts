export type Role = 'ministere' | 'universite' | 'professeur' | 'etudiant';

export interface JwtPayload {
  sub: string;
  role: Role;
  nom: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  id: string;
  role: Role;
  nom: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
