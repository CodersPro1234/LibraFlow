import axios from 'axios';
import CircuitBreaker from 'opossum';
import { env } from '../config/env';
import { ServiceUnavailableError } from '../utils/errors';
import logger from '../utils/logger';

export interface IneVerificationResult {
  valid: boolean;
  nom_complet?: string;
}

async function fetchIne(ine: string): Promise<IneVerificationResult> {
  const response = await axios.get<IneVerificationResult>(
    `${env.campusFasoApiUrl}/students/${encodeURIComponent(ine)}`,
    {
      headers: { 'X-API-Key': env.campusFasoApiKey },
      timeout: 5000,
    }
  );
  return response.data;
}

const breaker = new CircuitBreaker(fetchIne, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 30_000,
  name: 'campus-faso-ine',
  volumeThreshold: 3,
});

breaker.on('open', () => logger.warn('Campus Faso circuit breaker : OUVERT'));
breaker.on('halfOpen', () => logger.info('Campus Faso circuit breaker : DEMI-OUVERT'));
breaker.on('close', () => logger.info('Campus Faso circuit breaker : FERMÉ'));

/**
 * Vérifie un numéro INE via l'API Campus Faso.
 * Retourne { valid: false } si l'INE n'existe pas (404).
 * Lance ServiceUnavailableError si le circuit est ouvert ou si l'API ne répond pas.
 */
export async function verifyIne(ine: string): Promise<IneVerificationResult> {
  try {
    const result = await breaker.fire(ine);
    return result;
  } catch (err: unknown) {
    if (breaker.opened) {
      throw new ServiceUnavailableError('API Campus Faso');
    }
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return { valid: false };
    }
    logger.error({ err, ine }, 'Erreur appel Campus Faso');
    throw new ServiceUnavailableError('API Campus Faso');
  }
}
