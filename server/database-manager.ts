// Database manager that handles Supabase connection with fallback to mock data
import { db, checkDatabaseConnection } from "./db";
import { storage as mockStorage } from "./storage";
import { DatabaseStorage } from "./storage";
import { createTablesViaRPC, insertSampleDataViaAPI } from "./create-tables-api";

class DatabaseManager {
  private storage: any = null;
  private initialized = false;
  private usingDatabase = false;

  async initialize() {
    if (this.initialized) return this.storage;

    console.log("🔄 Initializing database manager...");
    
    try {
      // Test if tables already exist via API
      const serviceKey = process.env.SUPABASE_SERVICE_KEY;
      if (serviceKey) {
        const testResponse = await fetch('https://mjydrjmckcoixrnnrehm.supabase.co/rest/v1/users?select=count', {
          method: 'GET',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json',
          }
        });

        if (testResponse.ok) {
          console.log("✅ Supabase tables exist and accessible via API");
          
          // Try direct database connection
          const connected = await checkDatabaseConnection();
          
          if (connected && db) {
            console.log("✅ Using Supabase database with live tables");
            this.storage = new DatabaseStorage();
            this.usingDatabase = true;
          } else {
            console.log("⚠️ Tables exist but direct connection failed, using mock data");
            this.storage = mockStorage;
            this.usingDatabase = false;
          }
        } else {
          console.log("📋 Supabase tables not found - manual setup required");
          console.log("📖 See SUPABASE_SETUP.md for instructions");
          this.storage = mockStorage;
          this.usingDatabase = false;
        }
      } else {
        console.log("⚠️ SUPABASE_SERVICE_KEY not configured");
        this.storage = mockStorage;
        this.usingDatabase = false;
      }
    } catch (error) {
      console.log("📦 Database initialization failed, using mock data storage");
      this.storage = mockStorage;
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
      storage: this.usingDatabase ? 'supabase' : 'mock'
    };
  }
}

export const databaseManager = new DatabaseManager();