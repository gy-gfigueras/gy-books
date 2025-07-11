import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { ECommands } from '@/utils/constants/ECommands';

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const SESSION = await getSession();
    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.idToken;

    const body = await req.json();
    const requestId = body.requestId;
    const command = body.command as ECommands;

    if (SESSION) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });
    }

    let apiUrl: string | null = null;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    apiUrl = `${baseUrl}/accounts/books/friends/manage?requestId=${requestId}`;
    headers = {
      ...headers,
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    if (!apiUrl) {
      throw new Error(ELogs.API_URL_NOT_DEFINED);
    }
    console.log('apiUrl', apiUrl);
    console.log('headers', headers);
    console.log('body', JSON.stringify({ command: command }));
    const gyCodingResponse = await fetch(apiUrl, {
      headers,
      method: 'POST',
      body: JSON.stringify({ command: command }),
    });

    if (!gyCodingResponse.ok) {
      const errorText = await gyCodingResponse.text();
      await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
        error: errorText,
      });
      throw new Error(`GyCoding API Error: ${errorText}`);
    }

    return NextResponse.json(204);
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
});
