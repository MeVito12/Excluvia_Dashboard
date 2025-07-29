-- Schema de Hierarquia Empresarial
-- Execute este SQL no Supabase Dashboard > SQL Editor para implementar hierarquia

-- 1. Tabela de Empresas
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    business_category TEXT NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_by INTEGER NOT NULL, -- Referência ao super_admin que criou
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Atualizar tabela de filiais para vincular à empresa
ALTER TABLE branches ADD COLUMN company_id INTEGER REFERENCES companies(id);
ALTER TABLE branches ADD COLUMN manager_id INTEGER; -- Será referência ao user depois

-- 3. Atualizar tabela de usuários para sistema hierárquico
ALTER TABLE users ADD COLUMN company_id INTEGER REFERENCES companies(id);
ALTER TABLE users ADD COLUMN branch_id INTEGER REFERENCES branches(id);
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN manager_id INTEGER; -- Auto-referência para hierarquia
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN created_by INTEGER; -- Quem criou este usuário

-- Atualizar user_type para nova hierarquia
ALTER TABLE users ALTER COLUMN user_type TYPE TEXT;
UPDATE users SET user_type = 'super_admin' WHERE user_type = 'master';
UPDATE users SET user_type = 'employee' WHERE user_type = 'regular';

-- 4. Tabela de Papéis e Permissões
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role_type TEXT NOT NULL CHECK (role_type IN ('super_admin', 'company_admin', 'branch_manager', 'employee')),
    company_id INTEGER REFERENCES companies(id),
    branch_id INTEGER REFERENCES branches(id),
    permissions TEXT[] DEFAULT '{}',
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_manage_branches BOOLEAN DEFAULT FALSE,
    can_view_reports BOOLEAN DEFAULT FALSE,
    can_manage_inventory BOOLEAN DEFAULT FALSE,
    assigned_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabela de Hierarquia Organizacional
CREATE TABLE user_hierarchy (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    manager_id INTEGER NOT NULL REFERENCES users(id),
    company_id INTEGER NOT NULL REFERENCES companies(id),
    branch_id INTEGER REFERENCES branches(id),
    level INTEGER NOT NULL DEFAULT 4, -- 1=super_admin, 2=company_admin, 3=branch_manager, 4=employee
    can_manage_level INTEGER NOT NULL DEFAULT 4, -- Até que nível pode gerenciar
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, company_id) -- Um usuário só pode ter uma posição por empresa
);

-- 6. Adicionar referências faltantes
ALTER TABLE branches ADD CONSTRAINT fk_branch_manager 
    FOREIGN KEY (manager_id) REFERENCES users(id);

ALTER TABLE users ADD CONSTRAINT fk_user_manager 
    FOREIGN KEY (manager_id) REFERENCES users(id);

-- 7. Inserir dados iniciais para demonstração

-- Criar empresas de exemplo
INSERT INTO companies (name, business_category, description, address, phone, email, created_by) VALUES
('Farmácia Central LTDA', 'farmacia', 'Rede de farmácias especializada em medicamentos', 'Rua das Flores, 123, Centro', '(11) 3333-4444', 'contato@farmaciacentral.com', 1),
('Pet Clinic Veterinária', 'pet', 'Clínica veterinária com serviços completos', 'Av. dos Animais, 456, Vila Nova', '(11) 5555-6666', 'atendimento@petclinic.com', 1),
('Clínica Saúde Médica', 'medico', 'Clínica médica com especialidades diversas', 'Rua da Saúde, 789, Jardins', '(11) 7777-8888', 'recepcao@clinicasaude.com', 1),
('Restaurante Bella Vista', 'alimenticio', 'Restaurante italiano com pratos tradicionais', 'Rua Gourmet, 321, Bela Vista', '(11) 9999-0000', 'reservas@bellavista.com', 1),
('Comercial Tech Distribuidora', 'vendas', 'Distribuidora de produtos tecnológicos', 'Av. Tecnologia, 654, Tech Park', '(11) 1111-2222', 'vendas@comercialtech.com', 1),
('Agência Creative Design', 'design', 'Agência de design gráfico e branding', 'Rua Criativa, 987, Vila Artística', '(11) 3333-5555', 'contato@creative.com', 1),
('Web Agency Desenvolvimento', 'sites', 'Agência especializada em desenvolvimento web', 'Av. Digital, 147, Tech Center', '(11) 7777-9999', 'projetos@webagency.com', 1);

