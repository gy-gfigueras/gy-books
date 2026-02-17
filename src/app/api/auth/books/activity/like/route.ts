import { auth0 } from '@/lib/auth0';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { sendLog } from '@/utils/logs/logHelper';
import { NextRequest, NextResponse } from 'next/server';

interface LikeRequestBody {
  id: string;
  profileId: string;
}

/**
 * PATCH /api/auth/books/activity/like
 *
 * Toggles a like on an activity.
 * If the user hasn't liked it → adds like.
 * If the user already liked it → removes like.
 *
 * Body: { id: string (activityId); profileId: string (currentUserProfileId) }
 */
export async function PATCH(req: NextRequest) {
  try {
    const SESSION = await auth0.getSession();

    if (!SESSION) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const USER_ID = SESSION?.user.sub;
    const ID_TOKEN = SESSION?.tokenSet?.idToken;

    if (SESSION) {
      await sendLog(ELevel.INFO, ELogs.SESSION_RECIVED, { user: USER_ID });
    }

    const body = (await req.json()) as LikeRequestBody;
    const { id, profileId } = body;

    if (!id || !profileId) {
      return NextResponse.json(
        { error: 'Missing required fields: id, profileId' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');

    if (!baseUrl) {
      await sendLog(ELevel.ERROR, ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const apiUrl = `${baseUrl}/books/activity`;
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${ID_TOKEN}`,
    };

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ id, profileId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      await sendLog(
        ELevel.ERROR,
        `Activity like toggle failed: ${response.status} - ${errorText}`
      );
      return NextResponse.json(
        { error: `Failed to toggle like: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error toggling activity like:', error);
    await sendLog(
      ELevel.ERROR,
      `Activity like error: ${(error as Error).message}`
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
