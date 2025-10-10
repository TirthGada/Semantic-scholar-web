import { NextRequest, NextResponse } from 'next/server';
import { searchByEmbeddingVectorOnly, searchByKeywords } from '@/lib/opensearch';

const SPECTER_URL = 'https://model-apis.semanticscholar.org/specter/v1/invoke';
const MAX_BATCH_SIZE = 16;

function chunkArray<T>(arr: T[], size: number = MAX_BATCH_SIZE): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function getEmbedding(query: string): Promise<number[]> {
  const payload = [{ paper_id: 'QUERY', title: query, abstract: '' }];
  const chunks = chunkArray(payload);

  const embeddingsById: Record<string, number[]> = {};

  for (const chunk of chunks) {
    const response = await fetch(SPECTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chunk),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SPECTER API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    data.preds.forEach((paper: any) => {
      embeddingsById[paper.paper_id] = paper.embedding;
    });
  }

  return embeddingsById['QUERY'];
}

export async function POST(request: NextRequest) {
  try {
    const { query, method, size = 100 } = await request.json();
    if (!query || !method) return NextResponse.json({ error: 'Query and method required' }, { status: 400 });

    console.log(`🔍 ${method} search: "${query}"`);
    const startTime = Date.now();

    let papers;

    if (method === 'embedding') {
      const embedding = await getEmbedding(query);
      papers = await searchByEmbeddingVectorOnly(embedding, size);
    } else {
      papers = await searchByKeywords(query, size);
    }

    const took = Date.now() - startTime;
    console.log(`✅ Found ${papers.length} papers in ${took}ms`);

    return NextResponse.json({ papers, total: papers.length, took });
  } catch (error) {
    console.error('Search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    return NextResponse.json(
      { error: 'Search failed', details: errorMessage, stack: process.env.NODE_ENV === 'development' ? errorStack : undefined },
      { status: 500 }
    );
  }
}
