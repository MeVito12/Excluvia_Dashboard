// Create tables via Supabase RPC (Remote Procedure Call)
export async function createTablesViaRPC() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    console.log("⚠️  SUPABASE_SERVICE_KEY not configured");
    return false;
  }

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  // Create a stored procedure to execute our schema
  const createSchemaFunction = `
    CREATE OR REPLACE FUNCTION create_business_schema()
    RETURNS TEXT AS $$
    BEGIN
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

      -- Appointments table
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        location VARCHAR(255),
        client_name VARCHAR(255),
        client_email VARCHAR(255),
        client_phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'scheduled',
        user_id INTEGER NOT NULL,
        scheduled_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- Sales table
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        product_ids JSONB NOT NULL,
        client_id INTEGER,
        client_name VARCHAR(255),
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'cash',
        status VARCHAR(20) DEFAULT 'completed',
        notes TEXT,
        business_category VARCHAR(50) NOT NULL,
        user_id INTEGER NOT NULL,
        sale_date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- All other tables...
      CREATE TABLE IF NOT EXISTS loyalty_campaigns (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        discount_percentage INTEGER,
        discount_amount DECIMAL(10, 2),
        min_purchase_amount DECIMAL(10, 2),
        valid_from TIMESTAMP NOT NULL,
        valid_until TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        target_audience VARCHAR(20) DEFAULT 'all',
        business_category VARCHAR(50) NOT NULL,
        message_template TEXT NOT NULL,
        sent_count INTEGER DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS whatsapp_chats (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL,
        client_name VARCHAR(255),
        last_message TEXT,
        message_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        business_category VARCHAR(50) NOT NULL,
        user_id INTEGER NOT NULL,
        last_activity TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS stock_movements (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL,
        quantity INTEGER NOT NULL,
        reason VARCHAR(255) NOT NULL,
        reference VARCHAR(100),
        user_id INTEGER,
        movement_date TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bot_configs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        business_category VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        welcome_message TEXT,
        menu_options JSONB DEFAULT '[]',
        auto_responses JSONB DEFAULT '{}',
        working_hours JSONB DEFAULT '{}',
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS support_agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(20),
        status VARCHAR(20) DEFAULT 'offline',
        business_category VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        specialties JSONB DEFAULT '[]',
        user_id INTEGER NOT NULL,
        last_seen TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS integration_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        platform VARCHAR(50) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT FALSE,
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS notification_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        email_enabled BOOLEAN DEFAULT FALSE,
        telegram_enabled BOOLEAN DEFAULT FALSE,
        whatsapp_enabled BOOLEAN DEFAULT FALSE,
        email_address VARCHAR(255),
        telegram_chat_id VARCHAR(100),
        whatsapp_number VARCHAR(20),
        default_reminder_time INTEGER DEFAULT 60,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER NOT NULL,
        reminder_type VARCHAR(20) NOT NULL,
        reminder_time TIMESTAMP NOT NULL,
        sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      RETURN 'Tables created successfully';
    END;
    $$ LANGUAGE plpgsql;
  `;

  try {
    console.log("🔧 Creating schema function...");
    
    // First, create the function
    const createFunctionResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/create_business_schema`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (!createFunctionResponse.ok) {
      const errorText = await createFunctionResponse.text();
      console.log(`❌ Function creation failed: ${createFunctionResponse.status} - ${errorText}`);
      return false;
    }

    const result = await createFunctionResponse.json();
    console.log("✅ Tables created:", result);
    return true;

  } catch (error) {
    console.error("❌ Table creation failed:", error);
    return false;
  }
}

// Insert sample data
export async function insertSampleDataViaAPI() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return false;

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  try {
    // Insert sample users
    const usersData = [
      { username: 'farmacia', password: 'demo123', business_category: 'farmacia' },
      { username: 'pet', password: 'demo123', business_category: 'pet' },
      { username: 'medico', password: 'demo123', business_category: 'medico' },
      { username: 'alimenticio', password: 'demo123', business_category: 'alimenticio' },
      { username: 'vendas', password: 'demo123', business_category: 'vendas' },
      { username: 'design', password: 'demo123', business_category: 'design' },
      { username: 'sites', password: 'demo123', business_category: 'sites' }
    ];

    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates'
      },
      body: JSON.stringify(usersData)
    });

    if (usersResponse.ok) {
      console.log("✅ Sample users inserted");
      return true;
    } else {
      const errorText = await usersResponse.text();
      console.log(`⚠️ Users insertion: ${usersResponse.status} - ${errorText}`);
      return false;
    }

  } catch (error) {
    console.error("❌ Sample data insertion failed:", error);
    return false;
  }
}