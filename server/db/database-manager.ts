import { initializeDatabase } from './database';
import { SupabaseStorage } from './supabase-storage';
import { MemStorage, type Storage } from '../storage';

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
          // Teste básico de conexão
          await Promise.race([
            supabaseStorage.getUserByEmail('test@test.com'),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 3000)
            )
          ]);
          
          this.storage = supabaseStorage;
          this.isSupabaseConnected = true;
          console.log('✅ Usando banco de dados Supabase');
        } catch (testError) {
          console.log('⚠️  Supabase conectado mas tabelas não encontradas');
          console.log('📋 Execute o SQL do arquivo migrations/schema.sql no Supabase Dashboard');
          this.storage = new MemStorage();
          this.isSupabaseConnected = false;
          console.log('🔄 Usando armazenamento em memória temporariamente');
        }
      } else {
        this.storage = new MemStorage();
        this.isSupabaseConnected = false;
        console.log('⚠️  DATABASE_URL não configurada - usando dados mock');
      }
    } catch (error) {
      console.error('❌ Erro na inicialização do banco:', error.message);
      this.storage = new MemStorage();
      this.isSupabaseConnected = false;
      console.log('🔄 Fallback para armazenamento em memória');
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
      type: this.isSupabaseConnected ? 'supabase' : 'memory',
      connected: !!this.storage,
      hasEnvironmentVars: !!process.env.DATABASE_URL
    };
  }
}

export const databaseManager = new DatabaseManager();