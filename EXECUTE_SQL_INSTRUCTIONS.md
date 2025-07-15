# 📋 Instruções para Executar SQL no Supabase

## 🎯 Arquivo para Execução
**Nome**: `supabase-complete-schema.sql`  
**Localização**: Raiz do projeto  
**Conteúdo**: Schema completo com todas as 13 tabelas + dados de exemplo

## 🔧 Como Executar

### Passo 1: Acessar Dashboard
1. Vá para: https://supabase.com/dashboard/projects
2. Selecione projeto: **mjydrjmckcoixrnnrehm**
3. No menu lateral, clique em **"SQL Editor"**

### Passo 2: Executar SQL
1. Clique em **"New query"**
2. Copie TODO o conteúdo de `supabase-complete-schema.sql`
3. Cole no editor SQL
4. Clique em **"Run"** (botão verde)

### Passo 3: Verificar Resultado
Você deve ver:
- ✅ **Success. No rows returned** (ou similar)
- ✅ Lista de tabelas criadas no painel lateral
- ✅ Mensagem final: "Banco de dados criado com sucesso! 🎉"

## 🔍 Verificação das Tabelas

Após execução, verifique se estas 13 tabelas foram criadas:

1. **users** - Usuários do sistema
2. **products** - Inventário/produtos  
3. **clients** - Clientes
4. **appointments** - Agendamentos
5. **sales** - Vendas
6. **loyalty_campaigns** - Campanhas
7. **whatsapp_chats** - Conversas WhatsApp
8. **stock_movements** - Movimentações de estoque
9. **bot_configs** - Configurações do bot
10. **support_agents** - Agentes de suporte
11. **integration_settings** - Integrações
12. **notification_settings** - Notificações
13. **reminders** - Lembretes

## 🚀 Ativação Automática

Após executar o SQL:

1. **Reinicie o workflow** no Replit
2. Aguarde as mensagens:
   ```
   ✅ Supabase tables exist and accessible via API
   ✅ Using Supabase database with live tables
   ```
3. Verifique em `/api/health`:
   ```json
   {
     "status": "ok",
     "database": {
       "initialized": true,
       "usingDatabase": true,
       "storage": "database"
     }
   }
   ```

## 🔑 Credenciais de Login

Após ativação, use estes emails/senhas sincronizados:

- **Farmácia**: `farmaceutico@farmaciacentral.com` / `farm2025`
- **Pet Shop**: `veterinario@petclinic.com` / `vet2025`
- **Médico**: `medico@clinicasaude.com` / `med2025`
- **Alimentício**: `chef@restaurante.com` / `chef2025`
- **Vendas**: `vendedor@comercial.com` / `venda2025`
- **Design**: `designer@agencia.com` / `design2025`
- **Sites**: `dev@webagency.com` / `web2025`

## 🎉 Resultado Final

Com as tabelas criadas, o sistema:
- ✅ Detecta automaticamente o banco Supabase
- ✅ Muda de dados mock para dados reais
- ✅ Mantém todas as funcionalidades
- ✅ Opera com performance otimizada
- ✅ Preserva a interface atual

## ⚠️ Importante

Se houver algum erro durante a execução:
1. Verifique se copiou o SQL completo
2. Certifique-se de estar no projeto correto
3. Tente executar novamente
4. Se persistir, pode executar em partes menores

O arquivo SQL foi projetado para ser executado de uma só vez e é completamente seguro.