// Database manager that handles Supabase connection via REST API (database-only mode)
import { SupabaseRestStorage } from "./supabase-rest-storage";
import { ensureTablesExist } from "./supabase-admin-setup";

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
          console.log("❌ Supabase tables not found - database setup required");
          console.log("🎯 Execute SQL schema in Supabase Dashboard SQL Editor");
          console.log("📖 Complete instructions: MANUAL_SETUP_GUIDE.md");
          console.log("📄 SQL file to execute: supabase-complete-schema.sql");
          console.log("🔄 Restart workflow after creating tables");
          throw new Error("Database tables not found. Manual setup required.");
        }
      } else {
        console.log("❌ SUPABASE_SERVICE_KEY not configured");
        throw new Error("SUPABASE_SERVICE_KEY environment variable is required");
      }
    } catch (error) {
      console.log("❌ Database initialization failed");
      console.log("Error:", error instanceof Error ? error.message : error);
      throw error;
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