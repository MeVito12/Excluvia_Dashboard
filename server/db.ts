import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

// Only initialize database if DATABASE_URL is available
let db: ReturnType<typeof drizzle> | null = null;
let sql: any = null;

if (process.env.DATABASE_URL) {
  try {
    // Create Neon serverless connection
    sql = neon(process.env.DATABASE_URL);
    // Initialize Drizzle with Neon
    db = drizzle(sql, { schema });
  } catch (error) {
    console.warn("⚠️  Failed to initialize database:", error);
  }
}

export { db };

// Connection health check
export async function checkDatabaseConnection() {
  if (!sql || !db) {
    console.log("📦 No database configured, using mock data");
    return false;
  }
  
  try {
    await sql`SELECT 1`;
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

// Initialize database connection on startup
export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log("📦 DATABASE_URL not configured, using mock data for demonstration");
    return null;
  }
  
  console.log("🔗 Connecting to Supabase database...");
  const isConnected = await checkDatabaseConnection();
  
  if (isConnected) {
    console.log("🚀 Database initialized successfully");
    return db;
  } else {
    console.log("⚠️  Database connection failed, falling back to mock data");
    return null;
  }
}

export default db;