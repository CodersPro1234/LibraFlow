import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('axios');

describe('campusFaso.service — verifyIne', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('retourne le résultat de l\'API si succès (ligne return response.data et return result)', async () => {
    const { default: axios } = await import('axios');
    vi.mocked(axios.get).mockResolvedValueOnce({ data: { valid: true, nom_complet: 'Moussa Test' } });

    const { verifyIne } = await import('../src/services/campusFaso.service');
    const result = await verifyIne('BF2300001');

    expect(result.valid).toBe(true);
    expect(result.nom_complet).toBe('Moussa Test');
  });

  it('retourne { valid: false } si axios retourne 404 (ligne return { valid: false })', async () => {
    const { default: axios } = await import('axios');
    const error = Object.assign(new Error('Not found'), {
      isAxiosError: true,
      response: { status: 404 },
    });
    vi.mocked(axios.isAxiosError).mockReturnValue(true);
    vi.mocked(axios.get).mockRejectedValueOnce(error);

    const { verifyIne } = await import('../src/services/campusFaso.service');
    const result = await verifyIne('INVALID_INE');

    expect(result.valid).toBe(false);
  });

  it('lance ServiceUnavailableError si erreur non-Axios (lignes logger.error + throw)', async () => {
    const { default: axios } = await import('axios');
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'));

    const { verifyIne } = await import('../src/services/campusFaso.service');

    const err = await verifyIne('TEST_INE').catch((e: unknown) => e) as { code: string; statusCode: number };
    expect(err.code).toBe('SERVICE_UNAVAILABLE');
    expect(err.statusCode).toBe(503);
  });

  it('lance ServiceUnavailableError quand le circuit breaker est ouvert (ligne breaker.opened)', async () => {
    const { default: axios } = await import('axios');
    const networkError = new Error('Connection refused');
    vi.mocked(axios.isAxiosError).mockReturnValue(false);
    vi.mocked(axios.get).mockRejectedValue(networkError);

    const { verifyIne } = await import('../src/services/campusFaso.service');

    // Accumuler suffisamment d'échecs pour ouvrir le circuit (volumeThreshold: 3, errorThresholdPercentage: 50)
    for (let i = 0; i < 4; i++) {
      try { await verifyIne(`INE_${i}`); } catch { /* ignoré */ }
    }

    // Le circuit est maintenant ouvert — la prochaine erreur doit passer par breaker.opened
    const lastErr = await verifyIne('LAST_INE').catch((e: unknown) => e) as { code: string; statusCode: number };
    expect(lastErr.code).toBe('SERVICE_UNAVAILABLE');
    expect(lastErr.statusCode).toBe(503);
  });
});
