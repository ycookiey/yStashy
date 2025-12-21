import { drizzle } from 'drizzle-orm/libsql';
import { createClient, type Client } from '@libsql/client/web';
import * as schema from './schema';

function getClient(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    console.warn('TURSO_DATABASE_URL is not set. Database operations will fail.');
    return null;
  }
  return createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

const client = getClient();

// Create a type-safe db object that handles missing client
export const db = client ? drizzle(client, { schema }) : null;

export function getDb() {
  if (!db) {
    throw new Error('Database is not configured. Please set TURSO_DATABASE_URL environment variable.');
  }
  return db;
}
