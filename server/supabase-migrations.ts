// Supabase table creation via SQL Editor API
export async function createSupabaseTables() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    console.log("⚠️  SUPABASE_SERVICE_KEY not configured");
    return false;
  }

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  try {
    // First, check if tables already exist by querying users table
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (testResponse.ok) {
      console.log("✅ Database tables already exist");
      return true;
    }

    // If tables don't exist (404), we need to create them via SQL
    if (testResponse.status === 406 || testResponse.status === 404) {
      console.log("🔧 Creating database tables...");
      
      // Create users table first
      const createUsersSQL = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          business_category VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Note: In practice, you would use the Supabase SQL Editor in the dashboard
      // or use the management API. For now, let's just attempt basic table creation
      console.log("📝 Manual table creation required via Supabase Dashboard");
      console.log("SQL Editor instructions:");
      console.log("1. Go to your Supabase project dashboard");
      console.log("2. Navigate to SQL Editor");
      console.log("3. Run the schema.sql file located in migrations/schema.sql");
      
      return false;
    }

    console.log(`❌ Unexpected response: ${testResponse.status}`);
    return false;

  } catch (error) {
    console.error("❌ Table creation failed:", error);
    return false;
  }
}

// Test if tables exist and data is accessible
export async function verifySupabaseTables() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    return { status: 'no_service_key' };
  }

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  try {
    // Test users table
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (usersResponse.ok) {
      const userData = await usersResponse.json();
      
      // Test products table
      const productsResponse = await fetch(`${supabaseUrl}/rest/v1/products?select=count`, {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        }
      });

      return {
        status: 'tables_exist',
        users_count: userData.length || 0,
        products_accessible: productsResponse.ok,
        message: 'Database tables are accessible'
      };
    }

    return {
      status: 'tables_missing',
      http_status: usersResponse.status,
      message: 'Database tables need to be created'
    };

  } catch (error) {
    return {
      status: 'connection_error',
      error: error.message
    };
  }
}