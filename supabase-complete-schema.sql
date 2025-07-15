-- ============================================
-- SUPABASE DATABASE SCHEMA COMPLETO
-- Sistema de Gestão Empresarial Multi-categoria
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Limpar tabelas existentes (opcional)
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS notification_settings CASCADE;
DROP TABLE IF EXISTS integration_settings CASCADE;
DROP TABLE IF EXISTS support_agents CASCADE;
DROP TABLE IF EXISTS bot_configs CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS whatsapp_chats CASCADE;
DROP TABLE IF EXISTS loyalty_campaigns CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. TABELA USERS - Usuários do sistema
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. TABELA PRODUCTS - Produtos/Inventário
-- ============================================
CREATE TABLE products (
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
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. TABELA CLIENTS - Clientes
-- ============================================
CREATE TABLE clients (
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
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. TABELA APPOINTMENTS - Agendamentos
-- ============================================
CREATE TABLE appointments (
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
    user_id INTEGER NOT NULL REFERENCES users(id),
    scheduled_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. TABELA SALES - Vendas
-- ============================================
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_ids JSONB NOT NULL,
    client_id INTEGER REFERENCES clients(id),
    client_name VARCHAR(255),
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    status VARCHAR(20) DEFAULT 'completed',
    notes TEXT,
    business_category VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    sale_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. TABELA LOYALTY_CAMPAIGNS - Campanhas de Fidelidade
-- ============================================
CREATE TABLE loyalty_campaigns (
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
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. TABELA WHATSAPP_CHATS - Conversas WhatsApp
-- ============================================
CREATE TABLE whatsapp_chats (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    client_name VARCHAR(255),
    last_message TEXT,
    message_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    business_category VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    last_activity TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. TABELA STOCK_MOVEMENTS - Movimentações de Estoque
-- ============================================
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    reference VARCHAR(100),
    user_id INTEGER REFERENCES users(id),
    movement_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 9. TABELA BOT_CONFIGS - Configurações do Bot
-- ============================================
CREATE TABLE bot_configs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    business_category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    welcome_message TEXT,
    menu_options JSONB DEFAULT '[]',
    auto_responses JSONB DEFAULT '{}',
    working_hours JSONB DEFAULT '{}',
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 10. TABELA SUPPORT_AGENTS - Agentes de Suporte
-- ============================================
CREATE TABLE support_agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'offline',
    business_category VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    specialties JSONB DEFAULT '[]',
    user_id INTEGER NOT NULL REFERENCES users(id),
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 11. TABELA INTEGRATION_SETTINGS - Configurações de Integração
-- ============================================
CREATE TABLE integration_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    platform VARCHAR(50) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 12. TABELA NOTIFICATION_SETTINGS - Configurações de Notificação
-- ============================================
CREATE TABLE notification_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
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

-- ============================================
-- 13. TABELA REMINDERS - Lembretes
-- ============================================
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(id),
    reminder_type VARCHAR(20) NOT NULL,
    reminder_time TIMESTAMP NOT NULL,
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INSERÇÃO DE DADOS DE EXEMPLO
-- ============================================

-- Usuários para cada categoria de negócio
INSERT INTO users (username, password, business_category) VALUES
('farmacia', 'demo123', 'farmacia'),
('pet', 'demo123', 'pet'),
('medico', 'demo123', 'medico'),
('alimenticio', 'demo123', 'alimenticio'),
('vendas', 'demo123', 'vendas'),
('design', 'demo123', 'design'),
('sites', 'demo123', 'sites')
ON CONFLICT (username) DO NOTHING;

-- Produtos para farmácia
INSERT INTO products (name, category, sku, stock, min_stock, price, is_perishable, manufacturing_date, expiry_date, business_category, user_id) VALUES
('Paracetamol 500mg', 'medicamentos', 'PAR500', 50, 10, 8.50, true, '2024-06-01', '2026-06-01', 'farmacia', 1),
('Dipirona 500mg', 'medicamentos', 'DIP500', 30, 5, 6.80, true, '2024-05-15', '2026-05-15', 'farmacia', 1),
('Vitamina C 1g', 'suplementos', 'VITC1G', 100, 20, 15.90, true, '2024-07-01', '2026-07-01', 'farmacia', 1),
('Protetor Solar FPS 60', 'cosmeticos', 'PROT60', 25, 5, 35.90, false, '2024-03-01', '2027-03-01', 'farmacia', 1),
('Termômetro Digital', 'equipamentos', 'TERM01', 15, 3, 45.00, false, null, null, 'farmacia', 1);

-- Produtos para pet shop
INSERT INTO products (name, category, sku, stock, min_stock, price, is_perishable, manufacturing_date, expiry_date, business_category, user_id) VALUES
('Ração Premium Cães', 'alimentacao', 'RAC001', 25, 5, 45.90, true, '2024-07-01', '2025-01-01', 'pet', 2),
('Shampoo Antipulgas', 'higiene', 'SHA001', 40, 8, 18.50, false, '2024-06-01', '2026-06-01', 'pet', 2),
('Brinquedo Mordedor', 'brinquedos', 'BRI001', 60, 10, 12.90, false, null, null, 'pet', 2),
('Coleira Identificação', 'acessorios', 'COL001', 30, 5, 25.00, false, null, null, 'pet', 2);

-- Produtos para vendas
INSERT INTO products (name, category, sku, stock, min_stock, price, is_perishable, manufacturing_date, expiry_date, business_category, user_id) VALUES
('Smartphone Galaxy A54', 'eletronicos', 'GAL054', 8, 2, 1299.00, false, '2024-01-15', null, 'vendas', 5),
('Notebook Dell Inspiron', 'informatica', 'DEL001', 5, 1, 2899.00, false, '2024-02-01', null, 'vendas', 5),
('Camiseta Polo', 'vestuario', 'POL001', 50, 10, 89.90, false, null, null, 'vendas', 5);

-- Clientes de exemplo
INSERT INTO clients (name, email, phone, address, business_category, total_spent, last_purchase, user_id) VALUES
('Maria Silva', 'maria@email.com', '(11) 98765-4321', 'Rua das Flores, 123', 'farmacia', 150.75, '2024-12-01', 1),
('João Santos', 'joao@email.com', '(11) 99876-5432', 'Av. Principal, 456', 'farmacia', 89.90, '2024-11-28', 1),
('Ana Costa Pet', 'ana@petmail.com', '(11) 97777-8888', 'Rua dos Animais, 789', 'pet', 200.50, '2024-12-05', 2),
('Carlos Empresa', 'carlos@empresa.com', '(11) 96666-7777', 'Av. Comercial, 321', 'vendas', 3500.00, '2024-12-10', 5);

-- Agendamentos de exemplo
INSERT INTO appointments (title, description, start_time, end_time, location, client_name, client_email, client_phone, status, user_id, scheduled_at) VALUES
('Consulta Farmacêutica', 'Orientação sobre medicamentos', '2025-01-20 10:00:00', '2025-01-20 10:30:00', 'Farmácia Central', 'Maria Silva', 'maria@email.com', '(11) 98765-4321', 'scheduled', 1, '2025-01-20 10:00:00'),
('Consulta Veterinária', 'Check-up do pet', '2025-01-21 14:00:00', '2025-01-21 14:30:00', 'Pet Clinic', 'Ana Costa', 'ana@petmail.com', '(11) 97777-8888', 'scheduled', 2, '2025-01-21 14:00:00'),
('Demonstração Produto', 'Apresentação smartphone', '2025-01-22 16:00:00', '2025-01-22 17:00:00', 'Loja Comercial', 'Carlos Empresa', 'carlos@empresa.com', '(11) 96666-7777', 'scheduled', 5, '2025-01-22 16:00:00');

-- Vendas de exemplo
INSERT INTO sales (product_ids, client_id, client_name, total_amount, payment_method, status, business_category, user_id, sale_date) VALUES
('[{"id": 1, "quantity": 2, "price": 8.50}]', 1, 'Maria Silva', 17.00, 'pix', 'completed', 'farmacia', 1, '2024-12-01 10:30:00'),
('[{"id": 6, "quantity": 1, "price": 45.90}]', 3, 'Ana Costa Pet', 45.90, 'cartao', 'completed', 'pet', 2, '2024-12-05 15:20:00'),
('[{"id": 11, "quantity": 1, "price": 1299.00}]', 4, 'Carlos Empresa', 1299.00, 'cartao', 'completed', 'vendas', 5, '2024-12-10 14:00:00');

-- Configurações de bot
INSERT INTO bot_configs (name, description, business_category, welcome_message, user_id) VALUES
('Bot Farmácia', 'Assistente virtual para farmácia', 'farmacia', 'Olá! Bem-vindo à Farmácia Central. Como posso ajudá-lo hoje?', 1),
('Bot Pet Shop', 'Assistente para pet shop', 'pet', 'Oi! Bem-vindo ao Pet Clinic. Em que posso ajudar seu pet?', 2),
('Bot Vendas', 'Assistente comercial', 'vendas', 'Olá! Bem-vindo à nossa loja. Posso ajudá-lo a encontrar o que procura?', 5);

-- Chats WhatsApp de exemplo
INSERT INTO whatsapp_chats (phone_number, client_name, last_message, message_count, business_category, user_id, last_activity) VALUES
('5511987654321', 'Maria Silva', 'Obrigada pelo atendimento!', 5, 'farmacia', 1, '2024-12-01 11:00:00'),
('5511977778888', 'Ana Costa', 'Quando será a próxima consulta?', 8, 'pet', 2, '2024-12-05 16:00:00'),
('5511966667777', 'Carlos Empresa', 'Preciso de mais informações sobre o produto', 12, 'vendas', 5, '2024-12-10 15:30:00');

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_products_business_category ON products(business_category);
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_expiry_date ON products(expiry_date);
CREATE INDEX idx_clients_business_category ON clients(business_category);
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_sales_business_category ON sales(business_category);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);

-- ============================================
-- COMENTÁRIOS FINAIS
-- ============================================

-- Este script cria:
-- ✅ 13 tabelas completas com relacionamentos
-- ✅ Dados de exemplo para 7 categorias de negócio
-- ✅ Índices para otimização de performance
-- ✅ Constraints e foreign keys adequadas
-- ✅ Compatibilidade total com o sistema atual

-- Após executar este SQL:
-- 1. Reinicie o workflow no Replit
-- 2. O sistema detectará automaticamente as tabelas
-- 3. Mudará de dados mock para dados reais do Supabase
-- 4. Todas as funcionalidades operarão com o banco real

SELECT 'Banco de dados criado com sucesso! 🎉' AS status;