/* eslint-disable @typescript-eslint/no-explicit-any */
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import bookStatus from '@/domain/bookStatus';

async function handler(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  console.log('API Route - Book ID:', id);

  try {
    const session = await getSession();
    const idToken = session?.idToken;

    if (!session || !idToken) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const apiUrl = `${baseUrl}/books/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    };

    console.log('Request details:', {
      method: request.method,
      apiUrl,
      headers: {
        ...headers,
        Authorization: 'Bearer [REDACTED]',
      },
    });

    if (request.method === 'PATCH') {
      const body = await request.json();
      const status = body.status;
      const gyCodingResponse = await fetch(apiUrl, {
        headers,
        method: 'PATCH',
        body: JSON.stringify({
          status: status,
        }),
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        console.error('PATCH Error Response:', {
          status: gyCodingResponse.status,
          statusText: gyCodingResponse.statusText,
          error: errorText,
        });
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const bookStatusData = await gyCodingResponse.json();

      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, {
        bookId: id,
        status: gyCodingResponse.status,
      });

      return NextResponse.json({
        bookStatus: bookStatusData as bookStatus,
      });
    }

    if (request.method === 'GET') {
      const gyCodingResponse = await fetch(apiUrl, {
        headers,
        method: 'GET',
      });

      if (gyCodingResponse.status === 404) {
        console.log('No hay calificaciones para este libro');
        return NextResponse.json({ bookStatus: null }, { status: 200 });
      }
      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        console.error('GET Error Response:', {
          status: gyCodingResponse.status,
          statusText: gyCodingResponse.statusText,
          error: errorText,
        });
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const bookStatusData = await gyCodingResponse.json();
      console.log(bookStatusData);
      return NextResponse.json({
        bookStatusData: bookStatusData,
      });
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/books/[id]:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export const PATCH = withApiAuthRequired(handler);
export const GET = withApiAuthRequired(handler);
