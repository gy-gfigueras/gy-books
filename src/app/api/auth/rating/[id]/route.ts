/* eslint-disable @typescript-eslint/no-explicit-any */
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { sendLog } from '@/utils/logs/logHelper';
import { ELevel } from '@/utils/constants/ELevel';
import { ELogs } from '@/utils/constants/ELogs';
import { Rating } from '@/domain/rating.model';

async function handler(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  console.log('API Route - Book ID:', id);

  try {
    const session = await getSession();
    const accessToken = session?.accessToken;

    if (!session || !accessToken) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.GY_API?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error(ELogs.ENVIROMENT_VARIABLE_NOT_DEFINED);
    }

    const apiUrl = `${baseUrl}/books/ratings/${id}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    console.log('Request details:', {
      method: request.method,
      apiUrl,
      headers: {
        ...headers,
        Authorization: 'Bearer [REDACTED]',
      },
    });

    if (request.method === 'GET') {
      const gyCodingResponse = await fetch(apiUrl, {
        headers,
        method: 'GET',
      });

      if (gyCodingResponse.status === 404) {
        console.log('No hay calificaciones para este libro');
        return NextResponse.json({ rating: null }, { status: 200 });
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

      const ratingData = await gyCodingResponse.json();

      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, {
        bookId: id,
        status: gyCodingResponse.status,
      });

      return NextResponse.json({
        rating: ratingData as Rating,
      });
    }

    if (request.method === 'POST') {
      const body = await request.json();
      console.log('POST Request body:', body);

      if (!body.rating || typeof body.rating !== 'number') {
        return NextResponse.json(
          { error: 'Rating is required and must be a number' },
          { status: 400 }
        );
      }

      const gyCodingResponse = await fetch(apiUrl, {
        headers,
        method: 'POST',
        body: JSON.stringify({
          rating: body.rating,
          startDate: body.startDate || '2025-01-01',
          endDate: body.endDate || '2025-01-26',
        }),
      });

      if (!gyCodingResponse.ok) {
        const errorText = await gyCodingResponse.text();
        console.error('POST Error Response:', {
          status: gyCodingResponse.status,
          statusText: gyCodingResponse.statusText,
          error: errorText,
        });
        await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
          error: errorText,
        });
        throw new Error(`GyCoding API Error: ${errorText}`);
      }

      const ratingData = await gyCodingResponse.json();

      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, {
        bookId: id,
        status: gyCodingResponse.status,
      });

      return NextResponse.json({
        rating: ratingData as Rating,
      });
    }

    if (request.method === 'PATCH') {
      const body = await request.json();
      console.log('POST Request body:', body);

      if (!body.rating || typeof body.rating !== 'number') {
        return NextResponse.json(
          { error: 'Rating is required and must be a number' },
          { status: 400 }
        );
      }

      const gyCodingResponse = await fetch(apiUrl, {
        headers,
        method: 'PATCH',
        body: JSON.stringify({
          rating: body.rating,
          startDate: body.startDate || '2025-01-01',
          endDate: body.endDate || '2025-01-26',
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

      const ratingData = await gyCodingResponse.json();

      await sendLog(ELevel.INFO, ELogs.PROFILE_HAS_BEEN_RECEIVED, {
        bookId: id,
        status: gyCodingResponse.status,
      });

      return NextResponse.json({
        rating: ratingData as Rating,
      });
    }

    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error in /api/auth/rating:', error);
    await sendLog(ELevel.ERROR, ELogs.PROFILE_COULD_NOT_BE_RECEIVED, {
      error: error,
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : ELogs.UNKNOWN_ERROR },
      { status: 500 }
    );
  }
}

export const GET = withApiAuthRequired(handler);
export const POST = withApiAuthRequired(handler);
export const PATCH = withApiAuthRequired(handler);