-- Criar filiais para algumas empresas
INSERT INTO branches (name, address, phone, business_category, user_id, company_id, manager_id) VALUES
('Farmácia Central - Matriz', 'Rua das Flores, 123, Centro', '(11) 3333-4444', 'farmacia', 2, 1, NULL),
('Farmácia Central - Filial Norte', 'Av. Norte, 789, Zona Norte', '(11) 3333-4445', 'farmacia', 2, 1, NULL),
('Pet Clinic - Unidade Principal', 'Av. dos Animais, 456, Vila Nova', '(11) 5555-6666', 'pet', 3, 2, NULL),
('Comercial Tech - Centro de Distribuição', 'Av. Tecnologia, 654, Tech Park', '(11) 1111-2222', 'vendas', 6, 5, NULL),
('Comercial Tech - Filial Sul', 'Rua Sul, 852, Zona Sul', '(11) 1111-2223', 'vendas', 6, 5, NULL);

-- Atualizar usuários existentes com hierarquia
UPDATE users SET 
    company_id = CASE 
        WHEN business_category = 'farmacia' THEN 1
        WHEN business_category = 'pet' THEN 2
        WHEN business_category = 'medico' THEN 3
        WHEN business_category = 'alimenticio' THEN 4
        WHEN business_category = 'vendas' THEN 5
        WHEN business_category = 'design' THEN 6
        WHEN business_category = 'sites' THEN 7
        ELSE NULL
    END,
    branch_id = CASE 
        WHEN business_category = 'farmacia' THEN 1
        WHEN business_category = 'pet' THEN 3
        WHEN business_category = 'vendas' THEN 4
        ELSE NULL
    END,
    created_by = 1,
    phone = CASE 
        WHEN business_category = 'farmacia' THEN '(11) 99999-1111'
        WHEN business_category = 'pet' THEN '(11) 99999-2222'
        WHEN business_category = 'medico' THEN '(11) 99999-3333'
        WHEN business_category = 'alimenticio' THEN '(11) 99999-4444'
        WHEN business_category = 'vendas' THEN '(11) 99999-5555'
        WHEN business_category = 'design' THEN '(11) 99999-6666'
        WHEN business_category = 'sites' THEN '(11) 99999-7777'
        ELSE NULL
    END
WHERE id > 1; -- Não atualizar o super admin

-- Definir hierarquia para usuários
INSERT INTO user_hierarchy (user_id, manager_id, company_id, branch_id, level, can_manage_level) VALUES
-- Usuário farmácia como company_admin da empresa 1
(2, 1, 1, 1, 2, 4), -- Farmacêutico gerencia até employees
-- Usuário pet como company_admin da empresa 2  
(3, 1, 2, 3, 2, 4), -- Veterinário gerencia até employees
-- Usuário médico como company_admin da empresa 3
(4, 1, 3, NULL, 2, 4), -- Médico gerencia até employees
-- Usuário alimenticio como company_admin da empresa 4
(5, 1, 4, NULL, 2, 4), -- Chef gerencia até employees
-- Usuário vendas como company_admin da empresa 5
(6, 1, 5, 4, 2, 4), -- Vendedor gerencia até employees
-- Usuário design como company_admin da empresa 6
(7, 1, 6, NULL, 2, 4), -- Designer gerencia até employees
-- Usuário sites como company_admin da empresa 7
(8, 1, 7, NULL, 2, 4); -- Dev gerencia até employees

-- Atualizar manager_id nas filiais
UPDATE branches SET manager_id = CASE 
    WHEN company_id = 1 THEN 2 -- Farmacêutico gerencia filiais da farmácia
    WHEN company_id = 2 THEN 3 -- Veterinário gerencia pet clinic
    WHEN company_id = 5 AND id = 4 THEN 6 -- Vendedor gerencia centro de distribuição
    WHEN company_id = 5 AND id = 5 THEN 6 -- Vendedor gerencia filial sul
    ELSE NULL
END;

-- Atualizar manager_id dos usuários (definir hierarquia)
UPDATE users SET manager_id = 1 WHERE id > 1 AND user_type = 'employee'; -- Todos reportam ao super admin por enquanto

