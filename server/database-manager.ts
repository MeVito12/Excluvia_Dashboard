// In-memory database manager for mock data
import { MemStorage } from "./storage";

class DatabaseManager {
  private storage: MemStorage;
  private initialized = false;

  constructor() {
    this.storage = new MemStorage();
  }

  async initialize() {
    if (this.initialized) return this.storage;

    console.log("🔄 Initializing in-memory storage...");
    console.log("📝 Using mock data for development");
    
    this.initialized = true;
    return this.storage;
  }

  async getStorage() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.storage;
  }

  getStatus() {
    return {
      initialized: this.initialized,
      storage: 'in-memory'
    };
  }
}

export const databaseManager = new DatabaseManager();