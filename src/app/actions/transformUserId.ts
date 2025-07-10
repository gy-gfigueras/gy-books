/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { UUID } from 'crypto';
import { cookies, headers } from 'next/headers';

export default async function transformUserId(userId: string): Promise<UUID> {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${protocol}://${host}/api/accounts/users/transform`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          userId: userId,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error('No ApiUser data received from server');
    }

    return data as UUID;
  } catch (error: any) {
    throw new Error(`Failed to transform user id: ${error.message}`);
  }
}
