# Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha uma organização e preencha:
   - Nome do projeto: Sistema de Gestão Empresarial
   - Senha do banco: [escolha uma senha forte]
   - Região: Mais próxima da sua localização

## 2. Obter Configurações de Conexão

Após criar o projeto:

1. Vá para **Settings > Database**
2. Copie a **Connection String** no formato PostgreSQL

A string será algo como:
```
postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 3. Configurar Variáveis de Ambiente

No Replit, adicione a variável de ambiente:

1. Clique no ícone de configurações (⚙️) no painel lateral
2. Vá para a aba **Secrets**
3. Adicione:
   - **Key**: `DATABASE_URL`
   - **Value**: [cole a connection string do Supabase]

## 4. Executar Schema SQL

No Supabase Dashboard:

1. Vá para **SQL Editor**
2. Copie e cole o conteúdo do arquivo `migrations/schema.sql`
3. Clique em **Run** para criar todas as tabelas

## 5. Verificar Conexão

Após configurar, reinicie o servidor Replit. Você deve ver:
```
✅ Usando banco de dados Supabase
```

Em vez de:
```
⚠️ Usando armazenamento em memória (mock data)
```

## 6. Usuarios Padrão

O sistema criará automaticamente usuários de teste para cada categoria de negócio:
- Farmácia: farmaceutico@farmaciacentral.com / farm2025
- Pet: veterinario@petclinic.com / vet2025  
- Médico: medico@clinicasaude.com / med2025
- Alimentício: gerente@restaurantebella.com / rest2025
- Vendas: vendedor@comercialtech.com / vend2025
- Design: designer@agenciacreative.com / design2025
- Sites: dev@webagency.com / web2025
- Master: master@sistema.com / master2025

## Troubleshooting

### Erro de Conexão
- Verifique se a `DATABASE_URL` está correta
- Confirme que o IP está liberado (Supabase libera por padrão)
- Teste a conexão no SQL Editor do Supabase

### Tabelas Não Encontradas
- Execute o schema SQL no Supabase Dashboard
- Verifique se todas as tabelas foram criadas na aba **Table Editor**

### Performance
- O Supabase oferece conexão pooling automática
- Para produção, considere usar uma instância dedicada