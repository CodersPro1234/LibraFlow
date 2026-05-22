import { describe, it, expect } from 'vitest';
import {
  registerProfesseurSchema,
  registerUniversiteSchema,
} from '../src/validators/auth.validators';
import { updatePublicationSchema } from '../src/validators/publications.validators';

// ── registerProfesseurSchema — matieres transform ─────────────────────────────

describe('registerProfesseurSchema — matieres transform', () => {
  const base = {
    nom_complet: 'Dr Test',
    email_pro: 'test@univ.bf',
    universite_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    password: 'Password123!',
  };

  it('parse un tableau JSON valide', () => {
    const result = registerProfesseurSchema.parse({ ...base, matieres: '["Maths","Physique"]' });
    expect(result.matieres).toEqual(['Maths', 'Physique']);
  });

  it('rejette du JSON invalide (pas un JSON)', () => {
    expect(() => registerProfesseurSchema.parse({ ...base, matieres: 'pas-du-json' }))
      .toThrow();
  });

  it('rejette si matieres n\'est pas un tableau (objet JSON)', () => {
    expect(() => registerProfesseurSchema.parse({ ...base, matieres: '{"key":"val"}' }))
      .toThrow();
  });

  it('rejette si matieres contient des non-strings', () => {
    expect(() => registerProfesseurSchema.parse({ ...base, matieres: '[1,2,3]' }))
      .toThrow();
  });

  it('rejette si matieres est un tableau vide', () => {
    expect(() => registerProfesseurSchema.parse({ ...base, matieres: '[]' }))
      .toThrow();
  });
});

// ── registerUniversiteSchema — latitude/longitude transforms ──────────────────

describe('registerUniversiteSchema — latitude/longitude transforms', () => {
  const base = {
    nom_officiel: 'Université Test',
    adresse: 'Rue Test Ouaga',
    email: 'univ@test.bf',
    nom_administrateur: 'Admin Test',
    password: 'Password123!',
  };

  it('convertit latitude string en nombre', () => {
    const result = registerUniversiteSchema.parse({ ...base, latitude: '12.37', longitude: '-1.53' });
    expect(result.latitude).toBe(12.37);
    expect(result.longitude).toBe(-1.53);
  });

  it('retourne undefined si latitude est NaN', () => {
    const result = registerUniversiteSchema.parse({ ...base, latitude: 'not-a-number' });
    expect(result.latitude).toBeUndefined();
  });

  it('retourne undefined si longitude est NaN', () => {
    const result = registerUniversiteSchema.parse({ ...base, longitude: 'abc' });
    expect(result.longitude).toBeUndefined();
  });

  it('retourne undefined si latitude absente', () => {
    const result = registerUniversiteSchema.parse({ ...base });
    expect(result.latitude).toBeUndefined();
    expect(result.longitude).toBeUndefined();
  });
});

// ── updatePublicationSchema — refine ──────────────────────────────────────────

describe('updatePublicationSchema — refine', () => {
  it('rejette si ni titre ni description fournis', () => {
    expect(() => updatePublicationSchema.parse({})).toThrow();
  });

  it('accepte si titre seul fourni', () => {
    const result = updatePublicationSchema.parse({ titre: 'Nouveau titre' });
    expect(result.titre).toBe('Nouveau titre');
  });

  it('accepte si description seule fournie', () => {
    const result = updatePublicationSchema.parse({ description: 'Nouvelle description' });
    expect(result.description).toBe('Nouvelle description');
  });
});
