# Guia de Configuração Manual do Supabase

## Situação Atual

✅ **API Supabase**: Conectada e funcionando  
✅ **Autenticação**: Service key configurada  
⏳ **Tabelas**: Precisam ser criadas manualmente  

## Instrução de Setup (Obrigatório)

### 1. Acesse o Dashboard do Supabase
- URL: https://supabase.com/dashboard/projects
- Projeto: `mjydrjmckcoixrnnrehm`

### 2. Execute o SQL no Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Copie e cole o conteúdo completo do arquivo `migrations/schema.sql`
4. Clique em **"Run"** para executar

### 3. Verificação
Após executar, você deve ver:
- ✅ 13 tabelas criadas
- ✅ Dados de exemplo inseridos
- ✅ Confirmação "Success. No rows returned"

### 4. Ativar Sistema
Após criar as tabelas:
1. **Reinicie o workflow** no Replit
2. O sistema detectará automaticamente as tabelas
3. Mudará de dados mock para dados reais do Supabase

## Status de Verificação

Execute este comando para verificar:
```bash
curl -s http://localhost:5000/api/health
```

**Antes do setup**: `"usingDatabase": false`  
**Após o setup**: `"usingDatabase": true`

## SQL para Execução Manual

Você pode copiar diretamente do arquivo `migrations/schema.sql` ou usar este SQL mínimo:

```sql
-- Tabela principal
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    business_category VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dados de exemplo
INSERT INTO users (username, password, business_category) VALUES
('farmacia', 'demo123', 'farmacia'),
('pet', 'demo123', 'pet'),
('medico', 'demo123', 'medico'),
('alimenticio', 'demo123', 'alimenticio'),
('vendas', 'demo123', 'vendas'),
('design', 'demo123', 'design'),
('sites', 'demo123', 'sites')
ON CONFLICT (username) DO NOTHING;
```

## Após o Setup

O sistema automaticamente:
- Detecta as novas tabelas
- Muda para o banco de dados real
- Mantém todos os recursos funcionando
- Preserva a interface e funcionalidades

**Importante**: Sem essa etapa, o sistema continuará usando dados mock para demonstração.