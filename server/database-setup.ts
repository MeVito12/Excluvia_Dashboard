// Database setup and initialization
import { db } from "./db";
import * as schema from "@shared/schema";

// SQL script to create all tables
export const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_category VARCHAR(50),
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

-- Loyalty campaigns table
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

-- WhatsApp chats table
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

-- Stock movements table
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

-- Bot configurations table
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

-- Support agents table
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

-- Integration settings table
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

-- Notification settings table
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

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    reminder_type VARCHAR(20) NOT NULL,
    reminder_time TIMESTAMP NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
`;

// Sample data insertion SQL
export const insertSampleDataSQL = `
-- Insert sample users for each business category
INSERT INTO users (username, password, business_category) VALUES
('farmacia', 'demo123', 'farmacia'),
('pet', 'demo123', 'pet'),
('medico', 'demo123', 'medico'),
('alimenticio', 'demo123', 'alimenticio'),
('vendas', 'demo123', 'vendas'),
('design', 'demo123', 'design'),
('sites', 'demo123', 'sites')
ON CONFLICT (username) DO NOTHING;

-- Insert sample products for farmacia
INSERT INTO products (name, category, sku, stock, min_stock, price, is_perishable, manufacturing_date, expiry_date, business_category, user_id) VALUES
('Paracetamol 500mg', 'medicamentos', 'PAR500', 50, 10, 8.50, true, '2024-06-01', '2026-06-01', 'farmacia', 1),
('Dipirona 500mg', 'medicamentos', 'DIP500', 30, 5, 6.80, true, '2024-05-15', '2026-05-15', 'farmacia', 1),
('Vitamina C 1g', 'suplementos', 'VITC1G', 100, 20, 15.90, true, '2024-07-01', '2026-07-01', 'farmacia', 1)
ON CONFLICT DO NOTHING;

-- Insert sample clients
INSERT INTO clients (name, email, phone, address, business_category, total_spent, last_purchase, user_id) VALUES
('Maria Silva', 'maria@email.com', '(11) 98765-4321', 'Rua das Flores, 123', 'farmacia', 150.75, '2024-12-01', 1),
('João Santos', 'joao@email.com', '(11) 99876-5432', 'Av. Principal, 456', 'farmacia', 89.90, '2024-11-28', 1)
ON CONFLICT DO NOTHING;

-- Insert sample appointments
INSERT INTO appointments (title, description, start_time, end_time, location, client_name, client_email, client_phone, status, user_id, scheduled_at) VALUES
('Consulta de rotina', 'Consulta médica de rotina', '2025-01-20 10:00:00', '2025-01-20 10:30:00', 'Consultório 1', 'Maria Silva', 'maria@email.com', '(11) 98765-4321', 'scheduled', 1, '2025-01-20 10:00:00'),
('Consulta dermatológica', 'Avaliação dermatológica', '2025-01-21 14:00:00', '2025-01-21 14:30:00', 'Consultório 2', 'João Santos', 'joao@email.com', '(11) 99876-5432', 'scheduled', 1, '2025-01-21 14:00:00')
ON CONFLICT DO NOTHING;
`;

// Function to setup database tables
export async function setupDatabase() {
  if (!db) {
    console.log("📦 Database not available, skipping table setup");
    return false;
  }

  try {
    console.log("🔧 Setting up database tables...");
    
    // Execute table creation SQL
    await db.execute(createTablesSQL);
    console.log("✅ Database tables created successfully");
    
    // Insert sample data
    await db.execute(insertSampleDataSQL);
    console.log("✅ Sample data inserted successfully");
    
    return true;
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    return false;
  }
}

// Function to verify database setup
export async function verifyDatabaseSetup() {
  if (!db) {
    return { status: 'no_database', tables: 0, records: 0 };
  }

  try {
    // Count tables
    const tablesResult = await db.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    // Count users
    const usersResult = await db.execute('SELECT COUNT(*) as count FROM users');
    
    return {
      status: 'connected',
      tables: tablesResult.rows[0]?.count || 0,
      records: usersResult.rows[0]?.count || 0
    };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}