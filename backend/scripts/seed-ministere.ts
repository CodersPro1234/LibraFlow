/**
 * Crée le compte unique du Ministère de l'Éducation Nationale.
 * À exécuter une seule fois : npm run seed:ministere
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const SUPABASE_URL = process.env['SUPABASE_URL'];
const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];
const MINISTERE_EMAIL = process.env['MINISTERE_EMAIL'];
const MINISTERE_PASSWORD = process.env['MINISTERE_PASSWORD'];

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !MINISTERE_EMAIL || !MINISTERE_PASSWORD) {
  console.error('Variables manquantes : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MINISTERE_EMAIL, MINISTERE_PASSWORD');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws as unknown as any },
});

async function main(): Promise<void> {
  // Vérifier si le compte existe déjà
  const { data: existing } = await supabase
    .from('ministere')
    .select('id, email')
    .eq('email', MINISTERE_EMAIL!)
    .maybeSingle();

  if (existing) {
    console.log('Compte Ministère déjà existant.');
    console.log('  ID    :', existing.id);
    console.log('  Email :', existing.email);
    return;
  }

  const password_hash = await bcrypt.hash(MINISTERE_PASSWORD!, 12);

  const { data, error } = await supabase
    .from('ministere')
    .insert({
      email: MINISTERE_EMAIL,
      password_hash,
      nom_officiel: "Ministère de l'Éducation Nationale du Burkina Faso",
    })
    .select('id, email')
    .single();

  if (error) {
    console.error('Erreur lors de la création :', error.message);
    process.exit(1);
  }

  console.log('Compte Ministère créé avec succès.');
  console.log('  ID    :', data.id);
  console.log('  Email :', data.email);
  console.log('\nGardez ces informations en lieu sûr. Ne committez JAMAIS le fichier .env.');
}

main().catch((err: unknown) => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
