import { initializeDatabase } from './database';
import { SupabaseStorage } from './supabase-storage';
import { type Storage } from '../storage';

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
          // Teste com usuário real que existe no schema
          await Promise.race([
            supabaseStorage.getUserByEmail('farmaceutico@farmaciacentral.com'),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 3000)
            )
          ]);
          
          this.storage = supabaseStorage;
          this.isSupabaseConnected = true;
          console.log('✅ Usando banco de dados Supabase');
        } catch (testError) {
          console.log('⚠️  Supabase conectado mas tabelas não encontradas');
          console.log('📋 Execute o SQL do arquivo migrations/new-schema.sql no Supabase Dashboard');
          throw new Error('Database não configurado - execute o schema SQL');
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