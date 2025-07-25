import { initializeDatabase } from './database';
import { SupabaseStorage } from './supabase-storage';
import { MemStorage } from '../storage';
import type { Storage } from '../storage';

class DatabaseManager {
  private storage: Storage | null = null;
  private isSupabaseConnected = false;

  async initialize() {
    console.log('🔄 Inicializando gerenciador de banco...');
    
    try {
      // Tentar conectar com Supabase
      const db = initializeDatabase();
      
      if (db) {
        this.storage = new SupabaseStorage();
        this.isSupabaseConnected = true;
        console.log('✅ Usando banco de dados Supabase');
      } else {
        this.storage = new MemStorage();
        this.isSupabaseConnected = false;
        console.log('⚠️  Usando armazenamento em memória (mock data)');
      }
    } catch (error) {
      console.error('❌ Erro na inicialização do banco:', error);
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