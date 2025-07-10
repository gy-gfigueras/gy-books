import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { User } from '@/domain/friend.model';

async function handler(request: Request) {
  const url = new URL(request.url);
  const ID = url.pathname.split('/').pop();

  if (!ID) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const API_URL = `${baseUrl}/accounts/user/${ID}/public`;
    const HEADERS = {
      'Content-Type': 'application/json',
    };

    if (request.method === 'GET') {
      const gyCodingResponse = await fetch(API_URL, {
        headers: HEADERS,
        method: 'GET',
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        console.error('GET Error Response:', {
          status: gyCodingResponse.status,
          statusText: gyCodingResponse.statusText,
          error: errorText,
        });
        await sendLog(ELevel.ERROR, ELogs.BOOK_ERROR, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const USER = await gyCodingResponse.json();
      return NextResponse.json(USER as User);
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/accounts/users/[id]:', error);
    await sendLog(ELevel.ERROR, ELogs.BOOK_ERROR, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export const GET = handler;
