# Supabase Multi-Database Integration

Este documento descreve como configurar e usar múltiplas conexões Supabase no sistema de agendamentos.

## Configuração

### 1. Variáveis de Ambiente

Para configurar múltiplas bases de dados Supabase, defina as seguintes variáveis de ambiente:

```bash
# Base de dados principal
SUPABASE_URL_MAIN=https://your-main-project.supabase.co
SUPABASE_ANON_KEY_MAIN=your-main-anon-key
SUPABASE_SERVICE_KEY_MAIN=your-main-service-key

# Base de dados secundária
SUPABASE_URL_SECONDARY=https://your-secondary-project.supabase.co
SUPABASE_ANON_KEY_SECONDARY=your-secondary-anon-key
SUPABASE_SERVICE_KEY_SECONDARY=your-secondary-service-key

# Base de dados de analytics
SUPABASE_URL_ANALYTICS=https://your-analytics-project.supabase.co
SUPABASE_ANON_KEY_ANALYTICS=your-analytics-anon-key
SUPABASE_SERVICE_KEY_ANALYTICS=your-analytics-service-key
```

### 2. Estrutura das Tabelas

Cada base de dados Supabase deve ter as seguintes tabelas:

#### Tabela: users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

#### Tabela: appointments
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  user_id INTEGER REFERENCES users(id),
  scheduled_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: reminders
```sql
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER REFERENCES appointments(id),
  reminder_type TEXT CHECK (reminder_type IN ('email', 'telegram', 'whatsapp')),
  reminder_time TIMESTAMP NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: integration_settings
```sql
CREATE TABLE integration_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  platform TEXT CHECK (platform IN ('google_calendar', 'doctoralia', 'outlook')),
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: notification_settings
```sql
CREATE TABLE notification_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  email_enabled BOOLEAN DEFAULT FALSE,
  telegram_enabled BOOLEAN DEFAULT FALSE,
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  email_address TEXT,
  telegram_chat_id TEXT,
  whatsapp_number TEXT,
  default_reminder_time INTEGER DEFAULT 60,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Implementação

### 1. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

### 2. Configuração de Cliente

O sistema está preparado para usar o arquivo `supabase.config.ts` que gerencia múltiplas conexões automaticamente.

### 3. Storage Interface

A classe `SupabaseMultiStorage` no arquivo `server/storage.ts` implementa a interface `IStorage` e será configurada para:

- Conectar automaticamente às múltiplas bases de dados
- Distribuir consultas entre as bases de dados conforme necessário
- Gerenciar failover e balanceamento de carga
- Manter consistência de dados entre as instâncias

### 4. Características da Implementação

- **Multi-tenancy**: Suporte para múltiplas bases de dados
- **Failover**: Mudança automática entre bases de dados em caso de falha
- **Load Balancing**: Distribuição de consultas para melhor performance
- **Health Monitoring**: Monitorização do estado das conexões
- **Configuration Management**: Gestão centralizada de configurações

## Próximos Passos

1. Instalar o cliente Supabase (`@supabase/supabase-js`)
2. Implementar as conexões na classe `SupabaseMultiStorage`
3. Configurar as variáveis de ambiente
4. Criar as tabelas nas bases de dados Supabase
5. Testar as conexões e operações CRUD

## Notificações

O sistema suporta notificações via:
- **Email**: Configuração SMTP via Supabase Edge Functions
- **Telegram**: Bot API para envio de mensagens
- **WhatsApp**: Integração via API autorizada (sem APIs caras)

## Integrações de Plataformas

- **Google Calendar**: OAuth2 para sincronização
- **Doctoralia**: API para gestão de consultas
- **Outlook**: Microsoft Graph API para calendário

## Arquitetura

```
Frontend (React) 
    ↓
API Routes (Express)
    ↓
Storage Interface (IStorage)
    ↓
SupabaseMultiStorage
    ↓
Multiple Supabase Databases
```

Este design mantém a simplicidade solicitada, evitando CRM complexo e APIs caras, focando nas funcionalidades essenciais de agendamento e notificações.