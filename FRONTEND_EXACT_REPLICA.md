# RÉPLICA EXATA DO FRONTEND - ESPECIFICAÇÕES COMPLETAS

## 🎯 OBJETIVO
Replicar 100% o design, comportamento e aparência visual deste sistema em outro projeto React.

---

## 1. CONFIGURAÇÃO BASE OBRIGATÓRIA

### Package.json - Dependências Exatas
```json
{
  "name": "sistema-gestao-replica",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "@tanstack/react-query": "^4.32.0",
    "wouter": "^2.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Tailwind Config - Configuração Idêntica
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
        // Cores HSL idênticas ao sistema original
        primary: 'hsl(262, 83%, 58%)',        // Roxo principal
        secondary: 'hsl(158, 89%, 53%)',      // Verde secundário
        accent: 'hsl(158, 89%, 53%)',         // Verde accent
        background: 'hsl(0, 0%, 100%)',       // Branco
        foreground: 'hsl(222.2, 84%, 4.9%)', // Texto escuro
        muted: 'hsl(210, 40%, 96.1%)',       // Cinza claro
        border: 'hsl(214.3, 31.8%, 91.4%)',  // Borda padrão
        // Cores funcionais
        success: 'hsl(142, 76%, 36%)',        // Verde sucesso
        warning: 'hsl(38, 92%, 50%)',         // Amarelo aviso
        destructive: 'hsl(0, 84.2%, 60.2%)', // Vermelho erro
        info: 'hsl(221, 83%, 53%)',          // Azul informação
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-up": "slide-up 0.3s ease-out"
      }
    },
  },
  plugins: [],
}
```

---

## 2. CSS GLOBAL COMPLETO (src/index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* === HIERARQUIA Z-INDEX EXATA === */
.modal-overlay {
  z-index: 9999 !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.modal-content {
  z-index: 10000 !important;
  position: relative !important;
}

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

/* === SISTEMA DE CARDS === */
.main-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.metric-card-standard {
  @apply bg-white border border-gray-200 rounded-lg p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:border-gray-300;
}

.list-card {
  @apply bg-white border border-gray-200 rounded-lg p-3 md:p-4 transition-all duration-300 hover:shadow-md hover:border-gray-300;
}

/* === SISTEMA DE ABAS === */
.tab-navigation {
  @apply flex bg-gray-50 rounded-xl p-1 mb-6 relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.tab-button {
  @apply flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex-1 justify-center;
  color: #374151;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer !important;
  user-select: none;
  pointer-events: auto !important;
  position: relative;
  z-index: 20;
}

.tab-button:hover:not(.active) {
  background: hsl(158, 89%, 53%) !important;
  color: white !important;
  transform: translateY(-1px);
  cursor: pointer !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-button:hover:not(.active) svg {
  color: white !important;
  transition: all 0.3s ease;
}

.tab-button.active {
  @apply bg-white text-white shadow-lg;
  background: hsl(262, 83%, 58%) !important;
  color: white !important;
  transform: translateY(-2px);
}

.tab-button.active svg {
  color: white !important;
  transition: all 0.3s ease;
}

.tab-button:not(.active) {
  color: #374151 !important;
}

.tab-button:not(.active) svg {
  color: #374151 !important;
  transition: all 0.3s ease;
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

/* === SISTEMA DE BOTÕES === */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2;
}

.btn-primary {
  @apply text-white hover:opacity-90 focus:ring-2;
  background-color: hsl(262, 83%, 58%);
}

.btn-primary:hover {
  background-color: hsl(262, 83%, 52%);
}

.btn-outline {
  @apply bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500;
}

.btn-success {
  background-color: hsl(142, 76%, 36%);
  @apply text-white hover:opacity-90;
}

.btn-danger {
  background-color: hsl(0, 84%, 60%);
  @apply text-white hover:opacity-90;
}

/* === BOTÕES DE AÇÃO EM LISTAS === */
.list-action-button {
  @apply w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100;
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

.list-action-button.view {
  @apply bg-gray-100 text-gray-600 hover:bg-gray-200;
}

/* === SISTEMA DE STATUS === */
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

.status-pending {
  @apply bg-gray-100 text-gray-800 border border-gray-200;
}

/* === SISTEMA DE FORMULÁRIOS === */
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent;
  focus:ring-color: hsl(262, 83%, 58%);
}

.form-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent bg-white;
  focus:ring-color: hsl(262, 83%, 58%);
}

.form-textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-vertical min-h-[100px];
  focus:ring-color: hsl(262, 83%, 58%);
}

/* === SISTEMA DE MODAIS === */
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl;
}

.modal-header {
  @apply flex justify-between items-center mb-4;
}

.modal-title {
  @apply text-lg font-semibold text-gray-800;
}

.modal-close {
  @apply text-gray-400 hover:text-gray-600 text-xl cursor-pointer;
}

.modal-body {
  @apply space-y-4;
}

.modal-footer {
  @apply flex gap-3 pt-4;
}

