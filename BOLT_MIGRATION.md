# Migração para Bolt - Guia Completo

## Visão Geral
Este documento fornece instruções detalhadas para migrar seu sistema de gerenciamento de banco de dados do Replit para o Bolt.

## Arquitetura Atual
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Banco de Dados**: PostgreSQL (Neon) com Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **Estado**: TanStack Query

## Estrutura do Projeto

```
projeto/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes UI
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Hooks customizados
│   │   └── lib/           # Utilitários
│   ├── index.html         # Template HTML
│   └── public/            # Assets estáticos
├── server/                # Backend Express
│   ├── index.ts          # Entrada do servidor
│   ├── routes.ts         # Rotas da API
│   ├── db.ts             # Configuração do banco
│   ├── storage.ts        # Interface de armazenamento
│   └── vite.ts           # Configuração Vite
├── shared/               # Tipos compartilhados
│   ├── schema.ts         # Schema do banco
│   ├── integrations.ts   # Tipos de integração
│   └── activity-logs.ts  # Logs de atividade
├── package.json          # Dependências
├── vite.config.ts        # Configuração Vite
├── tailwind.config.ts    # Configuração Tailwind
├── drizzle.config.ts     # Configuração Drizzle ORM
└── tsconfig.json         # Configuração TypeScript
```

## Dependências Principais

### Frontend
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@tanstack/react-query": "^5.60.5",
  "wouter": "^3.3.5",
  "react-hook-form": "^7.55.0",
  "@hookform/resolvers": "^3.10.0"
}
```

### UI/Styling
```json
{
  "@radix-ui/react-dialog": "^1.1.7",
  "@radix-ui/react-dropdown-menu": "^2.1.7",
  "@radix-ui/react-select": "^2.1.7",
  "@radix-ui/react-tabs": "^1.1.4",
  "@radix-ui/react-toast": "^1.2.7",
  "tailwindcss": "^3.4.17",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.6.0",
  "lucide-react": "^0.453.0"
}
```

### Backend
```json
{
  "express": "^4.21.2",
  "drizzle-orm": "^0.39.1",
  "@neondatabase/serverless": "^0.10.4",
  "zod": "^3.24.2"
}
```

### Build Tools
```json
{
  "vite": "^5.4.14",
  "@vitejs/plugin-react": "^4.3.2",
  "typescript": "5.6.3",
  "esbuild": "^0.25.0",
  "tsx": "^4.19.1"
}
```

## Passos da Migração

### 1. Preparação do Ambiente Bolt

1. Crie um novo projeto no Bolt
2. Configure Node.js 20+ como runtime
3. Configure variáveis de ambiente necessárias

### 2. Transferência de Arquivos

#### Scripts npm necessários:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

### 3. Configurações Essenciais

#### vite.config.ts
- Plugin React configurado
- Aliases de importação (@, @shared, @assets)
- Otimizações de build com chunks manuais
- Configuração de desenvolvimento com HMR

#### tailwind.config.ts
- Dark mode configurado
- Cores customizadas do design system
- Animações e keyframes
- Plugin de tipografia

#### tsconfig.json
- ESNext target
- Module resolution configurado
- Paths aliases
- Strict mode habilitado

### 4. Banco de Dados

#### Schema (shared/schema.ts)
O sistema inclui schemas para:
- Usuários e autenticação
- Produtos e estoque
- Vendas e clientes
- Agendamentos
- Mensagens e atendimento
- Campanhas de fidelidade
- Logs de atividade

#### Conexão
- PostgreSQL via Neon serverless
- Drizzle ORM para queries type-safe
- Suporte a múltiplas categorias de negócio

### 5. Features Implementadas

#### Sistema de Autenticação
- Login/logout
- Contexto de usuário
- Proteção de rotas

#### Dashboard Multicategoria
- 6 categorias de negócio (Pet, Médico, Alimentício, etc.)
- Métricas em tempo real
- Gráficos e análises

#### Gestão de Estoque
- Controle de produtos
- Alertas de vencimento
- Rastreamento de validade
- Gestão de estoque baixo

#### Sistema de Atendimento
- WhatsApp integração
- Bot IA 24/7
- Catálogos/Cardápios
- Sistema de fidelidade

#### Agendamentos
- Calendário integrado
- Notificações automáticas
- Integrações (Google Calendar, Doctoralia)

### 6. Variáveis de Ambiente Necessárias

```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
```

### 7. Comandos de Migração

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar banco de dados:**
```bash
npm run db:push
```

3. **Modo desenvolvimento:**
```bash
npm run dev
```

4. **Build para produção:**
```bash
npm run build
npm run start
```

## Considerações de Segurança

### Client/Server Separation
- API endpoints bem definidos
- Validação com Zod schemas
- Headers de segurança configurados
- Sanitização de inputs

### Autenticação
- Sessions seguras
- Proteção CSRF
- Validação de tokens

### Banco de Dados
- Queries parametrizadas
- Validação de schema
- Transações seguras

## Otimizações de Performance

### Frontend
- Code splitting por chunks
- Lazy loading de componentes
- Otimização de imagens
- Service worker para cache

### Backend
- Middleware de logging
- Compressão gzip
- Rate limiting
- Connection pooling

## Funcionalidades por Categoria

### Pet Shop
- Produtos: ração, medicamentos, acessórios
- Agendamentos veterinários
- Integração Doctoralia

### Médico/Saúde
- Medicamentos e equipamentos
- Agendamentos consultas
- Prontuários básicos

### Alimentício
- Cardápios digitais
- Delivery integrado
- Pagamentos PIX/Cartão

### Tecnologia/Vendas
- Produtos eletrônicos
- B2B/B2C
- Relatórios de vendas

### Design/Sites
- Portfolio de projetos
- Galeria de trabalhos
- Links e descrições

### Educação/Beleza
- Produtos específicos
- Agendamentos
- Campanhas promocionais

## Testes e Validação

### Testes Funcionais
- Autenticação
- CRUD operações
- Navegação entre seções
- Responsividade

### Testes de Performance
- Tempo de carregamento
- Otimização de queries
- Cache effectiveness

### Testes de Segurança
- Validação de inputs
- Proteção de rotas
- Sanitização de dados

## Monitoramento e Logs

### Sistema de Logs
- Requests/responses
- Erros e exceções
- Performance metrics
- User activities

### Métricas
- Tempo de resposta
- Taxa de erro
- Uso de recursos
- User engagement

## Documentação Adicional

### Arquivos de Referência
- `replit.md` - Documentação técnica completa
- `shared/schema.ts` - Definições de tipos
- `server/routes.ts` - Endpoints da API
- `client/src/App.tsx` - Estrutura principal

### Recursos Externos
- [Vite Documentation](https://vitejs.dev/)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle ORM](https://orm.drizzle.team/)

## Suporte

Para questões técnicas ou problemas durante a migração, consulte:
1. Logs do sistema em `server/index.ts`
2. Documentação do projeto em `replit.md`
3. Schemas de dados em `shared/schema.ts`
4. Configurações em arquivos `.config.ts`