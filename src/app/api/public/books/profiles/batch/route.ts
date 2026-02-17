import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';

const MAX_BATCH_SIZE = 50;

/**
 * Endpoint batch para obtener múltiples perfiles en una sola petición.
 * Evita el problema N+1 al resolver varios profileIds de una vez.
 *
 * POST /api/public/books/profiles/batch
 * Body: { ids: string[] }
 *
 * Optimizaciones:
 * - Deduplica IDs antes de hacer fetch
 * - Promise.allSettled para tolerancia a fallos parciales
 * - Perfiles null para IDs que fallen (no rompe el batch entero)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty ids array' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      return NextResponse.json(
        { error: ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED },
        { status: 500 }
      );
    }

    // Deduplicar IDs y limitar el tamaño del batch
    const uniqueIds = [...new Set<string>(ids)].slice(0, MAX_BATCH_SIZE);

    const results = await Promise.allSettled(
      uniqueIds.map(async (id: string) => {
        const response = await fetch(`${baseUrl}/books/profiles/${id}`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'GET',
        });

        if (!response.ok) {
          return { id, profile: null };
        }

        const profile = await response.json();
        return { id, profile };
      })
    );

    const profilesMap: Record<string, unknown> = {};

    for (const result of results) {
      if (result.status === 'fulfilled') {
        profilesMap[result.value.id] = result.value.profile;
      }
    }

    return NextResponse.json(profilesMap);
  } catch (error) {
    console.error('[profiles/batch] Error:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
