import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { User } from '@/domain/friend.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const queryParam = req.nextUrl.searchParams.get('query');

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/profiles/public?query=${queryParam}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.PROFILE_SEARCH_FAILED, {
        additionalData: {
          query: queryParam,
          status: apiResponse.status,
          error: errorText,
        },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const users = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.PROFILE_SEARCH_SUCCESS, {
      additionalData: { query: queryParam },
    });
    return NextResponse.json(users as User[]);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.PROFILE_SEARCH_FAILED, {
      additionalData: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
