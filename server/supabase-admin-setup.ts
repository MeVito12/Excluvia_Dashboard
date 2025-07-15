// Create tables using Supabase Management API
export async function createTablesViaManagementAPI() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    console.log("⚠️  SUPABASE_SERVICE_KEY not configured");
    return false;
  }

  const projectId = 'mjydrjmckcoixrnnrehm';
  
  // SQL to create all tables
  const createTablesSQL = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      business_category VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      sku VARCHAR(100),
      stock INTEGER DEFAULT 0,
      min_stock INTEGER DEFAULT 5,
      price DECIMAL(10, 2) NOT NULL,
      is_perishable BOOLEAN DEFAULT FALSE,
      manufacturing_date DATE,
      expiry_date DATE,
      business_category VARCHAR(50) NOT NULL,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Clients table
    CREATE TABLE IF NOT EXISTS clients (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      business_category VARCHAR(50) NOT NULL,
      total_spent DECIMAL(10, 2) DEFAULT 0,
      last_purchase TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      notes TEXT,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Insert sample data
    INSERT INTO users (username, password, business_category) VALUES
    ('farmacia', 'demo123', 'farmacia'),
    ('pet', 'demo123', 'pet'),
    ('medico', 'demo123', 'medico'),
    ('alimenticio', 'demo123', 'alimenticio'),
    ('vendas', 'demo123', 'vendas'),
    ('design', 'demo123', 'design'),
    ('sites', 'demo123', 'sites')
    ON CONFLICT (username) DO NOTHING;
  `;

  try {
    console.log("🔧 Attempting to create tables via Management API...");
    
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: createTablesSQL
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Tables created via Management API:", result);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ Management API failed: ${response.status} - ${errorText}`);
      return false;
    }

  } catch (error) {
    console.error("❌ Management API creation failed:", error);
    return false;
  }
}

// Alternative: Execute via SQL Editor endpoint
export async function executeSQL(sql: string) {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return false;

  try {
    // Try the SQL execution endpoint
    const response = await fetch('https://mjydrjmckcoixrnnrehm.supabase.co/rest/v1/rpc/exec', {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql })
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ SQL executed successfully:", result);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`⚠️ SQL execution: ${response.status} - ${errorText}`);
      return false;
    }

  } catch (error) {
    console.error("❌ SQL execution failed:", error);
    return false;
  }
}

// Simple table creation by attempting to query and create if needed
export async function ensureTablesExist() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return false;

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  try {
    console.log("🔍 Checking table existence...");

    // Check if users table exists
    const testResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (testResponse.ok) {
      console.log("✅ Tables already exist");
      return true;
    }

    // If table doesn't exist, try creating via Management API
    console.log("🔧 Tables don't exist, attempting creation...");
    return await createTablesViaManagementAPI();

  } catch (error) {
    console.error("❌ Table check failed:", error);
    return false;
  }
}