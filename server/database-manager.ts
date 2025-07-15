// Database manager that handles Supabase connection with fallback to mock data
import { db, checkDatabaseConnection } from "./db";
import { storage as mockStorage } from "./storage";
import { DatabaseStorage } from "./storage";

class DatabaseManager {
  private storage: any = null;
  private initialized = false;
  private usingDatabase = false;

  async initialize() {
    if (this.initialized) return this.storage;

    console.log("🔄 Initializing database manager...");
    
    try {
      // Try to connect to Supabase database
      const connected = await checkDatabaseConnection();
      
      if (connected && db) {
        console.log("✅ Using Supabase database");
        this.storage = new DatabaseStorage();
        this.usingDatabase = true;
      } else {
        console.log("📦 Using mock data storage for demonstration");
        this.storage = mockStorage;
        this.usingDatabase = false;
      }
    } catch (error) {
      console.log("📦 Database connection failed, using mock data storage");
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