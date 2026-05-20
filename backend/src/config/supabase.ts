import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { env } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wsTransport = ws as unknown as any;

/** Client service_role — bypass RLS, pour toutes les opérations backend admin */
export const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: wsTransport },
});

/** Client anon — à utiliser uniquement pour vérifications sans privilèges */
export const supabaseAnon = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  realtime: { transport: wsTransport },
});
