// Database manager with fallback to in-memory storage
import { MemStorage } from "./storage";

class DatabaseManager {
  private storage: any = null;
  private initialized = false;
  private usingDatabase = false;

  async initialize() {
    if (this.initialized) return this.storage;

    console.log("🔄 Initializing database manager...");
    
    try {
      // Parse environment variables (handle malformed values with prefixes)
      const serviceKey = process.env.SUPABASE_SERVICE_KEY;
      let supabaseUrl = process.env.SUPABASE_URL || '';
      
      // Clean up malformed SUPABASE_URL if it has the prefix
      if (supabaseUrl.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
        supabaseUrl = supabaseUrl.replace('NEXT_PUBLIC_SUPABASE_URL=', '');
      }
      
      if (serviceKey && supabaseUrl) {
        console.log(`🔗 Attempting to connect to: ${supabaseUrl}`);
        
        try {
          // Test if tables already exist via API
          const testResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
            method: 'GET',
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json',
            }
          });

          if (testResponse.ok) {
            console.log("✅ Supabase tables exist and accessible");
            console.log("✅ Using Supabase database via REST API");
            const { SupabaseRestStorage } = await import("./supabase-rest-storage");
            this.storage = new SupabaseRestStorage();
            this.usingDatabase = true;
          } else {
            throw new Error("Supabase tables not accessible");
          }
        } catch (dbError) {
          console.log("⚠️ Database connection failed, falling back to in-memory storage");
          console.log("📝 Using mock data for development");
          this.storage = new MemStorage();
          this.usingDatabase = false;
        }
      } else {
        console.log("⚠️ Database credentials not configured, using in-memory storage");
        console.log("📝 Using mock data for development");
        this.storage = new MemStorage();
        this.usingDatabase = false;
      }
    } catch (error) {
      console.log("⚠️ Database initialization failed, falling back to in-memory storage");
      console.log("📝 Using mock data for development");
      this.storage = new MemStorage();
      this.usingDatabase = false;
    }

    this.initialized = true;
    return this.storage;
  }

  async getStorage() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.storage;
  }

  isUsingDatabase() {
    return this.usingDatabase;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      usingDatabase: this.usingDatabase,
      storage: this.usingDatabase ? 'supabase' : 'error'
    };
  }
}

export const databaseManager = new DatabaseManager();