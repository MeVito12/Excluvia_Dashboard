# Checklist de Migração para Bolt

## ✅ Preparação

- [ ] **1. Ambiente Bolt configurado**
  - [ ] Node.js 20+ instalado
  - [ ] Projeto criado no Bolt
  - [ ] Variáveis de ambiente configuradas

- [ ] **2. Backup e documentação**
  - [x] Documentação completa criada (BOLT_MIGRATION.md)
  - [x] Lista de dependências documentada
  - [x] Estrutura do projeto mapeada
  - [ ] Backup dos dados importantes realizado

## ✅ Transferência de Arquivos

### Arquivos de Configuração (Prioridade Alta)
- [ ] `package.json` (usar bolt-package.json como referência)
- [ ] `vite.config.ts`
- [ ] `tailwind.config.ts`
- [ ] `tsconfig.json`
- [ ] `drizzle.config.ts`
- [ ] `postcss.config.js`
- [ ] `components.json` (shadcn/ui)

### Código Fonte
- [ ] **Frontend** (`client/` directory)
  - [ ] `client/src/` (todos os arquivos)
  - [ ] `client/index.html`
  - [ ] `client/public/` (assets estáticos)

- [ ] **Backend** (`server/` directory)
  - [ ] `server/index.ts` (entrada principal)
  - [ ] `server/routes.ts`
  - [ ] `server/db.ts`
  - [ ] `server/storage.ts`
  - [ ] `server/vite.ts`

- [ ] **Shared** (`shared/` directory)
  - [ ] `shared/schema.ts` (schemas do banco)
  - [ ] `shared/integrations.ts`
  - [ ] `shared/activity-logs.ts`

### Documentação e Assets
- [ ] `replit.md` (documentação técnica)
- [ ] `attached_assets/` (se necessário)

## ✅ Instalação de Dependências

- [ ] **3. Instalar dependências principais**
```bash
npm install
```

- [ ] **4. Verificar instalação**
```bash
npm run check
```

## ✅ Configuração do Banco de Dados

- [ ] **5. Configurar PostgreSQL**
  - [ ] Criar instância do banco
  - [ ] Configurar DATABASE_URL
  - [ ] Testar conexão

- [ ] **6. Configurar schema**
```bash
npm run db:push
```

## ✅ Testes de Funcionalidade

- [ ] **7. Modo desenvolvimento**
```bash
npm run dev
```

- [ ] **8. Testes funcionais**
  - [ ] Sistema de login funciona
  - [ ] Seleção de categoria funciona
  - [ ] Dashboard carrega métricas
  - [ ] Navegação entre seções
  - [ ] Responsividade mobile

### Por Categoria de Negócio
- [ ] **Pet Shop**
  - [ ] Produtos carregam
  - [ ] Estoque funciona
  - [ ] Agendamentos veterinários

- [ ] **Médico/Saúde**
  - [ ] Medicamentos listam
  - [ ] Consultas agendáveis
  - [ ] Integrações médicas

- [ ] **Alimentício**
  - [ ] Cardápios exibem
  - [ ] Sistema de delivery
  - [ ] Pagamentos configurados

- [ ] **Vendas/Comércio**
  - [ ] Produtos eletrônicos
  - [ ] Relatórios de vendas
  - [ ] Clientes B2B/B2C

- [ ] **Design Gráfico**
  - [ ] Portfolio exibe
  - [ ] Projetos carregam
  - [ ] Galeria funciona

- [ ] **Criação de Sites**
  - [ ] Portfolio web
  - [ ] Links funcionam
  - [ ] Projetos exibem

## ✅ Funcionalidades Específicas

- [ ] **9. Sistema de Atendimento**
  - [ ] WhatsApp integration mock
  - [ ] Bot IA responde
  - [ ] Catálogos/Cardápios
  - [ ] Sistema de fidelidade

- [ ] **10. Gestão de Estoque**
  - [ ] Produtos CRUD
  - [ ] Alertas de vencimento
  - [ ] Controle de estoque
  - [ ] Relatórios

- [ ] **11. Agendamentos**
  - [ ] Calendário funciona
  - [ ] Notificações
  - [ ] Integrações (Google, Doctoralia)

- [ ] **12. Gráficos e Relatórios**
  - [ ] Dashboards carregam
  - [ ] Gráficos renderizam
  - [ ] Exportação funciona

## ✅ Build e Deploy

- [ ] **13. Build de produção**
```bash
npm run build
```

- [ ] **14. Teste de produção**
```bash
npm run start
```

- [ ] **15. Verificações finais**
  - [ ] Performance adequada
  - [ ] Sem erros no console
  - [ ] Assets carregam corretamente
  - [ ] APIs respondem

## ✅ Otimizações

- [ ] **16. Performance**
  - [ ] Code splitting funciona
  - [ ] Lazy loading implementado
  - [ ] Cache configurado

- [ ] **17. Segurança**
  - [ ] Validações Zod funcionam
  - [ ] Headers de segurança
  - [ ] Proteção de rotas

## ✅ Documentação Final

- [ ] **18. Atualizar documentação**
  - [ ] README.md criado/atualizado
  - [ ] Instruções de deploy
  - [ ] Guias de uso

- [ ] **19. Validação completa**
  - [ ] Todos os recursos funcionam
  - [ ] Performance aceitável
  - [ ] UX/UI preservada

## 🚨 Problemas Comuns e Soluções

### Erro de porta em uso
```bash
# Matar processos na porta 5000
pkill -f "tsx server/index.ts"
```

### Problemas de dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de banco de dados
- Verificar DATABASE_URL
- Confirmar acesso ao PostgreSQL
- Executar `npm run db:push`

### Problemas de build
- Verificar configurações TypeScript
- Confirmar paths de import
- Verificar dependências peer

## 📁 Estrutura Final Esperada

```
projeto-bolt/
├── client/
├── server/
├── shared/
├── dist/ (após build)
├── node_modules/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
└── README.md
```

## 🎯 Critérios de Sucesso

- ✅ Aplicação inicia sem erros
- ✅ Todas as 6 categorias funcionam
- ✅ CRUD operations funcionam
- ✅ UI/UX preservada
- ✅ Performance adequada
- ✅ Mobile responsivo
- ✅ Banco de dados conectado
- ✅ Build de produção funciona

---

**Tempo estimado de migração:** 2-4 horas
**Complexidade:** Média-Alta
**Dependências críticas:** PostgreSQL, Node.js 20+