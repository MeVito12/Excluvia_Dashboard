# Configuração Manual do Supabase Database

Como a conexão direta DNS não é possível no ambiente Replit, as tabelas do banco de dados precisam ser criadas manualmente no dashboard do Supabase.

## Instruções de Setup

### 1. Acesse o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard/projects
- Selecione seu projeto: `mjydrjmckcoixrnnrehm`

### 2. Execute o Script SQL
- No menu lateral, clique em **SQL Editor**
- Crie um novo query
- Copie e cole o conteúdo completo do arquivo `migrations/schema.sql`
- Execute o script clicando em **Run**

### 3. Verificação das Tabelas
Após executar o script, você deve ter estas 13 tabelas criadas:

✅ **users** - Usuários do sistema  
✅ **products** - Produtos/inventário  
✅ **clients** - Clientes  
✅ **appointments** - Agendamentos  
✅ **sales** - Vendas  
✅ **loyalty_campaigns** - Campanhas de fidelidade  
✅ **whatsapp_chats** - Conversas WhatsApp  
✅ **stock_movements** - Movimentações de estoque  
✅ **bot_configs** - Configurações do bot  
✅ **support_agents** - Agentes de suporte  
✅ **integration_settings** - Configurações de integração  
✅ **notification_settings** - Configurações de notificação  
✅ **reminders** - Lembretes

### 4. Dados de Exemplo
O script também insere dados de exemplo para os 7 perfis de negócio:
- **farmacia** - Farmácia Central
- **pet** - Pet Clinic  
- **medico** - Clínica Saúde
- **alimenticio** - Restaurante Bella Vista
- **vendas** - Comercial Tech
- **design** - Agência Creative
- **sites** - Web Agency

## Status Atual

🔌 **API Connection**: ✅ Funcionando  
🗄️ **Database Schema**: ⏳ Aguardando execução manual  
🔄 **Fallback System**: ✅ Dados mock operacionais  

## Após Executar o Setup

Quando as tabelas estiverem criadas no Supabase:

1. **Reinicie o workflow** no Replit
2. O sistema automaticamente detectará as tabelas
3. A aplicação passará a usar dados reais do Supabase
4. Os dados mock serão substituídos pelos dados do banco

## Verificação

Para verificar se funcionou:
1. Acesse a aplicação
2. Na página de health check: `/api/health`
3. Procure por: `"usingDatabase": true`

Se ainda aparecer `"usingDatabase": false`, as tabelas não foram criadas corretamente.