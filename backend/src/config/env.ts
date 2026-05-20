import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable d'environnement requise manquante : ${name}`);
  }
  return value;
}

function optionalEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] ?? fallback;
}

export const env = {
  port: parseInt(process.env['PORT'] ?? '4000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',

  supabaseUrl: requireEnv('SUPABASE_URL'),
  supabaseAnonKey: requireEnv('SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),

  jwtAccessSecret: requireEnv('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: requireEnv('JWT_REFRESH_SECRET'),

  redisUrl: requireEnv('REDIS_URL'),

  campusFasoApiUrl: requireEnv('CAMPUS_FASO_API_URL'),
  campusFasoApiKey: requireEnv('CAMPUS_FASO_API_KEY'),

  iaServiceUrl: requireEnv('IA_SERVICE_URL'),

  ministereEmail: requireEnv('MINISTERE_EMAIL'),
  ministerePassword: requireEnv('MINISTERE_PASSWORD'),

  sentryDsn: optionalEnv('SENTRY_DSN'),

  frontendUrl: optionalEnv('FRONTEND_URL', 'http://localhost:5173')!,
  frontendStagingUrl: optionalEnv('FRONTEND_STAGING_URL'),
  frontendProdUrl: optionalEnv('FRONTEND_PROD_URL'),
} as const;
