# Guia de Deploy para Sistemas por Categoria

## Como Separar e Implementar

### 1. Preparação dos Bancos de Dados

Cada categoria precisa de seu próprio banco PostgreSQL:

```bash
# Criar novos bancos no Supabase
- farmacia-db.supabase.co
- alimenticio-db.supabase.co  
- pet-db.supabase.co
- medico-db.supabase.co
- vendas-db.supabase.co
- design-db.supabase.co
- sites-db.supabase.co
```

### 2. Configuração de Variáveis de Ambiente

Cada sistema terá suas próprias variáveis:

```bash
# Sistema Farmácia
DATABASE_URL=postgresql://farmacia-db.supabase.co
SUPABASE_URL=https://farmacia-project.supabase.co
SUPABASE_ANON_KEY=farmacia_anon_key
CATEGORY=farmacia

# Sistema Alimentício
DATABASE_URL=postgresql://alimenticio-db.supabase.co
SUPABASE_URL=https://alimenticio-project.supabase.co
SUPABASE_ANON_KEY=alimenticio_anon_key
CATEGORY=alimenticio
```

### 3. Deploy no Replit

Para cada categoria, criar um novo Repl:

1. **Farmácia**: `https://replit.com/@usuario/sistema-farmacia`
2. **Alimentício**: `https://replit.com/@usuario/sistema-alimenticio`
3. **Pet**: `https://replit.com/@usuario/sistema-pet`
4. **Médico**: `https://replit.com/@usuario/sistema-medico`
5. **Vendas**: `https://replit.com/@usuario/sistema-vendas`
6. **Design**: `https://replit.com/@usuario/sistema-design`
7. **Sites**: `https://replit.com/@usuario/sistema-sites`

### 4. Customização por Sistema

Cada sistema terá:

#### Interface Específica
- Cores e tema personalizado
- Ícones relacionados à categoria
- Terminologia específica (medicamentos, pratos, serviços, etc.)

#### Funcionalidades Específicas
- **Farmácia**: Controle de receitas, medicamentos controlados, validade
- **Alimentício**: Cardápio, pedidos, mesas, delivery
- **Pet**: Agendamentos veterinários, histórico de pets
- **Médico**: Prontuários, consultas, exames
- **Vendas**: Comissões, metas, prospects
- **Design**: Portfólio, projetos, orçamentos
- **Sites**: Domínios, hospedagem, projetos web

### 5. Migração de Dados

Para migrar empresas existentes:

```sql
-- Exportar dados de uma categoria específica
SELECT * FROM companies WHERE business_category = 'farmacia';
SELECT * FROM users WHERE company_id IN (SELECT id FROM companies WHERE business_category = 'farmacia');
-- ... outros dados relacionados

-- Importar no novo banco específico
```

### 6. URLs dos Sistemas

Cada sistema terá sua própria URL:

- `farmacia.sistemagerencial.com`
- `alimenticio.sistemagerencial.com`
- `pet.sistemagerencial.com`
- `medico.sistemagerencial.com`
- `vendas.sistemagerencial.com`
- `design.sistemagerencial.com`
- `sites.sistemagerencial.com`

### 7. Autenticação Independente

Cada sistema terá:
- Login próprio
- Usuários específicos da categoria
- Dados completamente isolados

## Vantagens desta Arquitetura

✅ **Isolamento Total**: Cada categoria é completamente independente
✅ **Performance**: Sistemas menores e mais rápidos
✅ **Segurança**: Bancos separados aumentam a segurança
✅ **Personalização**: Interface específica para cada tipo de negócio
✅ **Escalabilidade**: Cada sistema pode crescer independentemente
✅ **Manutenção**: Atualizações podem ser feitas por categoria
✅ **Custos**: Empresas pagam apenas pelo que usam

## Implementação Gradual

1. **Fase 1**: Criar sistemas Farmácia e Alimentício (mais demandados)
2. **Fase 2**: Implementar Pet e Médico
3. **Fase 3**: Finalizar com Vendas, Design e Sites
4. **Fase 4**: Migração gradual dos clientes existentes

Esta estrutura permite que cada categoria tenha um sistema otimizado para suas necessidades específicas, mantendo a qualidade e funcionalidade essencial.