/* === ANIMAÇÕES === */
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* === RESPONSIVIDADE === */
@media (max-width: 768px) {
  .app-section {
    @apply p-4;
  }
  
  .section-title {
    @apply text-2xl;
  }
  
  .tab-navigation {
    @apply flex-wrap;
  }
  
  .tab-button {
    @apply px-4 py-2 text-xs;
  }
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
```

---

## 3. COMPONENTES REACT EXATOS

### FilterBar.jsx - Barra de Filtros Idêntica
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
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setStatusFilter('all');
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {categoryOptions.length > 0 && (
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
      )}
      
      {statusOptions.length > 0 && (
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
      )}
      
      <button
        onClick={handleClearFilters}
        className="btn btn-outline"
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default FilterBar;
```

### TabNavigation.jsx - Sistema de Abas Exato
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

### ItemList.jsx - Lista de Itens Idêntica
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

---

## 4. HOOKS PERSONALIZADOS

### useFilters.js - Hook de Filtros Exato
```javascript
import { useState, useMemo } from 'react';

export const useFilters = (initialData = [], searchFields = ['name']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      // Filtro de busca
      const searchMatch = searchFields.some(field => 
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Filtro de categoria
      const categoryMatch = filterCategory === 'all' || 
        item.category?.toLowerCase() === filterCategory.toLowerCase();
      
      // Filtro de status
      const statusMatch = statusFilter === 'all' || item.status === statusFilter;
      
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [initialData, searchTerm, filterCategory, statusFilter, searchFields]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setStatusFilter('all');
  };

  return {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    statusFilter,
    setStatusFilter,
    filteredData,
    clearFilters
  };
};
```

---

## 5. ESTRUTURA DE PASTAS EXATA

```
src/
├── components/
│   ├── ui/
│   │   ├── FilterBar.jsx
│   │   ├── ItemList.jsx
│   │   ├── TabNavigation.jsx
│   │   ├── StatusBadge.jsx
│   │   └── StandardModal.jsx
│   └── sections/
│       └── ExampleSection.jsx
├── hooks/
│   └── useFilters.js
├── utils/
│   └── cn.js
├── index.css
└── main.jsx
```

---

## 6. COMANDOS DE INSTALAÇÃO EXATOS

```bash
# 1. Criar projeto
npm create vite@latest meu-app-replica -- --template react
cd meu-app-replica

# 2. Instalar dependências exatas
npm install lucide-react@0.263.1 clsx@2.0.0 tailwind-merge@1.14.0

# 3. Configurar Tailwind
npm install -D tailwindcss@3.3.0 postcss@8.4.24 autoprefixer@10.4.14
npx tailwindcss init -p

# 4. Iniciar desenvolvimento
npm run dev
```

---

## 7. CHECKLIST DE VERIFICAÇÃO

### ✅ Visual
- [ ] Cores HSL idênticas (roxo: 262,83%,58% / verde: 158,89%,53%)
- [ ] Abas com hover verde e ativo roxo
- [ ] Botões com mesmas cores e hover
- [ ] Cards com shadow-sm e border-gray-200
- [ ] Filtros com focus:ring-blue-500

### ✅ Comportamento
- [ ] Abas funcionais com ícones
- [ ] Filtros funcionais (busca, categoria, status)
- [ ] Botão "Limpar Filtros" funcional
- [ ] Hover effects nos botões de ação
- [ ] Estados vazios com ícones e mensagens

### ✅ Responsividade
- [ ] Mobile-first com breakpoints corretos
- [ ] Flex-wrap nos filtros
- [ ] Padding responsivo (p-4 mobile, p-6 desktop)
- [ ] Texto responsivo (text-2xl mobile, text-3xl desktop)

### ✅ Animações
- [ ] fade-in nos cards
- [ ] Transições de 300ms
- [ ] Transform hover nos botões
- [ ] Opacity nos botões de ação

---

## 8. EXEMPLO DE IMPLEMENTAÇÃO COMPLETA

```jsx
// src/components/sections/ReplicaSection.jsx
import React, { useState } from 'react';
import { Package, ArrowRightLeft, Plus } from 'lucide-react';
import FilterBar from '../ui/FilterBar';
import ItemList from '../ui/ItemList';
import TabNavigation from '../ui/TabNavigation';
import { useFilters } from '../../hooks/useFilters';

const ReplicaSection = () => {
  const [activeTab, setActiveTab] = useState('items');
  
  const mockData = [
    { 
      id: 1, 
      name: "Item Exemplo 1", 
      description: "Descrição do item", 
      status: "active",
      category: "categoria1"
    }
  ];
  
  const {
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    statusFilter,
    setStatusFilter,
    filteredData,
    clearFilters
  } = useFilters(mockData, ['name', 'description']);

  const tabs = [
    { id: 'items', label: 'Itens', icon: Package },
    { id: 'transfers', label: 'Transferências', icon: ArrowRightLeft }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'categoria1', label: 'Categoria 1' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Seção Réplica</h1>
        <p className="section-subtitle">
          Réplica exata do design original
        </p>
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="main-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista ({filteredData.length})
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
          searchPlaceholder="Buscar itens..."
        />

        <ItemList
          items={filteredData}
          onEdit={(item) => console.log('Editar:', item)}
          onDelete={(item) => console.log('Excluir:', item)}
          emptyStateConfig={{
            icon: Package,
            title: "Nenhum item encontrado",
            description: "Adicione itens para começar"
          }}
        />
      </div>
    </div>
  );
};

export default ReplicaSection;
```

---

## ⚡ RESULTADO GARANTIDO

Seguindo estas especificações exatas, seu app ficará **100% idêntico** ao frontend deste sistema, incluindo:

- **Cores HSL precisas**
- **Animações e transições**  
- **Comportamento de hover**
- **Layout responsivo**
- **Componentes funcionais**
- **Estados visuais**

Qualquer desvio dessas especificações resultará em diferenças visuais.