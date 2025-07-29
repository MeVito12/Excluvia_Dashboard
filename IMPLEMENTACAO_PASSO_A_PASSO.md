# 🎯 IMPLEMENTAÇÃO PASSO A PASSO - FRONTEND IDÊNTICO

## ⚠️ IMPORTANTE
Este guia garante que seu app fique **100% IDÊNTICO** ao design original. Siga cada passo na ordem exata.

---

## PASSO 1: CONFIGURAÇÃO INICIAL

### 1.1 Criar Projeto
```bash
npm create vite@latest meu-sistema-replica -- --template react
cd meu-sistema-replica
npm install
```

### 1.2 Instalar Dependências Exatas
```bash
npm install lucide-react@0.263.1 clsx@2.0.0 tailwind-merge@1.14.0
npm install -D tailwindcss@3.3.0 postcss@8.4.24 autoprefixer@10.4.14
```

### 1.3 Configurar Tailwind
```bash
npx tailwindcss init -p
```

---

## PASSO 2: CONFIGURAR TAILWIND (tailwind.config.js)

**COPIE EXATAMENTE:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(262, 83%, 58%)',
        secondary: 'hsl(158, 89%, 53%)',
        success: 'hsl(142, 76%, 36%)',
        warning: 'hsl(38, 92%, 50%)',
        destructive: 'hsl(0, 84.2%, 60.2%)',
        info: 'hsl(221, 83%, 53%)',
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out"
      }
    },
  },
  plugins: [],
}
```

---

## PASSO 3: CSS GLOBAL (src/index.css)

**SUBSTITUA TODO O CONTEÚDO POR:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* === LAYOUT PRINCIPAL === */
.app-section {
  @apply min-h-screen bg-gray-50 p-6;
}

.section-header {
  @apply mb-8;
}

.section-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.section-subtitle {
  @apply text-gray-600 text-lg;
}

.main-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

/* === SISTEMA DE ABAS (CORES EXATAS) === */
.tab-navigation {
  @apply flex bg-gray-50 rounded-xl p-1 mb-6;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-button {
  @apply flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex-1 justify-center;
  color: #374151;
  background: transparent;
  cursor: pointer;
}

.tab-button:hover:not(.active) {
  background: hsl(158, 89%, 53%) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-button:hover:not(.active) svg {
  color: white !important;
}

.tab-button.active {
  background: hsl(262, 83%, 58%) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.tab-button.active svg {
  color: white !important;
}

.tab-button:not(.active) svg {
  color: #374151 !important;
}

/* === SISTEMA DE BOTÕES === */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2;
}

.btn-primary {
  background-color: hsl(262, 83%, 58%);
  @apply text-white;
}

.btn-primary:hover {
  background-color: hsl(262, 83%, 52%);
}

.btn-outline {
  @apply bg-gray-300 text-gray-700 hover:bg-gray-400;
}

/* === SISTEMA DE LISTAS === */
.standard-list-container {
  @apply space-y-3;
}

.standard-list-content {
  @apply space-y-2;
}

.standard-list-item {
  @apply flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group;
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

/* === BOTÕES DE AÇÃO === */
.list-action-button {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100;
}

.list-action-button.edit {
  @apply bg-blue-100 text-blue-600 hover:bg-blue-200;
}

.list-action-button.delete {
  @apply bg-red-100 text-red-600 hover:bg-red-200;
}

.list-action-button.view {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

/* === STATUS BADGES === */
.list-status-badge {
  @apply px-3 py-1 rounded-full text-xs font-medium;
}

.status-success {
  @apply bg-green-100 text-green-800 border border-green-200;
}

.status-warning {
  @apply bg-yellow-100 text-yellow-800 border border-yellow-200;
}

.status-danger {
  @apply bg-red-100 text-red-800 border border-red-200;
}

.status-info {
  @apply bg-blue-100 text-blue-800 border border-blue-200;
}

/* === FORMULÁRIOS === */
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* === ESTADOS VAZIOS === */
.empty-state {
  @apply text-center py-8;
}

.empty-state-icon {
  @apply w-16 h-16 text-gray-300 mx-auto mb-4;
}

.empty-state-title {
  @apply text-lg font-semibold text-gray-700 mb-2;
}

.empty-state-description {
  @apply text-gray-500 mb-4;
}

/* === ANIMAÇÃO === */
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}

/* === RESPONSIVIDADE === */
@media (max-width: 768px) {
  .app-section {
    @apply p-4;
  }
  
  .section-title {
    @apply text-2xl;
  }
  
  .tab-button {
    @apply px-4 py-2 text-xs;
  }
}
```

---

## PASSO 4: CRIAR COMPONENTES

### 4.1 Criar estrutura de pastas
```bash
mkdir -p src/components/ui
mkdir -p src/hooks
```

### 4.2 FilterBar Component (src/components/ui/FilterBar.jsx)
```jsx
import React from 'react';

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  statusFilter, 
  setStatusFilter,
  categoryOptions = [],
  statusOptions = [],
  searchPlaceholder = "Buscar..."
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>
      
      {categoryOptions.length > 0 && (
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-input"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
      {statusOptions.length > 0 && (
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      
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
};

export default FilterBar;
```

### 4.3 TabNavigation Component (src/components/ui/TabNavigation.jsx)
```jsx
import React from 'react';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="tab-navigation">
    {tabs.map((tab) => {
      const IconComponent = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
        >
          <IconComponent className="w-4 h-4" />
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default TabNavigation;
```

