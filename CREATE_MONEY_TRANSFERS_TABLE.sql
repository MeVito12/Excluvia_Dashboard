-- SQL para criar a tabela money_transfers no Supabase
-- Execute este comando no Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS money_transfers (
    id SERIAL PRIMARY KEY,
    from_branch_id INTEGER NOT NULL,
    to_branch_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    transfer_type TEXT NOT NULL DEFAULT 'operational',
    status TEXT NOT NULL DEFAULT 'pending',
    transfer_date TIMESTAMP DEFAULT NOW(),
    completed_date TIMESTAMP,
    approved_by INTEGER,
    notes TEXT,
    company_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir alguns dados de exemplo para teste
INSERT INTO money_transfers (from_branch_id, to_branch_id, amount, description, transfer_type, status, company_id, created_by) VALUES
(6, 7, 1500.00, 'Transferência operacional para filial Norte', 'operational', 'pending', 6, 18),
(6, 8, 2000.00, 'Investimento em nova filial Sul', 'investment', 'approved', 6, 18),
(7, 8, 750.00, 'Reembolso de despesas', 'reimbursement', 'completed', 6, 18);