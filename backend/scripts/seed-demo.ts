/**
 * Données de démo pour le hackathon LibraFlow.
 * Crée : 5 universités, 15 professeurs, 50 étudiants, 100 publications (fictives).
 * À exécuter APRÈS seed:ministere : npm run seed:demo
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

const SUPABASE_URL = process.env['SUPABASE_URL'];
const SUPABASE_SERVICE_ROLE_KEY = process.env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Variables manquantes : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: ws as unknown as any },
});

// ── Données de référence ──────────────────────────────────────────────────────

const UNIVERSITES = [
  { nom: 'Université Joseph Ki-Zerbo', ville: 'Ouagadougou', region: 'Centre', lat: 12.3714, lng: -1.5197 },
  { nom: 'Université Nazi Boni', ville: 'Bobo-Dioulasso', region: 'Hauts-Bassins', lat: 11.1771, lng: -4.2979 },
  { nom: 'Université Norbert Zongo', ville: 'Koudougou', region: 'Centre-Ouest', lat: 12.2503, lng: -2.3609 },
  { nom: 'Université Thomas Sankara', ville: 'Ouagadougou', region: 'Centre', lat: 12.3200, lng: -1.4700 },
  { nom: 'Institut Universitaire de Technologie', ville: 'Ouagadougou', region: 'Centre', lat: 12.3600, lng: -1.5100 },
];

const MATIERES = ['Mathématiques', 'Physique', 'Informatique', 'Économie', 'Droit', 'Biologie', 'Chimie', 'Histoire'];
const NIVEAUX = ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat', 'BTS'] as const;
const TYPES_DOC = ['cours', 'td', 'annales', 'resume', 'autre'] as const;

const PRENOM_NOMS = [
  'Amadou Sawadogo', 'Fatima Ouédraogo', 'Ibrahim Traoré', 'Aïssata Diallo',
  'Moussa Compaoré', 'Mariam Kaboré', 'Salif Ouattara', 'Kadiatou Bah',
  'Boureima Zongo', 'Aminata Coulibaly', 'Seydou Kinda', 'Rasmata Tapsoba',
  'Adama Nikiema', 'Fatoumata Simporé', 'Hamidou Ilboudo',
];

const INE_ETUDIANTS = Array.from({ length: 50 }, (_, i) =>
  `BF${String(2020 + Math.floor(i / 10)).slice(2)}${String(i + 1).padStart(5, '0')}`
);

const TITRES_COURS = [
  'Introduction aux algorithmes', 'Algèbre linéaire avancée', 'Thermodynamique appliquée',
  'Droit constitutionnel', 'Macroéconomie I', 'Génétique moléculaire',
  'Réseaux informatiques', 'Analyse numérique', 'Chimie organique',
  'Histoire de l\'Afrique contemporaine', 'Programmation orientée objet',
  'Statistiques et probabilités', 'Physique quantique', 'Microéconomie avancée',
  'Écologie et environnement', 'Base de données relationnelles',
  'Cryptographie et sécurité', 'Biochimie structurale', 'Droit des affaires',
  'Electromagnétisme', 'Systèmes d\'exploitation', 'Calcul différentiel',
];

// ── Utilitaires ───────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugEmail(nom: string, suffix: string): string {
  return nom.toLowerCase()
    .replace(/[éèêë]/g, 'e').replace(/[àâ]/g, 'a').replace(/[îï]/g, 'i')
    .replace(/[ùûü]/g, 'u').replace(/[ôö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '.') + suffix;
}

// ── Seed ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('Demo1234!', 10);

  // 1. Universités
  console.log('→ Création des universités...');
  const univIds: string[] = [];

  for (const u of UNIVERSITES) {
    const email = slugEmail(u.nom, '@univ-demo.bf');
    const { data: existing } = await supabase
      .from('universites')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      univIds.push(existing.id as string);
      console.log(`  (existe) ${u.nom}`);
      continue;
    }

    const { data, error } = await supabase
      .from('universites')
      .insert({
        email,
        password_hash: passwordHash,
        nom_officiel: u.nom,
        adresse: `${u.ville}, Burkina Faso`,
        region: u.region,
        latitude: u.lat,
        longitude: u.lng,
        statut: 'approuvee',
        numero_agrement: `AG-${rand(1000, 9999)}-${rand(2010, 2023)}`,
      })
      .select('id')
      .single();

    if (error) { console.error(`  Erreur université ${u.nom}:`, error.message); continue; }
    univIds.push(data.id as string);
    console.log(`  ✓ ${u.nom}`);
  }

  // 2. Professeurs (3 par université)
  console.log('\n→ Création des professeurs...');
  const profIds: string[] = [];

  for (let i = 0; i < PRENOM_NOMS.length; i++) {
    const nom = PRENOM_NOMS[i]!;
    const univId = univIds[i % univIds.length]!;
    const email = slugEmail(nom, `@prof-demo.bf`);
    const matieres = [pick(MATIERES), pick(MATIERES)].filter((v, idx, arr) => arr.indexOf(v) === idx);

    const { data: existing } = await supabase
      .from('professeurs')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      profIds.push(existing.id as string);
      console.log(`  (existe) ${nom}`);
      continue;
    }

    const { data, error } = await supabase
      .from('professeurs')
      .insert({
        email,
        password_hash: passwordHash,
        nom_complet: nom,
        universite_id: univId,
        matieres,
        statut: 'actif',
      })
      .select('id')
      .single();

    if (error) { console.error(`  Erreur prof ${nom}:`, error.message); continue; }
    profIds.push(data.id as string);
    console.log(`  ✓ ${nom}`);
  }

  // 3. Étudiants (50)
  console.log('\n→ Création des étudiants...');
  let etudiantsCreated = 0;

  for (let i = 0; i < 50; i++) {
    const ine = INE_ETUDIANTS[i]!;
    const nom = `Étudiant Demo ${i + 1}`;
    const email = `etudiant${i + 1}@etu-demo.bf`;
    const univId = univIds[i % univIds.length]!;

    const { data: existing } = await supabase
      .from('etudiants')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) { continue; }

    const { error } = await supabase
      .from('etudiants')
      .insert({
        email,
        password_hash: passwordHash,
        nom_complet: nom,
        numero_ine: ine,
        universite_id: univId,
        statut: 'actif',
      });

    if (!error) etudiantsCreated++;
  }
  console.log(`  ✓ ${etudiantsCreated} étudiants créés`);

  // 4. Publications (100) — PDF fictif minimal (1 ko)
  console.log('\n→ Création des publications...');
  const fakePdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n', 'utf8');
  let pubsCreated = 0;

  for (let i = 0; i < 100; i++) {
    const profId = profIds[i % profIds.length]!;
    const univId = univIds[i % univIds.length]!;
    const titre = `${pick(TITRES_COURS)} — Partie ${rand(1, 5)}`;
    const matiere = pick(MATIERES);
    const niveau = pick([...NIVEAUX]);
    const type_doc = pick([...TYPES_DOC]);

    // Upload storage
    const storagePath = `publications/demo/${Date.now()}_${i}_demo.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from('documents')
      .upload(storagePath, fakePdfBuffer, { contentType: 'application/pdf', upsert: false });

    let pdfUrl = `https://placeholder.demo/documents/${storagePath}`;
    if (!uploadErr) {
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(storagePath);
      pdfUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('publications')
      .insert({
        professeur_id: profId,
        universite_id: univId,
        titre,
        matiere,
        niveau,
        type_doc,
        description: `Document de démonstration : ${titre}`,
        pdf_url: pdfUrl,
        pdf_size_bytes: fakePdfBuffer.length,
        statut_moderation: 'validee',
        resume_ia: `Résumé automatique de "${titre}" — matière : ${matiere}, niveau : ${niveau}.`,
        score_fiabilite: rand(70, 99),
        likes_count: rand(0, 150),
        telechargements_count: rand(0, 500),
        vues_count: rand(0, 2000),
        commentaires_count: rand(0, 30),
      });

    if (!error) pubsCreated++;
  }
  console.log(`  ✓ ${pubsCreated} publications créées`);

  console.log('\n✅ Seed démo terminé !');
  console.log('   Mot de passe universel : Demo1234!');
  console.log('   Utilisez ces comptes pour tester l\'application.');
}

main().catch((err: unknown) => {
  console.error('Erreur fatale :', err);
  process.exit(1);
});
