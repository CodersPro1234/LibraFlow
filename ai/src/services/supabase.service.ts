import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function sauvegarderEmbedding(
  publicationId: string,
  embedding: number[],
  universiteId?: string
) {
  const { error } = await supabase
    .from('embeddings')
    .upsert({
      publication_id: publicationId,
      embedding: JSON.stringify(embedding),
      universite_id: universiteId ?? null
    })

  if (error) throw new Error(`Supabase upsert: ${error.message}`)
}

export async function chercherSimilaires(
  embedding: number[],
  publicationId: string,
  universiteId?: string,
  limite = 5
): Promise<{ publication_id: string; score: number }[]> {
  const { data, error } = await supabase
    .rpc('match_embeddings', {
      query_embedding: JSON.stringify(embedding),
      exclude_id: publicationId,
      match_count: limite
    })

  if (error) throw new Error(`Supabase RPC: ${error.message}`)

  return (data ?? []).map((row: any) => ({
    publication_id: row.publication_id,
    score: row.similarity
  }))
}

export async function obtenirEmbedding(publicationId: string): Promise<number[] | null> {
  const { data, error } = await supabase
    .from('embeddings')
    .select('embedding')
    .eq('publication_id', publicationId)
    .maybeSingle()

  if (error) throw new Error(`Supabase select embedding: ${error.message}`)
  if (!data) return null

  return typeof data.embedding === 'string' ? JSON.parse(data.embedding) : data.embedding
}