import type { Request, Response } from 'express';
import * as pubService from '../services/publications.service';
import { ValidationError } from '../utils/errors';
import type {
  CreatePublicationInput,
  UpdatePublicationInput,
  SearchPublicationsInput,
  SignalerInput,
  AskInput,
} from '../validators/publications.validators';

const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_MIME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/** POST /api/v1/publications */
export async function createPublication(req: Request, res: Response): Promise<void> {
  const user = req.user!;
  if (user.role !== 'professeur') {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Seuls les professeurs peuvent publier' } });
    return;
  }

  const file = req.file;
  if (!file) throw new ValidationError('Fichier requis');
  if (file.size > MAX_PDF_SIZE) throw new ValidationError('Fichier trop volumineux (max 50 MB)');
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) throw new ValidationError('Type de fichier non supporté (PDF ou Word uniquement)');

  const body = req.body as CreatePublicationInput;

  // Récupérer l'universite_id du professeur depuis le JWT ou la BDD
  const { supabaseAdmin } = await import('../config/supabase');
  const { data: prof } = await supabaseAdmin
    .from('professeurs')
    .select('universite_id, statut')
    .eq('id', user.id)
    .maybeSingle();

  if (!prof || prof.statut !== 'actif') {
    res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Compte professeur non validé' } });
    return;
  }

  const result = await pubService.createPublication({
    ...body,
    fichierBuffer: file.buffer,
    fichierOriginalName: file.originalname,
    fichierSize: file.size,
    professeurId: user.id,
    universiteId: prof.universite_id as string,
  });

  res.status(202).json(result);
}

/** GET /api/v1/publications/search */
export async function searchPublications(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as SearchPublicationsInput;
  const result = await pubService.searchPublications(query);
  res.json(result);
}

/** GET /api/v1/publications/:id */
export async function getPublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const pub = await pubService.getPublication(id, req.user?.id, req.user?.role);
  res.json(pub);
}

/** PATCH /api/v1/publications/:id */
export async function updatePublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const body = req.body as UpdatePublicationInput;
  await pubService.updatePublication(id, req.user!.id, body);
  res.json({ message: 'Publication mise à jour' });
}

/** DELETE /api/v1/publications/:id */
export async function deletePublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  await pubService.deletePublication(id, req.user!.id, req.user!.role);
  res.status(204).send();
}

/** GET /api/v1/publications/:id/download */
export async function getDownloadUrl(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const result = await pubService.getDownloadUrl(id, req.user!.id);
  res.json(result);
}

/** POST /api/v1/publications/:id/tts */
export async function requestTts(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const result = await pubService.requestTts(id);
  const status = result.ready ? 200 : 202;
  res.status(status).json(result);
}

/** POST /api/v1/publications/:id/ask */
export async function askQuestion(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { question } = req.body as AskInput;

  const { supabaseAdmin } = await import('../config/supabase');
  const { data: pub } = await supabaseAdmin
    .from('publications')
    .select('resume_ia, titre')
    .eq('id', id)
    .maybeSingle();

  if (!pub) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Publication non trouvée' } });
    return;
  }

  const { default: axios } = await import('axios');
  const { env } = await import('../config/env');

  const { data } = await axios.post<{ reponse: string }>(
    `${env.iaServiceUrl}/chat`,
    { question, contexte_document: (pub as { resume_ia?: string }).resume_ia ?? (pub as { titre: string }).titre },
    { timeout: 30_000 }
  );

  res.json({ reponse: data.reponse });
}

/** POST /api/v1/publications/:id/signaler */
export async function signalerPublication(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const { motif, description } = req.body as SignalerInput;
  await pubService.signalerPublication(id, req.user!.id, req.user!.role, motif, description);
  res.status(201).json({ message: 'Signalement enregistré' });
}

/** POST /api/v1/publications/:id/share */
export async function createShareLink(req: Request, res: Response): Promise<void> {
  const { id } = req.params as { id: string };
  const result = await pubService.createShareLink(id, req.user!.id);
  res.status(201).json(result);
}

/** GET /api/v1/feed */
export async function getFeed(req: Request, res: Response): Promise<void> {
  const { cursor, limit } = req.query as { cursor?: string; limit?: string };
  const result = await pubService.getFeed({
    requesterId: req.user!.id,
    requesterRole: req.user!.role,
    cursor,
    limit: Math.min(parseInt(limit ?? '20', 10), 50),
  });
  res.json(result);
}
