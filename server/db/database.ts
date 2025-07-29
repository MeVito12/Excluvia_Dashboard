import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export function initializeDatabase() {
  try {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.log('⚠️  DATABASE_URL não configurada - usando dados mock');
      return null;
    }

    console.log('🔗 Conectando ao banco Supabase...');
    
    const client = postgres(connectionString, {
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    db = drizzle(client, { schema });
    
    console.log('✅ Conexão com Supabase estabelecida');
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error);
    return null;
  }
}

export function getDatabase() {
  return db;
}

export { schema };