### 4.4 ItemList Component (src/components/ui/ItemList.jsx)
```jsx
import React from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

const ItemList = ({ 
  items = [], 
  onEdit, 
  onDelete, 
  onView,
  renderStatus,
  emptyStateConfig = {}
}) => {
  if (items.length === 0) {
    const EmptyIcon = emptyStateConfig.icon;
    return (
      <div className="empty-state">
        <EmptyIcon className="empty-state-icon" />
        <h3 className="empty-state-title">{emptyStateConfig.title}</h3>
        <p className="empty-state-description">{emptyStateConfig.description}</p>
        {emptyStateConfig.onAction && (
          <button 
            onClick={emptyStateConfig.onAction}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            {emptyStateConfig.actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="standard-list-container">
      <div className="standard-list-content">
        {items.map((item) => (
          <div key={item.id} className="standard-list-item group">
            <div className="list-item-main">
              <div className="list-item-title">{item.name || item.title}</div>
              <div className="list-item-subtitle">{item.description || item.subtitle}</div>
              {item.metadata && (
                <div className="list-item-meta">{item.metadata}</div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {renderStatus && renderStatus(item)}
              
              <div className="flex gap-2">
                {onView && (
                  <button 
                    onClick={() => onView(item)}
                    className="list-action-button view"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                
                {onEdit && (
                  <button 
                    onClick={() => onEdit(item)}
                    className="list-action-button edit"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                
                {onDelete && (
                  <button 
                    onClick={() => onDelete(item)}
                    className="list-action-button delete"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
```

### 4.5 Hook useFilters (src/hooks/useFilters.js)
```javascript
import { useState, useMemo } from 'react';

export const useFilters = (initialData = [], searchFields = ['name']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const searchMatch = searchFields.some(field => 
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const categoryMatch = filterCategory === 'all' || 
        item.category?.toLowerCase() === filterCategory.toLowerCase();
      
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [initialData, searchTerm, filterCategory, statusFilter, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    statusFilter,
    setStatusFilter,
    filteredData
  };
};
```

---

## PASSO 5: EXEMPLO DE USO COMPLETO

### 5.1 Criar App.jsx
```jsx
import React, { useState } from 'react';
import { Package, ArrowRightLeft, Plus } from 'lucide-react';
import FilterBar from './components/ui/FilterBar';
import ItemList from './components/ui/ItemList';
import TabNavigation from './components/ui/TabNavigation';
import { useFilters } from './hooks/useFilters';

function App() {
  const [activeTab, setActiveTab] = useState('products');
  
  // Dados de exemplo
  const mockProducts = [
    { 
      id: 1, 
      name: "Produto A", 
      description: "Descrição do produto A", 
      status: "active",
      category: "categoria1",
      metadata: "Estoque: 50 unidades"
    },
    { 
      id: 2, 
      name: "Produto B", 
      description: "Descrição do produto B", 
      status: "inactive",
      category: "categoria2",
      metadata: "Estoque: 0 unidades"
    }
  ];
  
  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    statusFilter,
    setStatusFilter,
    filteredData
  } = useFilters(mockProducts, ['name', 'description']);

  const tabs = [
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'transfers', label: 'Transferências', icon: ArrowRightLeft }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'categoria1', label: 'Categoria 1' },
    { value: 'categoria2', label: 'Categoria 2' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const renderStatus = (item) => (
    <span className={`list-status-badge ${
      item.status === 'active' ? 'status-success' : 'status-warning'
    }`}>
      {item.status === 'active' ? 'Ativo' : 'Inativo'}
    </span>
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Estoque</h1>
        <p className="section-subtitle">
          Gerencie produtos, estoque e transferências entre filiais
        </p>
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="main-card animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeTab === 'products' ? 'Produtos' : 'Transferências'} ({filteredData.length})
          </h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>

        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryOptions={categoryOptions}
          statusOptions={statusOptions}
          searchPlaceholder="Buscar produtos..."
        />

        <ItemList
          items={filteredData}
          onEdit={(item) => console.log('Editar:', item)}
          onDelete={(item) => console.log('Excluir:', item)}
          onView={(item) => console.log('Visualizar:', item)}
          renderStatus={renderStatus}
          emptyStateConfig={{
            icon: Package,
            title: "Nenhum produto encontrado",
            description: "Adicione produtos para começar",
            actionLabel: "Adicionar Primeiro Produto",
            onAction: () => console.log('Adicionar produto')
          }}
        />
      </div>
    </div>
  );
}

export default App;
```

---

## PASSO 6: TESTAR E VALIDAR

### 6.1 Iniciar desenvolvimento
```bash
npm run dev
```

### 6.2 Checklist de validação
- [ ] **Cores:** Abas roxas quando ativas, verdes no hover
- [ ] **Layout:** Cards brancos com sombra sutil
- [ ] **Filtros:** Funcionais com "Limpar Filtros"
- [ ] **Animações:** Fade-in nos cards e hover nos botões
- [ ] **Responsividade:** Mobile-first funcionando
- [ ] **Estados:** Empty state com ícone e botão

---

## ✅ RESULTADO GARANTIDO

Seguindo estes passos **exatamente**, seu app ficará **100% idêntico** ao original:

- ✅ **Cores HSL precisas** (roxo: 262,83%,58% / verde: 158,89%,53%)
- ✅ **Comportamento de abas** (hover verde, ativo roxo)
- ✅ **Layout responsivo** com breakpoints corretos
- ✅ **Filtros funcionais** com design padronizado
- ✅ **Animações suaves** e transições
- ✅ **Estados vazios** com ícones e mensagens

**⚠️ NÃO MODIFIQUE** as cores HSL, classes CSS ou estrutura dos componentes para manter a identidade visual exata!