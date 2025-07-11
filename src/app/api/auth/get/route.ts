/* eslint-disable @typescript-eslint/no-unused-vars */
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { User } from '@/domain/user.model';

export const GET = withApiAuthRequired(async () => {
  console.log('🔐 Entrando a GET /api/auth/user');

  const session = await getSession();
  const userId = session?.user.sub;

  if (!userId) {
    return NextResponse.json({ error: 'No user session' }, { status: 401 });
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    return NextResponse.json({ error: 'Missing Mongo URI' }, { status: 500 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db('GYAccounts');
    const collection = db.collection('Metadata');

    const userDoc = await collection.findOne({ userId });

    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userDoc.profile as User);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
});
