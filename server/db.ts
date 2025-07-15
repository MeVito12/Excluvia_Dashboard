import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// Only initialize database if DATABASE_URL is available
let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  try {
    // Parse DATABASE_URL to extract components
    const url = new URL(process.env.DATABASE_URL);
    
    // Create PostgreSQL connection pool with individual config
    pool = new Pool({
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: parseInt(url.port) || 5432,
      database: url.pathname.slice(1), // Remove leading slash
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    });
    
    // Initialize Drizzle with PostgreSQL
    db = drizzle(pool, { schema });
    console.log(`🔌 Database pool configured for ${url.hostname}:${url.port}`);
  } catch (error) {
    console.warn("⚠️  Failed to initialize database:", error);
  }
}

export { db };

// Connection health check
export async function checkDatabaseConnection() {
  if (!pool || !db) {
    console.log("📦 No database configured, using mock data");
    return false;
  }
  
  try {
    // Test connection with a simple query
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
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