// Script to create tables via direct SQL execution
const { execSync } = require('child_process');
const fs = require('fs');

async function createTablesViaSQL() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    console.log("⚠️  SUPABASE_SERVICE_KEY not configured");
    return false;
  }

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  // Read the schema SQL
  const schemaSQL = fs.readFileSync('./migrations/schema.sql', 'utf8');

  try {
    console.log("🔧 Executing SQL schema...");

    // Try to create a simple function first
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION setup_tables()
      RETURNS TEXT AS $$
      BEGIN
        -- Create users table
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          business_category VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        -- Insert sample data
        INSERT INTO users (username, password, business_category) VALUES
        ('farmacia', 'demo123', 'farmacia'),
        ('pet', 'demo123', 'pet'),
        ('medico', 'demo123', 'medico')
        ON CONFLICT (username) DO NOTHING;
        
        RETURN 'Setup completed successfully';
      END;
      $$ LANGUAGE plpgsql;
    `;

    // First, create the function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/setup_tables`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Tables created:", result);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`❌ SQL execution failed: ${response.status} - ${errorText}`);
      return false;
    }

  } catch (error) {
    console.error("❌ SQL setup failed:", error);
    return false;
  }
}

// Export for use in other modules
module.exports = { createTablesViaSQL };

// Run if called directly
if (require.main === module) {
  createTablesViaSQL()
    .then(success => {
      if (success) {
        console.log("✅ Database setup completed successfully");
        process.exit(0);
      } else {
        console.log("❌ Database setup failed");
        process.exit(1);
      }
    })
    .catch(error => {
      console.error("❌ Setup error:", error);
      process.exit(1);
    });
}