-- Schema para Sistema de Gestão Empresarial
-- Execute este SQL no Supabase Dashboard > SQL Editor

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    business_category TEXT NOT NULL,
    user_type TEXT NOT NULL DEFAULT 'regular',
    allowed_sections TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    is_perishable BOOLEAN DEFAULT FALSE,
    manufacturing_date TIMESTAMP,
    expiry_date TIMESTAMP,
    business_category TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_category TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de vendas
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    client_id INTEGER NOT NULL REFERENCES clients(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    payment_method TEXT,
    business_category TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    sale_date TIMESTAMP DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    client_id INTEGER NOT NULL REFERENCES clients(id),
    service_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL,
    notes TEXT
);

-- Tabela de campanhas de fidelidade
CREATE TABLE loyalty_campaigns (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    business_category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de conversas WhatsApp
CREATE TABLE whatsapp_chats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    business_category TEXT NOT NULL,
    client_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    last_message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

-- Tabela de movimentos de estoque
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de filiais
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT,
    business_category TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de transferências
CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    from_branch_id INTEGER NOT NULL REFERENCES branches(id),
    to_branch_id INTEGER NOT NULL REFERENCES branches(id),
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    requested_by INTEGER NOT NULL REFERENCES users(id),
    business_category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de entradas financeiras
CREATE TABLE financial_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    business_category TEXT NOT NULL,
    type TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP NOT NULL,
    payment_date TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    payment_proof TEXT,
    is_auto_generated BOOLEAN DEFAULT FALSE,
    is_boleto BOOLEAN DEFAULT FALSE,
    is_installment BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de permissões de usuário
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    section_id TEXT NOT NULL,
    can_access BOOLEAN NOT NULL DEFAULT FALSE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir usuários padrão
INSERT INTO users (email, password, name, business_category, user_type) VALUES
('farmaceutico@farmaciacentral.com', 'farm2025', 'Carlos Farmacêutico', 'farmacia', 'regular'),
('veterinario@petclinic.com', 'vet2025', 'Ana Veterinária', 'pet', 'regular'),
('medico@clinicasaude.com', 'med2025', 'Dr. Roberto Silva', 'medico', 'regular'),
('gerente@restaurantebella.com', 'rest2025', 'Maria Gerente', 'alimenticio', 'regular'),
('vendedor@comercialtech.com', 'vend2025', 'João Vendedor', 'vendas', 'regular'),
('designer@agenciacreative.com', 'design2025', 'Paula Designer', 'design', 'regular'),
('dev@webagency.com', 'web2025', 'Lucas Developer', 'sites', 'regular'),
('master@sistema.com', 'master2025', 'Administrador Sistema', 'salao', 'master');

-- Inserir algumas filiais padrão
INSERT INTO branches (name, address, phone, business_category, user_id) VALUES
('Filial Centro', 'Rua Principal, 123 - Centro', '(11) 3333-4444', 'alimenticio', 4),
('Filial Norte', 'Av. Norte, 456 - Zona Norte', '(11) 5555-6666', 'alimenticio', 4),
('Matriz', 'Rua Comercial, 789 - Centro', '(11) 7777-8888', 'vendas', 5);

-- Inserir alguns produtos de exemplo
INSERT INTO products (name, description, price, stock, min_stock, business_category, user_id) VALUES
('Dipirona 500mg', 'Analgésico e antitérmico', 12.50, 100, 20, 'farmacia', 1),
('Ração Premium Cães', 'Ração super premium para cães adultos', 89.90, 50, 10, 'pet', 2),
('Consulta Clínica', 'Consulta médica geral', 150.00, 1, 0, 'medico', 3),
('Pizza Margherita', 'Pizza tradicional com tomate e manjericão', 35.00, 1, 0, 'alimenticio', 4),
('Notebook Gamer', 'Notebook para jogos e trabalho', 2500.00, 15, 3, 'vendas', 5);

-- Inserir alguns clientes de exemplo
INSERT INTO clients (name, email, phone, business_category, user_id) VALUES
('João Silva', 'joao@email.com', '(11) 99999-1111', 'farmacia', 1),
('Maria Santos', 'maria@email.com', '(11) 99999-2222', 'pet', 2),
('Pedro Costa', 'pedro@email.com', '(11) 99999-3333', 'medico', 3),
('Ana Oliveira', 'ana@email.com', '(11) 99999-4444', 'alimenticio', 4),
('Carlos Souza', 'carlos@email.com', '(11) 99999-5555', 'vendas', 5);

-- Criar índices para melhor performance
CREATE INDEX idx_products_user_category ON products(user_id, business_category);
CREATE INDEX idx_sales_user_category ON sales(user_id, business_category);
CREATE INDEX idx_clients_user_category ON clients(user_id, business_category);
CREATE INDEX idx_financial_user_category ON financial_entries(user_id, business_category);
CREATE INDEX idx_appointments_user ON appointments(user_id);
CREATE INDEX idx_transfers_user_category ON transfers(requested_by, business_category);