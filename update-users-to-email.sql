-- ============================================
-- MIGRAÇÃO USERS: USERNAME → EMAIL
-- Execute este SQL para atualizar apenas a tabela users
-- ============================================

-- Passo 1: Adicionar novas colunas (email e name)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Passo 2: Migrar dados existentes baseado no username
UPDATE users SET 
    email = CASE username
        WHEN 'farmacia' THEN 'farmaceutico@farmaciacentral.com'
        WHEN 'pet' THEN 'veterinario@petclinic.com'
        WHEN 'medico' THEN 'medico@clinicasaude.com'
        WHEN 'alimenticio' THEN 'chef@restaurante.com'
        WHEN 'vendas' THEN 'vendedor@comercial.com'
        WHEN 'design' THEN 'designer@agencia.com'
        WHEN 'sites' THEN 'dev@webagency.com'
        ELSE username || '@demo.com'
    END,
    name = CASE username
        WHEN 'farmacia' THEN 'Dr. Fernando Farmacêutico'
        WHEN 'pet' THEN 'Dr. Carlos Veterinário'
        WHEN 'medico' THEN 'Dra. Ana Médica'
        WHEN 'alimenticio' THEN 'Chef Roberto'
        WHEN 'vendas' THEN 'João Vendedor'
        WHEN 'design' THEN 'Maria Designer'
        WHEN 'sites' THEN 'Pedro Desenvolvedor'
        ELSE 'Usuário ' || username
    END,
    password = CASE username
        WHEN 'farmacia' THEN 'farm2025'
        WHEN 'pet' THEN 'vet2025'
        WHEN 'medico' THEN 'med2025'
        WHEN 'alimenticio' THEN 'chef2025'
        WHEN 'vendas' THEN 'venda2025'
        WHEN 'design' THEN 'design2025'
        WHEN 'sites' THEN 'web2025'
        ELSE password
    END
WHERE email IS NULL OR name IS NULL;

-- Passo 3: Definir email como NOT NULL e UNIQUE
ALTER TABLE users 
ALTER COLUMN email SET NOT NULL,
ALTER COLUMN name SET NOT NULL;

-- Passo 4: Criar índice único no email
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);

-- Passo 5: Remover constraint de username (se existir)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;

-- Passo 6: Remover coluna username
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- Passo 7: Verificar resultado final
SELECT 
    'Migração concluída com sucesso!' as status,
    count(*) as total_users,
    string_agg(email, ', ') as emails_migrados
FROM users;

-- ============================================
-- RESULTADO ESPERADO:
-- ✅ Coluna username removida
-- ✅ Coluna email adicionada (unique, not null)
-- ✅ Coluna name adicionada (not null)
-- ✅ Senhas atualizadas para novo formato
-- ✅ 7 usuários migrados com emails profissionais
-- ============================================