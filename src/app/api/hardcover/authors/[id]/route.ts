/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { GET_AUTHOR_BY_ID_QUERY } from '@/utils/constants/Query';
import { mapRawAuthorToAuthor } from '@/mapper/mapHardcoverAuthorToAuthor';

export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const apiUrl = process.env.HARDCOVER_API_URL;
    const apiKey = process.env.HARDCOVER_API_TOKEN;

    if (!apiUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Missing Hardcover API credentials' },
        { status: 500 }
      );
    }

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ error: 'Invalid author id' }, { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        query: GET_AUTHOR_BY_ID_QUERY,
        variables: { id: parseInt(id, 10) },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Hardcover API Error (author by id):', text);
      throw new Error(`Hardcover API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'GraphQL error');
    }

    const rawAuthor = data.data?.authors?.[0];
    if (!rawAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(mapRawAuthorToAuthor(rawAuthor));
  } catch (error) {
    console.error('Error in /api/hardcover/authors/[id]:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
