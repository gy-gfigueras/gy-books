/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { headers, cookies } from 'next/headers';
import { User } from '@/domain/friend.model';

export default async function getAccountsUser(id: string): Promise<User> {
  console.log('id', id);
  if (!id) throw new Error('No username provided in formData');

  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const urlPrivate = `${protocol}://${host}/api/auth/accounts/users/${id}`;
  const urlPublic = `${protocol}://${host}/api/accounts/users/${id}`;

  // --- DEBUG: Log info before private fetch ---
  console.log('[DEBUG] Private fetch URL:', urlPrivate);

  let privateRes;
  try {
    privateRes = await fetch(urlPrivate, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store',
    });
    console.log('[DEBUG] Private fetch status:', privateRes.status);
    const privateText = await privateRes.clone().text();
    console.log('[DEBUG] Private fetch body:', privateText);

    if (privateRes.ok) {
      return JSON.parse(privateText) as User;
    }
    if (privateRes.status !== 401) {
      throw new Error(
        `Private fetch failed. Status: ${privateRes.status} - ${privateText}`
      );
    }
    // Si es 401, sigue al endpoint público
    console.log(
      '[DEBUG] Private fetch returned 401. Trying public endpoint...'
    );
  } catch (error) {
    console.warn('[DEBUG] Error in private fetch:', error);
  }

  // --- DEBUG: Log info before public fetch ---
  console.log('[DEBUG] Public fetch URL:', urlPublic);
  console.log('[DEBUG] Public fetch headers:', {
    'Content-Type': 'application/json',
  });

  const publicRes = await fetch(urlPublic, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  console.log('[DEBUG] Public fetch status:', publicRes.status);
  const publicText = await publicRes.clone().text();
  console.log('[DEBUG] Public fetch body:', publicText);

  if (publicRes.ok) {
    return JSON.parse(publicText) as User;
  }

  throw new Error(
    `Public fetch failed. Status: ${publicRes.status} - ${publicText}`
  );
}
