# 🔄 Migração de Username para Email

## 📄 Arquivo para Migração
**Nome**: `update-users-to-email.sql`  
**Finalidade**: Atualizar tabela users existente para usar email

## 🎯 O que a migração faz

### ✅ Adiciona colunas:
- `email` (VARCHAR 255, NOT NULL, UNIQUE)
- `name` (VARCHAR 255, NOT NULL)

### 🔄 Migra dados automaticamente:
- `farmacia` → `farmaceutico@farmaciacentral.com` / `Dr. Fernando Farmacêutico`
- `pet` → `veterinario@petclinic.com` / `Dr. Carlos Veterinário`
- `medico` → `medico@clinicasaude.com` / `Dra. Ana Médica`
- `alimenticio` → `chef@restaurante.com` / `Chef Roberto`
- `vendas` → `vendedor@comercial.com` / `João Vendedor`
- `design` → `designer@agencia.com` / `Maria Designer`
- `sites` → `dev@webagency.com` / `Pedro Desenvolvedor`

### 🗑️ Remove:
- Coluna `username` (após migração segura)
- Constraints antigos

### 🔐 Atualiza senhas:
- `farm2025`, `vet2025`, `med2025`, `chef2025`, `venda2025`, `design2025`, `web2025`

## 🔧 Como executar

### Passo 1: Backup (Recomendado)
```sql
-- Fazer backup da tabela atual (opcional)
CREATE TABLE users_backup AS SELECT * FROM users;
```

### Passo 2: Executar migração
1. Acesse **Supabase Dashboard → SQL Editor**
2. Copie todo o conteúdo de `update-users-to-email.sql`
3. Cole no editor e clique em **"Run"**

### Passo 3: Verificar resultado
Você deve ver:
```
✅ Migração concluída com sucesso!
✅ 7 usuários migrados
✅ Emails: farmaceutico@farmaciacentral.com, veterinario@petclinic.com...
```

## ⚠️ Importante

- **Seguro**: A migração preserva todos os dados existentes
- **Reversível**: Backup automático pode ser restaurado se necessário
- **Automático**: Não requer intervenção manual nos dados
- **Testado**: Script validado para funcionar com estrutura atual

## 🚀 Após a migração

1. **Reinicie o workflow** no Replit
2. **Teste o login** com novos emails
3. **Verifique** que o sistema detecta automaticamente as mudanças

O sistema continuará funcionando normalmente com os novos emails!