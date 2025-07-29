# Guia de Exportação do Design - Sistema de Gestão

Este guia contém todos os elementos necessários para replicar o design padronizado da seção Estoque em outros projetos.

## 1. Estrutura CSS Base

### Classes de Layout Principal
```css
/* Container da seção */
.app-section {
  @apply min-h-screen bg-gray-50 p-6;
}

/* Cabeçalho da seção */
.section-header {
  @apply mb-8;
}

.section-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.section-subtitle {
  @apply text-gray-600 text-lg;
}

/* Card principal */
.main-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}
```

### Sistema de Navegação por Abas
```css
.tab-navigation {
  @apply flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6;
}

.tab-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200;
  @apply text-gray-600 hover:text-gray-900 hover:bg-white;
}

.tab-button.active {
  @apply bg-white text-gray-900 shadow-sm;
}
```

### Sistema de Filtros Padronizado
```css
/* Container dos filtros */
.filter-container {
  @apply flex flex-wrap gap-4 items-center mb-6;
}

/* Campo de busca principal */
.search-input {
  @apply w-full px-3 py-2 border border-gray-200 rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* Dropdown de filtros */
.filter-select {
  @apply px-3 py-2 border border-gray-200 rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* Botões de ação */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply bg-purple-600 text-white hover:bg-purple-700;
  @apply focus:ring-purple-500;
}

.btn-outline {
  @apply bg-gray-300 text-gray-700 hover:bg-gray-400;
  @apply focus:ring-gray-500;
}
```

### Sistema de Listas Padronizado
```css
.standard-list-container {
  @apply space-y-3;
}

.standard-list-content {
  @apply space-y-2;
}

.standard-list-item {
  @apply flex items-center justify-between p-4 bg-white rounded-lg border;
  @apply border-gray-200 hover:border-gray-300 transition-colors;
}

.list-item-main {
  @apply flex-1;
}

.list-item-title {
  @apply font-semibold text-gray-900 text-lg;
}

.list-item-subtitle {
  @apply text-gray-600 text-sm mt-1;
}

.list-item-meta {
  @apply text-gray-500 text-xs mt-2;
}
```

### Sistema de Status e Badges
```css
.list-status-badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

.status-success {
  @apply bg-green-100 text-green-800;
}

.status-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.status-danger {
  @apply bg-red-100 text-red-800;
}

.status-info {
  @apply bg-blue-100 text-blue-800;
}

.status-pending {
  @apply bg-gray-100 text-gray-800;
}
```

### Botões de Ação
```css
.list-action-button {
  @apply w-8 h-8 rounded-full flex items-center justify-center;
  @apply transition-colors duration-200 opacity-0 group-hover:opacity-100;
}

.list-action-button.edit {
  @apply bg-blue-100 text-blue-600 hover:bg-blue-200;
}

.list-action-button.delete {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.list-action-button.transfer {
  @apply bg-purple-100 text-purple-600 hover:bg-purple-200;
}

.list-action-button.sales {
  @apply bg-green-100 text-green-600 hover:bg-green-200;
}
```

## 2. Estrutura React Padronizada

### Componente Base da Seção
```tsx
import React, { useState } from 'react';
import { Search, Plus, Package, ArrowRightLeft } from 'lucide-react';

const EstoqueSection = () => {
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft }
  ];

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Estoque</h1>
        <p className="section-subtitle">
          Gerencie produtos, estoque e transferências entre filiais
        </p>
      </div>

      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'produtos' && renderProducts()}
      {activeTab === 'transferencias' && renderTransfers()}
    </div>
  );
};
```

### Padrão de Filtros
```tsx
const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  statusFilter, 
  setStatusFilter,
  categoryOptions,
  statusOptions
}) => (
  <div className="flex flex-wrap gap-4 items-center mb-6">
    <div className="flex-1">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <select
      value={filterCategory}
      onChange={(e) => setFilterCategory(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {categoryOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {statusOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    
    <button
      onClick={() => {
        setSearchTerm('');
        setFilterCategory('all');
        setStatusFilter('all');
      }}
      className="btn btn-outline"
    >
      Limpar Filtros
    </button>
  </div>
);
```

### Padrão de Lista de Items
```tsx
const ItemList = ({ items, onEdit, onDelete, renderStatus }) => (
  <div className="standard-list-container">
    <div className="standard-list-content">
      {items.map((item) => (
        <div key={item.id} className="standard-list-item group">
          <div className="list-item-main">
            <div className="list-item-title">{item.name}</div>
            <div className="list-item-subtitle">{item.description}</div>
            <div className="list-item-meta">{item.metadata}</div>
          </div>
          
          <div className="flex items-center gap-3">
            {renderStatus && renderStatus(item)}
            
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(item)}
                className="list-action-button edit"
                title="Editar"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => onDelete(item)}
                className="list-action-button delete"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
```

## 3. Dependências Necessárias

### React e Hooks
```bash
npm install react react-dom
npm install lucide-react  # Para ícones
```

### Tailwind CSS (recomendado)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Estados Customizados
```tsx
// Hook para alertas customizados
const useCustomAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertData, setAlertData] = useState({});
  
  const showAlert = (data) => {
    setAlertData(data);
    setIsOpen(true);
  };
  
  const closeAlert = () => {
    setIsOpen(false);
    setAlertData({});
  };
  
  return { showAlert, isOpen, alertData, closeAlert };
};
```

## 4. Configurações do Tailwind

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        }
      }
    },
  },
  plugins: [],
}
```

## 5. Exemplo de Implementação Completa

O sistema é modular e pode ser adaptado para qualquer tipo de dados:
- Produtos → Qualquer item de inventário
- Transferências → Qualquer tipo de movimentação
- Filtros → Adaptáveis para diferentes categorias
- Status → Personalizáveis por contexto

Este design garante:
✓ Responsividade completa
✓ Acessibilidade via teclado
✓ Estados visuais consistentes
✓ Filtros funcionais
✓ Interface profissional
✓ Fácil manutenção