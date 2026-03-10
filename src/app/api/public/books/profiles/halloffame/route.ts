import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { HallOfFame } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const profileId = req.nextUrl.searchParams.get('profileId');

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/${profileId}/halloffame`,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.HALLOFFAME_RETRIEVE_FAILED, {
        profileId: profileId ?? undefined,
        additionalData: { status: apiResponse.status, error: errorText },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const hallOfFame = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.HALLOFFAME_RETRIEVED, {
      profileId: profileId ?? undefined,
    });
    return NextResponse.json(hallOfFame as HallOfFame);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.HALLOFFAME_RETRIEVE_FAILED, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
