-- ====================================
-- SCHEMA COMPLETO COM HIERARQUIA EMPRESARIAL
-- Sistema: CEO → Empresa → Filial → Usuário
-- ====================================

-- Remover tabelas existentes se necessário
DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS financial_entries CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- ====================================
-- TABELAS PRINCIPAIS - HIERARQUIA
-- ====================================

-- Tabela de Empresas
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    business_category TEXT NOT NULL CHECK (business_category IN ('farmacia', 'pet', 'medico', 'alimenticio', 'vendas', 'design', 'sites')),
    cnpj TEXT,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER, -- ID do CEO que criou
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Filiais
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE, -- Código único da filial
    address TEXT,
    phone TEXT,
    email TEXT,
    is_main BOOLEAN DEFAULT FALSE, -- Filial principal
    is_active BOOLEAN DEFAULT TRUE,
    manager_id INTEGER, -- Gerente responsável
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Usuários com hierarquia completa
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN ('ceo', 'master', 'user')),
    business_category TEXT, -- Herdada da empresa/filial
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Permissões de Usuário
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section TEXT NOT NULL, -- dashboard, estoque, vendas, etc.
    can_view BOOLEAN DEFAULT TRUE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_export BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- TABELAS DE NEGÓCIO
-- ====================================

-- Tabela de Produtos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    barcode TEXT,
    manufacturing_date TIMESTAMP,
    expiry_date TIMESTAMP,
    is_perishable BOOLEAN DEFAULT FALSE,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document TEXT, -- CPF/CNPJ
    address TEXT,
    client_type TEXT DEFAULT 'individual' CHECK (client_type IN ('individual', 'company')),
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Vendas
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    client_id INTEGER REFERENCES clients(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    sale_date TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Agendamentos
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    client_id INTEGER REFERENCES clients(id),
    client_name TEXT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    type TEXT NOT NULL,
    notes TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Movimentações Financeiras
CREATE TABLE financial_entries (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    payment_method TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue')),
    due_date DATE,
    paid_date DATE,
    reference_id INTEGER, -- ID da venda/compra relacionada
    reference_type TEXT, -- 'sale', 'purchase', etc.
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Transferências entre Filiais
CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id),
    from_branch_id INTEGER NOT NULL REFERENCES branches(id),
    to_branch_id INTEGER NOT NULL REFERENCES branches(id),
    quantity INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
    transfer_date TIMESTAMP DEFAULT NOW(),
    received_date TIMESTAMP,
    notes TEXT,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ====================================
-- ÍNDICES PARA PERFORMANCE
-- ====================================

CREATE INDEX idx_companies_category ON companies(business_category);
CREATE INDEX idx_companies_active ON companies(is_active);
CREATE INDEX idx_branches_company ON branches(company_id);
CREATE INDEX idx_branches_active ON branches(is_active);
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_products_company_branch ON products(company_id, branch_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_sales_company_branch ON sales(company_id, branch_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_appointments_company_branch ON appointments(company_id, branch_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_financial_company_branch ON financial_entries(company_id, branch_id);
CREATE INDEX idx_transfers_company ON transfers(company_id);

-- ====================================
-- TRIGGERS PARA UPDATED_AT
-- ====================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_updated_at BEFORE UPDATE ON financial_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transfers_updated_at BEFORE UPDATE ON transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- DADOS INICIAIS - CEO E EMPRESAS DAS 7 CATEGORIAS
-- ====================================

-- Inserir CEO principal
INSERT INTO users (email, password, name, role, is_active, created_at) VALUES
('ceo@sistema.com', 'ceo2025', 'CEO Principal', 'ceo', TRUE, NOW());

-- Inserir empresas das 7 categorias
INSERT INTO companies (name, business_category, description, created_by, created_at) VALUES
('Farmácia Central', 'farmacia', 'Rede de farmácias especializada em medicamentos e produtos de saúde', 1, NOW()),
('Pet Clinic Veterinária', 'pet', 'Clínica veterinária completa para cães, gatos e animais exóticos', 1, NOW()),
('Clínica Médica Saúde+', 'medico', 'Centro médico multidisciplinar com especialistas em diversas áreas', 1, NOW()),
('Restaurante Bella Vista', 'alimenticio', 'Restaurante italiano com delivery e sistema de pedidos online', 1, NOW()),
('Comercial Tech Distribuidora', 'vendas', 'Distribuidora de eletrônicos, informática e produtos tecnológicos', 1, NOW()),
('Agência Creative Design', 'design', 'Agência de design gráfico, branding e identidade visual', 1, NOW()),
('Web Agency Desenvolvimento', 'sites', 'Agência especializada em desenvolvimento web e e-commerce', 1, NOW());

-- Inserir filiais principais para cada empresa
INSERT INTO branches (company_id, name, code, is_main, is_active, created_at) VALUES
(1, 'Farmácia Central - Matriz', 'FARM001', TRUE, TRUE, NOW()),
(2, 'Pet Clinic - Unidade Principal', 'PET001', TRUE, TRUE, NOW()),
(3, 'Clínica Saúde+ - Sede', 'MED001', TRUE, TRUE, NOW()),
(4, 'Bella Vista - Restaurante Principal', 'REST001', TRUE, TRUE, NOW()),
(5, 'Comercial Tech - Centro Distribuição', 'TECH001', TRUE, TRUE, NOW()),
(6, 'Creative Design - Estúdio Principal', 'DES001', TRUE, TRUE, NOW()),
(7, 'Web Agency - Escritório Matriz', 'WEB001', TRUE, TRUE, NOW());

-- Atualizar referência do CEO criador
UPDATE companies SET created_by = 1;
UPDATE branches SET manager_id = 1;

-- Inserir usuários master para cada empresa
INSERT INTO users (email, password, name, company_id, branch_id, role, business_category, created_by, created_at) VALUES
('farmaceutico@farmaciacentral.com', 'farm2025', 'Dr. Carlos Farmacêutico', 1, 1, 'master', 'farmacia', 1, NOW()),
('veterinario@petclinic.com', 'vet2025', 'Dra. Ana Veterinária', 2, 2, 'master', 'pet', 1, NOW()),
('medico@clinicasaude.com', 'med2025', 'Dr. João Médico', 3, 3, 'master', 'medico', 1, NOW()),
('chef@bellavista.com', 'rest2025', 'Chef Maria Italiana', 4, 4, 'master', 'alimenticio', 1, NOW()),
('gerente@comercialtech.com', 'tech2025', 'Pedro Gerente Comercial', 5, 5, 'master', 'vendas', 1, NOW()),
('designer@creative.com', 'design2025', 'Laura Designer Chefe', 6, 6, 'master', 'design', 1, NOW()),
('dev@webagency.com', 'web2025', 'Bruno Desenvolvedor Lead', 7, 7, 'master', 'sites', 1, NOW()),
('master@sistema.com', 'master2025', 'Master Administrador', NULL, NULL, 'master', NULL, 1, NOW());

-- Inserir permissões padrão para usuários master
INSERT INTO user_permissions (user_id, section, can_view, can_edit, can_delete, can_export)
SELECT id, section, TRUE, TRUE, TRUE, TRUE
FROM users 
CROSS JOIN (VALUES ('dashboard'), ('graficos'), ('atividade'), ('estoque'), ('agendamentos'), ('atendimento'), ('financeiro'), ('controle')) AS sections(section)
WHERE role IN ('ceo', 'master');

-- ====================================
-- DADOS DE EXEMPLO PARA DEMONSTRAÇÃO
-- ====================================

-- Produtos de exemplo para cada categoria
INSERT INTO products (name, description, category, price, stock, min_stock, company_id, branch_id, created_by, created_at) VALUES
-- Farmácia
('Dipirona 500mg', 'Analgésico e antitérmico', 'medicamentos', 12.50, 150, 20, 1, 1, 2, NOW()),
('Vitamina D3', 'Suplemento vitamínico', 'suplementos', 25.90, 80, 15, 1, 1, 2, NOW()),
-- Pet
('Ração Premium Cães', 'Ração super premium para cães adultos', 'alimentacao', 89.90, 45, 10, 2, 2, 3, NOW()),
('Vacina V10', 'Vacina múltipla para cães', 'medicamentos', 45.00, 25, 5, 2, 2, 3, NOW()),
-- Médico
('Consulta Cardiologia', 'Consulta especializada em cardiologia', 'consultas', 180.00, 999, 0, 3, 3, 4, NOW()),
('Exame ECG', 'Eletrocardiograma completo', 'exames', 85.00, 999, 0, 3, 3, 4, NOW()),
-- Alimentício
('Pizza Margherita', 'Pizza com molho de tomate, mussarela e manjericão', 'pizzas', 35.00, 999, 0, 4, 4, 5, NOW()),
('Lasanha Bolonhesa', 'Lasanha tradicional com molho bolonhesa', 'massas', 28.00, 999, 0, 4, 4, 5, NOW()),
-- Vendas
('Smartphone Samsung', 'Galaxy A54 128GB', 'eletrônicos', 1299.00, 15, 3, 5, 5, 6, NOW()),
('Notebook Lenovo', 'IdeaPad 3 i5 8GB 256GB SSD', 'informática', 2499.00, 8, 2, 5, 5, 6, NOW());

-- Clientes de exemplo
INSERT INTO clients (name, email, phone, client_type, company_id, branch_id, created_by, created_at) VALUES
('Maria Silva Santos', 'maria@email.com', '(11) 99999-1234', 'individual', 1, 1, 2, NOW()),
('João Pedro Oliveira', 'joao@email.com', '(11) 99999-5678', 'individual', 2, 2, 3, NOW()),
('Ana Costa Ferreira', 'ana@empresa.com', '(11) 99999-9012', 'company', 3, 3, 4, NOW()),
('Carlos Lima', 'carlos@email.com', '(11) 99999-3456', 'individual', 4, 4, 5, NOW()),
('Fernanda Tech LTDA', 'fernanda@tech.com', '(11) 99999-7890', 'company', 5, 5, 6, NOW());

-- Vendas de exemplo
INSERT INTO sales (product_id, client_id, quantity, unit_price, total_price, payment_method, company_id, branch_id, created_by, created_at) VALUES
(1, 1, 2, 12.50, 25.00, 'pix', 1, 1, 2, NOW()),
(3, 2, 1, 89.90, 89.90, 'cartao_credito', 2, 2, 3, NOW()),
(5, 3, 1, 180.00, 180.00, 'cartao_debito', 3, 3, 4, NOW()),
(7, 4, 2, 35.00, 70.00, 'dinheiro', 4, 4, 5, NOW()),
(9, 5, 1, 1299.00, 1299.00, 'cartao_credito', 5, 5, 6, NOW());

-- Agendamentos de exemplo
INSERT INTO appointments (title, client_id, appointment_date, start_time, type, company_id, branch_id, created_by, created_at) VALUES
('Consulta de rotina', 1, CURRENT_DATE + 1, '09:00', 'consulta', 1, 1, 2, NOW()),
('Vacinação V10', 2, CURRENT_DATE + 2, '14:30', 'vacinacao', 2, 2, 3, NOW()),
('Cardiologia - Retorno', 3, CURRENT_DATE + 3, '10:15', 'consulta', 3, 3, 4, NOW()),
('Reserva Mesa - 4 pessoas', 4, CURRENT_DATE, '19:00', 'reserva', 4, 4, 5, NOW()),
('Apresentação Produtos', 5, CURRENT_DATE + 5, '15:00', 'reuniao', 5, 5, 6, NOW());

-- Entradas financeiras automáticas das vendas
INSERT INTO financial_entries (type, amount, description, category, payment_method, status, reference_id, reference_type, company_id, branch_id, created_by, created_at) VALUES
('income', 25.00, 'Venda de Dipirona 500mg', 'vendas', 'pix', 'paid', 1, 'sale', 1, 1, 2, NOW()),
('income', 89.90, 'Venda de Ração Premium Cães', 'vendas', 'cartao_credito', 'pending', 2, 'sale', 2, 2, 3, NOW()),
('income', 180.00, 'Consulta de Cardiologia', 'servicos', 'cartao_debito', 'paid', 3, 'sale', 3, 3, 4, NOW()),
('income', 70.00, 'Venda de Pizzas', 'vendas', 'dinheiro', 'paid', 4, 'sale', 4, 4, 5, NOW()),
('income', 1299.00, 'Venda de Smartphone', 'vendas', 'cartao_credito', 'pending', 5, 'sale', 5, 5, 6, NOW());

-- Exemplo de transferência entre filiais (se houver mais filiais)
-- INSERT INTO transfers (product_id, from_branch_id, to_branch_id, quantity, company_id, created_by, created_at) VALUES
-- (1, 1, 2, 10, 1, 2, NOW());

COMMIT;