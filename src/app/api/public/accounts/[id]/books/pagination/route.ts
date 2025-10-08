import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const profileId = req.nextUrl.pathname.split('/')[4];
    const currentPage = 0;
    const size = 50;

    const apiUrl = `${process.env.GY_API}/books/${profileId}/list?page=${currentPage}&size=${size}`;
    const headers = { 'Content-Type': 'application/json' };

    const response = await fetch(apiUrl, { headers, method: 'GET' });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching books:', errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status }
      );
    }

    const USER_BOOKS = await response.json();

    return NextResponse.json(USER_BOOKS);
  } catch (error) {
    console.error('💥 Error en /api/accounts/users/[id]/books', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
