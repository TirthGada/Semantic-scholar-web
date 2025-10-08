// src/lib/opensearch.ts
import { Client } from '@opensearch-project/opensearch';

const INDEX_NAME = 'semantic-scholar-papers';

export const client = new Client({
  node: `https://${process.env.OPENSEARCH_HOST}`,
  auth: {
    username: process.env.OPENSEARCH_USERNAME!,
    password: process.env.OPENSEARCH_PASSWORD!,
  },
  requestTimeout: 1800000,
  maxRetries: 2,
  ssl: { rejectUnauthorized: false },
});

// ---------- Helpers ----------
export function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (!isFinite(norm) || norm === 0) return vec;
  return vec.map((v) => v / norm);
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ---------- Vector-Only KNN Search ----------
export async function searchByEmbeddingVectorOnly(
  embedding: number[],
  topK = 10,
  minCosine = 0.0,
  candidatePool = 5000
) {
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error('Invalid embedding provided');
  }

  const vectorToSend = normalize(embedding);

  const knnResponse: any = await client.search({
    index: INDEX_NAME,
    body: {
      size: candidatePool,
      _source: { excludes: ['embedding'] },
      query: {
        knn: { embedding: { vector: vectorToSend, k: candidatePool } },
      },
    },
  });

  const hits = knnResponse?.body?.hits?.hits ?? [];
  if (!hits.length) return [];

  const ids = hits.map((h: any) => h._id).filter(Boolean);
  if (!ids.length) return [];

  const mgetResp: any = await client.mget({ index: INDEX_NAME, body: { ids } });
  const docs = mgetResp?.body?.docs ?? [];

  const queryNorm = normalize(embedding);
  const scored = docs
    .filter((d: any) => d?._source?.embedding)
    .map((d: any) => ({
      ...d._source,
      _id: d._id,
      _cosine_score: cosine(queryNorm, normalize(d._source.embedding)),
    }))
    .filter((s) => s._cosine_score >= minCosine)
    .sort((a, b) => b._cosine_score - a._cosine_score)
    .slice(0, topK);

  return scored;
}

// ---------- Keyword Search ----------
export async function searchByKeywords(keywords: string, size = 100) {
  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const response = await client.search({
        index: INDEX_NAME,
        body: {
          size,
          _source: { excludes: ['embedding'] },
          query: {
            bool: {
              should: [
                { multi_match: { query: keywords, fields: ['title^5', 'abstract^2', 'venue'], type: 'best_fields', fuzziness: 'AUTO' } },
                { match_phrase: { title: { query: keywords, boost: 10 } } },
              ],
              minimum_should_match: 1,
            },
          },
        },
      });
      return response.body.hits.hits.map((hit: any) => ({ ...hit._source, _score: hit._score }));
    } catch (error: any) {
      attempt++;
      if (error?.meta?.statusCode === 503 && attempt < maxAttempts) {
        console.log(`⚠️ Cluster busy, retrying in ${attempt * 2}s...`);
        await new Promise(r => setTimeout(r, attempt * 2000));
        continue;
      }
      throw error;
    }
  }

  throw new Error('Search failed after multiple attempts');
}
