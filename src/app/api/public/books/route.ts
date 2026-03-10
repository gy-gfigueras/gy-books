import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { Book } from '@gycoding/nebula';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '50';

    if (!profileId) {
      return NextResponse.json(
        { error: 'Missing profileId param' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(
      `${baseUrl}/books/${profileId}/list?page=${page}&size=${size}`,
      {
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }
    );

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      await sendLog(LogLevel.ERROR, LogMessage.BOOK_LIST_RETRIEVE_FAILED, {
        profileId,
        additionalData: {
          status: apiResponse.status,
          error: JSON.stringify(data),
        },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    await sendLog(LogLevel.INFO, LogMessage.BOOK_LIST_RETRIEVED, {
      profileId,
      additionalData: { page, size },
    });
    return NextResponse.json(data as Book[]);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.BOOK_LIST_RETRIEVE_FAILED, {
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
