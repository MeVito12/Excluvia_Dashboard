import { initializeDatabase } from './database';
import { SupabaseStorage, type Storage } from '../storage';
import { sql } from 'drizzle-orm';

class DatabaseManager {
  private storage: Storage | null = null;
  private isSupabaseConnected = false;

  async initialize() {
    console.log('🔄 Inicializando gerenciador de banco...');
    
    try {
      // Tentar conectar com Supabase
      const db = initializeDatabase();
      
      if (db) {
        // Teste de conectividade com timeout
        const supabaseStorage = new SupabaseStorage();
        
        try {
          // Usar conexão Drizzle direta para teste mais simples
          const testQuery = await db.execute(sql`SELECT 1 as test`);
          if (testQuery && testQuery.length > 0) {
            console.log('✅ Supabase: Conexão e tabelas verificadas com sucesso');
            this.storage = supabaseStorage;
            this.isSupabaseConnected = true;
            console.log('✅ Usando banco de dados Supabase');
          } else {
            throw new Error('Teste de conectividade falhou');
          }
        } catch (testError) {
          console.log('⚠️  Erro no teste:', testError);
          throw new Error('Database não configurado - consulte a documentação');
        }
      } else {
        throw new Error('DATABASE_URL não configurada');
      }
    } catch (error: any) {
      console.error('❌ Erro na inicialização do banco:', error.message);
      throw new Error('Database não configurado - consulte a documentação');
    }
  }

  getStorage(): Storage {
    if (!this.storage) {
      throw new Error('Storage não foi inicializado');
    }
    return this.storage;
  }

  isUsingSupabase(): boolean {
    return this.isSupabaseConnected;
  }

  getStatus() {
    return {
      type: 'supabase',
      connected: !!this.storage && this.isSupabaseConnected,
      hasEnvironmentVars: !!process.env.DATABASE_URL
    };
  }
}

export const databaseManager = new DatabaseManager();