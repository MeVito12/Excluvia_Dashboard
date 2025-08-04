# Sistemas por Categoria

Esta estrutura permite dividir o sistema principal em aplicações independentes por categoria de negócio.

## Estrutura dos Sistemas

Cada categoria terá:
- ✅ Aplicação independente com interface própria
- ✅ Banco de dados separado
- ✅ Funcionalidades essenciais mantidas
- ✅ Sistema de autenticação próprio
- ✅ Deploy independente

## Categorias Disponíveis

### 1. 💊 Sistema Farmácia
- **Pasta**: `farmacia/`
- **Funcionalidades**: Estoque de medicamentos, vendas, clientes, controle de validade
- **Banco**: PostgreSQL próprio com RLS
- **URL**: farmacia.sistemagerencial.com

### 2. 🐕 Sistema Pet & Veterinário  
- **Pasta**: `pet/`
- **Funcionalidades**: Agendamentos, atendimentos, clientes, produtos pet
- **Banco**: PostgreSQL próprio com RLS
- **URL**: pet.sistemagerencial.com

### 3. ⚕️ Sistema Médico & Saúde
- **Pasta**: `medico/`
- **Funcionalidades**: Agendamentos, consultas, pacientes, receituário
- **Banco**: PostgreSQL próprio com RLS
- **URL**: medico.sistemagerencial.com

### 4. 🍽️ Sistema Alimentício
- **Pasta**: `alimenticio/`
- **Funcionalidades**: Cardápio, pedidos, delivery, ingredientes
- **Banco**: PostgreSQL próprio com RLS
- **URL**: alimenticio.sistemagerencial.com

### 5. 💼 Sistema Vendas
- **Pasta**: `vendas/`
- **Funcionalidades**: Produtos, vendas, comissões, relatórios
- **Banco**: PostgreSQL próprio com RLS
- **URL**: vendas.sistemagerencial.com

### 6. 🎨 Sistema Design Gráfico
- **Pasta**: `design/`
- **Funcionalidades**: Projetos, portfólio, clientes, orçamentos
- **Banco**: PostgreSQL próprio com RLS
- **URL**: design.sistemagerencial.com

### 7. 🌐 Sistema Criação de Sites
- **Pasta**: `sites/`
- **Funcionalidades**: Projetos web, domínios, hospedagem, clientes
- **Banco**: PostgreSQL próprio com RLS
- **URL**: sites.sistemagerencial.com

## Como Usar

1. **Escolher categoria**: Cada empresa escolhe sua categoria principal
2. **Deploy separado**: Cada sistema roda independentemente
3. **Banco próprio**: Cada categoria tem sua base de dados isolada
4. **Customização**: Interface adaptada para a categoria específica

## Vantagens

- 🔒 **Isolamento total**: Cada categoria tem seu próprio ambiente
- ⚡ **Performance**: Sistemas menores e mais rápidos
- 🛡️ **Segurança**: Bancos separados aumentam a segurança
- 📱 **Customização**: Interface específica para cada tipo de negócio
- 🚀 **Escalabilidade**: Cada sistema pode crescer independentemente
