import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let database: any = null;

export function getDatabase() {
  if (!database) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Create postgres client
    const client = postgres(connectionString, {
      ssl: connectionString.includes('supabase') ? 'require' : false,
      max: 20,
      idle_timeout: 20,
      connect_timeout: 60,
    });

    // Create drizzle instance
    database = drizzle(client, { schema });
  }

  return database;
}

export { schema };