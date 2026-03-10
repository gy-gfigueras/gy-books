import { sendLog, LogLevel, LogMessage } from '@/utils/logs';
import { Activity } from '@/domain/activity.model';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const profileId = req.nextUrl.pathname.split('/')[5];

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(LogLevel.ERROR, LogMessage.CONFIG_GY_API_MISSING);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/books/activity/${profileId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_LIST_RETRIEVE_FAILED, {
        profileId,
        additionalData: { status: apiResponse.status, error: errorText },
      });
      return NextResponse.json(
        { error: `API error: ${apiResponse.status}` },
        { status: apiResponse.status }
      );
    }

    const activity = await apiResponse.json();
    await sendLog(LogLevel.INFO, LogMessage.ACTIVITY_LIST_RETRIEVED, {
      profileId,
    });
    return NextResponse.json(activity as Activity[]);
  } catch (error) {
    await sendLog(LogLevel.ERROR, LogMessage.ACTIVITY_LIST_RETRIEVE_FAILED, {
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
