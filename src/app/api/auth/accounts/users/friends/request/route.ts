import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { FriendRequest } from '@/domain/friend.model';

async function handler(req: Request) {
  try {
    const SESSION = await getSession();
    const ID_TOKEN = SESSION?.idToken;

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      return NextResponse.json(
        { error: ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED },
        { status: 500 }
      );
    }

    const apiUrl = `${baseUrl}/accounts/books/friends/request`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    if (req.method === 'POST') {
      const body = await req.json();
      const userId = body.userId;

      const gyCodingResponse = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ to: userId }),
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        return NextResponse.json(
          { error: errorText },
          { status: gyCodingResponse.status }
        );
      }

      const data = await gyCodingResponse.json();
      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, { data });
      return NextResponse.json(data);
    }

    if (req.method === 'GET') {
      const gyCodingResponse = await fetch(apiUrl, {
        method: 'GET',
        headers,
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        return NextResponse.json(
          { error: errorText },
          { status: gyCodingResponse.status }
        );
      }

      const data = await gyCodingResponse.json();
      return NextResponse.json(data as FriendRequest[]);
    }

    // Método no permitido
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/accounts/users/friends/request:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export const POST = withApiAuthRequired(handler);
export const GET = withApiAuthRequired(handler);