-- Criar papéis padrão para cada usuário
INSERT INTO user_roles (user_id, role_type, company_id, branch_id, permissions, can_manage_users, can_manage_branches, can_view_reports, can_manage_inventory, assigned_by) VALUES
-- Super admin (master) - controle total
(1, 'super_admin', NULL, NULL, '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro,controle}', TRUE, TRUE, TRUE, TRUE, 1),
-- Company admins - controle da empresa
(2, 'company_admin', 1, 1, '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro}', TRUE, TRUE, TRUE, TRUE, 1),
(3, 'company_admin', 2, 3, '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro}', TRUE, TRUE, TRUE, TRUE, 1),
(4, 'company_admin', 3, NULL, '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro}', TRUE, FALSE, TRUE, TRUE, 1),
(5, 'company_admin', 4, NULL, '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro}', TRUE, FALSE, TRUE, TRUE, 1),
(6, 'company_admin', 5, 4, '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro}', TRUE, TRUE, TRUE, TRUE, 1),
(7, 'company_admin', 6, NULL, '{dashboard,graficos,atividade,agendamentos,atendimento}', TRUE, FALSE, TRUE, FALSE, 1),
(8, 'company_admin', 7, NULL, '{dashboard,graficos,atividade,agendamentos,atendimento}', TRUE, FALSE, TRUE, FALSE, 1);

-- Atualizar array de permissões dos usuários baseado nos papéis
UPDATE users SET allowed_sections = CASE 
    WHEN id = 1 THEN '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro,controle}'
    WHEN id IN (7, 8) THEN '{dashboard,graficos,atividade,agendamentos,atendimento}' -- Design e sites sem estoque
    ELSE '{dashboard,graficos,atividade,agendamentos,estoque,atendimento,financeiro}'
END;

-- Atualizar transferências para usar nova estrutura de filiais
UPDATE transfers SET 
    from_branch_id = CASE 
        WHEN business_category = 'farmacia' THEN 1
        WHEN business_category = 'vendas' THEN 4
        ELSE from_branch_id
    END,
    to_branch_id = CASE 
        WHEN business_category = 'farmacia' THEN 2
        WHEN business_category = 'vendas' THEN 5
        ELSE to_branch_id
    END
WHERE from_branch_id IS NOT NULL;

-- Criar índices para performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_user_hierarchy_company ON user_hierarchy(company_id);
CREATE INDEX idx_user_hierarchy_manager ON user_hierarchy(manager_id);
CREATE INDEX idx_user_roles_company ON user_roles(company_id);
CREATE INDEX idx_branches_company ON branches(company_id);

-- Views úteis para consultas

-- View para ver hierarquia completa
CREATE VIEW v_user_hierarchy AS
SELECT 
    u.id as user_id,
    u.name as user_name,
    u.email,
    u.user_type,
    c.name as company_name,
    b.name as branch_name,
    m.name as manager_name,
    uh.level,
    ur.permissions
FROM users u
LEFT JOIN companies c ON u.company_id = c.id
LEFT JOIN branches b ON u.branch_id = b.id
LEFT JOIN users m ON u.manager_id = m.id
LEFT JOIN user_hierarchy uh ON u.id = uh.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id;

-- View para transferências com informações completas  
CREATE VIEW v_transfers_complete AS
SELECT 
    t.*,
    p.name as product_name,
    fb.name as from_branch_name,
    tb.name as to_branch_name,
    fc.name as from_company_name,
    tc.name as to_company_name,
    u.name as requested_by_name
FROM transfers t
JOIN products p ON t.product_id = p.id
JOIN branches fb ON t.from_branch_id = fb.id
JOIN branches tb ON t.to_branch_id = tb.id
JOIN companies fc ON fb.company_id = fc.id
JOIN companies tc ON tb.company_id = tc.id
JOIN users u ON t.requested_by = u.id;

COMMENT ON TABLE companies IS 'Tabela de empresas do sistema';
COMMENT ON TABLE user_roles IS 'Papéis e permissões dos usuários';
COMMENT ON TABLE user_hierarchy IS 'Hierarquia organizacional dos usuários';
COMMENT ON VIEW v_user_hierarchy IS 'View com hierarquia completa dos usuários';
COMMENT ON VIEW v_transfers_complete IS 'View com informações completas das transferências';