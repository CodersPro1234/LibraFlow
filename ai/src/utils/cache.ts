/**
 * LibraFlow - Service de Cache Redis
 * 
 * Cache agressif pour optimiser les latences :
 * - Résumés de documents (30 jours)
 * - Embeddings (7 jours)
 * - Recommandations (1 jour)
 * - Questions suggérées (7 jours)
 * - Tags générés (30 jours)
 */

import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

let redisClient: Redis | null = null

/**
 * Initialise le client Redis
 */
export function initRedis(): Redis {
  if (redisClient) return redisClient
  
  if (!process.env.REDIS_URL) {
    console.warn('⚠️ REDIS_URL non configuré, cache désactivé')
    return null as any
  }
  
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null
      return Math.min(times * 100, 3000)
    }
  })
  
  redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err)
  })
  
  redisClient.on('connect', () => {
    console.log('✅ Redis connecté')
  })
  
  return redisClient
}

/**
 * Récupère une valeur du cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redisClient) return null
  
  try {
    const value = await redisClient.get(key)
    if (!value) return null
    
    return JSON.parse(value) as T
  } catch (error) {
    console.error('❌ Erreur getCache:', error)
    return null
  }
}

/**
 * Définit une valeur dans le cache avec TTL
 */
export async function setCache<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!redisClient) return
  
  try {
    await redisClient.setex(key, ttlSeconds, JSON.stringify(value))
  } catch (error) {
    console.error('❌ Erreur setCache:', error)
  }
}

/**
 * Supprime une valeur du cache
 */
export async function deleteCache(key: string): Promise<void> {
  if (!redisClient) return
  
  try {
    await redisClient.del(key)
  } catch (error) {
    console.error('❌ Erreur deleteCache:', error)
  }
}

/**
 * Supprime un pattern de clés (ex: recommend:*)
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  if (!redisClient) return
  
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(...keys)
    }
  } catch (error) {
    console.error('❌ Erreur deleteCachePattern:', error)
  }
}

/**
 * Génère une clé de cache avec préfixe
 */
export function cacheKey(prefix: string, identifier: string): string {
  return `libraflow:${prefix}:${identifier}`
}

/**
 * TTL standards (en secondes)
 */
export const CACHE_TTL = {
  SHORT: 3600,        // 1 heure
  MEDIUM: 86400,      // 1 jour
  LONG: 604800,       // 7 jours
  VERY_LONG: 2592000  // 30 jours
}

/**
 * Wrapper de fonction avec cache automatique
 */
export function withCache<T>(
  prefix: string,
  keyFn: (...args: any[]) => string,
  fn: (...args: any[]) => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
) {
  return async (...args: any[]): Promise<T> => {
    const key = cacheKey(prefix, keyFn(...args))
    
    // Essayer de récupérer du cache
    const cached = await getCache<T>(key)
    if (cached !== null) {
      console.log(`📦 Cache HIT: ${key}`)
      return cached
    }
    
    // Calculer et mettre en cache
    console.log(`📦 Cache MISS: ${key}`)
    const result = await fn(...args)
    await setCache(key, result, ttl)
    
    return result
  }
}
