// Direct Supabase API integration using REST API
import { createTablesSQL, insertSampleDataSQL } from "./database-setup";

// Extract Supabase project details from DATABASE_URL
function parseSupabaseURL(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const projectId = url.hostname.split('.')[1]; // Extract from db.PROJECT_ID.supabase.co
  return {
    projectId,
    password: url.password,
    supabaseUrl: `https://${projectId}.supabase.co`,
  };
}

// Execute SQL using Supabase REST API
async function executeSQL(sql: string, supabaseUrl: string, serviceKey: string) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
      body: JSON.stringify({
        sql: sql
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('SQL execution failed:', error);
    throw error;
  }
}

// Setup database using Supabase REST API
export async function setupDatabaseViaAPI() {
  if (!process.env.DATABASE_URL) {
    console.log("📦 DATABASE_URL not configured");
    return false;
  }

  try {
    const { projectId, supabaseUrl } = parseSupabaseURL(process.env.DATABASE_URL);
    
    // You'll need to provide the service role key
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;
    if (!serviceKey) {
      console.log("⚠️  SUPABASE_SERVICE_KEY not configured");
      return false;
    }

    console.log("🔧 Setting up database via Supabase API...");
    
    // Create tables
    await executeSQL(createTablesSQL, supabaseUrl, serviceKey);
    console.log("✅ Database tables created via API");
    
    // Insert sample data
    await executeSQL(insertSampleDataSQL, supabaseUrl, serviceKey);
    console.log("✅ Sample data inserted via API");
    
    return true;
  } catch (error) {
    console.error("❌ Database API setup failed:", error);
    return false;
  }
}

// Test Supabase API connection
export async function testSupabaseAPI() {
  if (!process.env.DATABASE_URL) {
    return { status: 'no_config' };
  }

  try {
    const { supabaseUrl } = parseSupabaseURL(process.env.DATABASE_URL);
    
    // Test basic API connectivity
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return {
      status: response.ok ? 'api_accessible' : 'api_error',
      httpStatus: response.status,
      url: supabaseUrl
    };
  } catch (error) {
    return {
      status: 'connection_failed',
      error: error.message
    };
  }
}