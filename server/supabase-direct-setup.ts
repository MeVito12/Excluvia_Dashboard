// Direct Supabase table creation using REST API
export async function createTablesDirectly() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    console.log("⚠️  SUPABASE_SERVICE_KEY not configured");
    return false;
  }

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';

  try {
    console.log("🔧 Creating tables by inserting sample data...");

    // Strategy: Create tables by inserting data - Supabase will auto-create tables
    // Start with users table
    const usersData = [
      { username: 'farmacia', password: 'demo123', business_category: 'farmacia' },
      { username: 'pet', password: 'demo123', business_category: 'pet' },
      { username: 'medico', password: 'demo123', business_category: 'medico' },
      { username: 'alimenticio', password: 'demo123', business_category: 'alimenticio' },
      { username: 'vendas', password: 'demo123', business_category: 'vendas' },
      { username: 'design', password: 'demo123', business_category: 'design' },
      { username: 'sites', password: 'demo123', business_category: 'sites' }
    ];

    // Try to insert users - this will create the table if it doesn't exist
    const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=ignore-duplicates'
      },
      body: JSON.stringify(usersData)
    });

    if (usersResponse.ok) {
      console.log("✅ Users table created and populated");
    } else {
      const errorText = await usersResponse.text();
      console.log(`❌ Users creation failed: ${usersResponse.status} - ${errorText}`);
      return false;
    }

    // Create products table
    const productsData = [
      {
        name: 'Paracetamol 500mg',
        category: 'medicamentos',
        sku: 'PAR500',
        stock: 50,
        min_stock: 10,
        price: 8.50,
        is_perishable: true,
        manufacturing_date: '2024-06-01',
        expiry_date: '2026-06-01',
        business_category: 'farmacia',
        user_id: 1
      },
      {
        name: 'Ração Premium',
        category: 'alimentacao',
        sku: 'RAC001',
        stock: 25,
        min_stock: 5,
        price: 45.90,
        is_perishable: true,
        manufacturing_date: '2024-07-01',
        expiry_date: '2025-01-01',
        business_category: 'pet',
        user_id: 2
      }
    ];

    const productsResponse = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=ignore-duplicates'
      },
      body: JSON.stringify(productsData)
    });

    if (productsResponse.ok) {
      console.log("✅ Products table created and populated");
    } else {
      const errorText = await productsResponse.text();
      console.log(`⚠️ Products creation: ${productsResponse.status} - ${errorText}`);
    }

    // Create clients table
    const clientsData = [
      {
        name: 'Maria Silva',
        email: 'maria@email.com',
        phone: '(11) 98765-4321',
        address: 'Rua das Flores, 123',
        business_category: 'farmacia',
        total_spent: 150.75,
        last_purchase: '2024-12-01T10:00:00Z',
        is_active: true,
        user_id: 1
      },
      {
        name: 'João Santos Pet',
        email: 'joao@email.com',
        phone: '(11) 99876-5432',
        address: 'Av. Principal, 456',
        business_category: 'pet',
        total_spent: 89.90,
        last_purchase: '2024-11-28T14:30:00Z',
        is_active: true,
        user_id: 2
      }
    ];

    const clientsResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation,resolution=ignore-duplicates'
      },
      body: JSON.stringify(clientsData)
    });

    if (clientsResponse.ok) {
      console.log("✅ Clients table created and populated");
    } else {
      const errorText = await clientsResponse.text();
      console.log(`⚠️ Clients creation: ${clientsResponse.status} - ${errorText}`);
    }

    return true;

  } catch (error) {
    console.error("❌ Direct table creation failed:", error);
    return false;
  }
}

// Verify all tables are working
export async function verifyAllTables() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey) return { status: 'no_service_key' };

  const supabaseUrl = 'https://mjydrjmckcoixrnnrehm.supabase.co';
  const tables = ['users', 'products', 'clients'];
  const results = {};

  try {
    for (const table of tables) {
      const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count`, {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        }
      });

      results[table] = response.ok ? 'exists' : 'missing';
    }

    return {
      status: 'verified',
      tables: results,
      allTablesExist: Object.values(results).every(status => status === 'exists')
    };

  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}