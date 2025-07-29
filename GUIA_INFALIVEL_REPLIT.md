# 🛡️ GUIA INFALÍVEL PARA REPLIT - FRONTEND IDÊNTICO

## ⚠️ PROBLEMA COMUM NO REPLIT
O Replit tem configurações específicas que podem quebrar a implementação. Este guia resolve todos os problemas.

---

## PASSO 1: CONFIGURAÇÃO INICIAL NO REPLIT

### 1.1 Criar Novo Repl
1. Vá no Replit
2. Clique "Create Repl"
3. Escolha "React (Vite)" template
4. Nome: "sistema-frontend-replica"

### 1.2 Aguardar Instalação Automática
**IMPORTANTE:** Deixe o Replit terminar a instalação inicial antes de fazer qualquer coisa.

---

## PASSO 2: LIMPAR ARQUIVOS PADRÃO

### 2.1 Deletar arquivos desnecessários
```bash
rm src/App.css
rm src/index.css
```

### 2.2 Criar estrutura correta
```bash
mkdir -p src/components/ui
mkdir -p src/hooks
```

---

## PASSO 3: INSTALAR DEPENDÊNCIAS (ORDEM IMPORTANTE)

### 3.1 Instalar uma por vez (evita conflitos no Replit)
```bash
npm install lucide-react
npm install clsx
npm install tailwind-merge
```

### 3.2 Configurar Tailwind (DEVE SER FEITO APÓS AS DEPENDÊNCIAS)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## PASSO 4: CONFIGURAR TAILWIND (tailwind.config.js)

**SUBSTITUA TODO O CONTEÚDO:**
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
      }
    },
  },
  plugins: [],
}
```

---

## PASSO 5: CSS GLOBAL (src/index.css)

**CRIAR NOVO ARQUIVO src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.app-section {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 1.5rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #6b7280;
  font-size: 1.125rem;
}

.main-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
}

.tab-navigation {
  display: flex;
  background-color: #f9fafb;
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  color: #374151;
  background: transparent;
  border: none;
  cursor: pointer;
}

.tab-button:hover:not(.active) {
  background-color: hsl(158, 89%, 53%) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.tab-button.active {
  background-color: hsl(262, 83%, 58%) !important;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: hsl(262, 83%, 58%);
  color: white;
}

.btn-primary:hover {
  background-color: hsl(262, 83%, 52%);
}

.btn-outline {
  background-color: #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #9ca3af;
}

.standard-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.standard-list-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.standard-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: border-color 0.2s ease;
}

.standard-list-item:hover {
  border-color: #d1d5db;
}

.list-item-main {
  flex: 1;
}

.list-item-title {
  font-weight: 600;
  color: #111827;
  font-size: 1.125rem;
}

.list-item-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.list-item-meta {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.list-action-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0;
  border: none;
  cursor: pointer;
}

.standard-list-item:hover .list-action-button {
  opacity: 1;
}

.list-action-button.edit {
  background-color: #dbeafe;
  color: #2563eb;
}

.list-action-button.edit:hover {
  background-color: #bfdbfe;
}

.list-action-button.delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.list-action-button.delete:hover {
  background-color: #fecaca;
}

.list-action-button.view {
  background-color: #f3f4f6;
  color: #6b7280;
}

.list-action-button.view:hover {
  background-color: #e5e7eb;
}

.list-status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.status-danger {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-info {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.empty-state-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin: 0 auto 1rem;
}

.empty-state-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state-description {
  color: #6b7280;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .app-section {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .tab-button {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
```

---

## PASSO 6: COMPONENTE FILTERBAR (src/components/ui/FilterBar.jsx)

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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
      <div style={{ flex: 1 }}>
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
          style={{ width: 'auto' }}
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
          style={{ width: 'auto' }}
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

---

## PASSO 7: COMPONENTE TABNAVIGATION (src/components/ui/TabNavigation.jsx)

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
          <IconComponent size={16} />
          {tab.label}
        </button>
      );
    })}
  </div>
);

export default TabNavigation;
```

---

## PASSO 8: COMPONENTE ITEMLIST (src/components/ui/ItemList.jsx)

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
            <Plus size={16} />
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
          <div key={item.id} className="standard-list-item">
            <div className="list-item-main">
              <div className="list-item-title">{item.name || item.title}</div>
              <div className="list-item-subtitle">{item.description || item.subtitle}</div>
              {item.metadata && (
                <div className="list-item-meta">{item.metadata}</div>
              )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {renderStatus && renderStatus(item)}
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {onView && (
                  <button 
                    onClick={() => onView(item)}
                    className="list-action-button view"
                    title="Visualizar"
                  >
                    <Eye size={16} />
                  </button>
                )}
                
                {onEdit && (
                  <button 
                    onClick={() => onEdit(item)}
                    className="list-action-button edit"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                )}
                
                {onDelete && (
                  <button 
                    onClick={() => onDelete(item)}
                    className="list-action-button delete"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
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

## PASSO 9: HOOK USEFILTERS (src/hooks/useFilters.js)

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

## PASSO 10: APP PRINCIPAL (src/App.jsx)

```jsx
import React, { useState } from 'react';
import { Package, ArrowRightLeft, Plus } from 'lucide-react';
import FilterBar from './components/ui/FilterBar';
import ItemList from './components/ui/ItemList';
import TabNavigation from './components/ui/TabNavigation';
import { useFilters } from './hooks/useFilters';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('products');
  
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

      <div className="main-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
            {activeTab === 'products' ? 'Produtos' : 'Transferências'} ({filteredData.length})
          </h3>
          <button className="btn btn-primary">
            <Plus size={16} />
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
          onEdit={(item) => alert('Editar: ' + item.name)}
          onDelete={(item) => alert('Excluir: ' + item.name)}
          onView={(item) => alert('Visualizar: ' + item.name)}
          renderStatus={renderStatus}
          emptyStateConfig={{
            icon: Package,
            title: "Nenhum produto encontrado",
            description: "Adicione produtos para começar",
            actionLabel: "Adicionar Primeiro Produto",
            onAction: () => alert('Adicionar produto')
          }}
        />
      </div>
    </div>
  );
}

export default App;
```

---

## PASSO 11: MAIN.JSX (src/main.jsx)

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## ⚠️ PROBLEMAS COMUNS NO REPLIT E SOLUÇÕES

### 1. "Tailwind não funciona"
**Solução:** Reinicie o Repl após configurar o Tailwind

### 2. "Componentes não aparecem"
**Solução:** Verifique se importou o CSS no App.jsx: `import './index.css';`

### 3. "Ícones não aparecem"
**Solução:** Use `size={16}` nos ícones do Lucide React

### 4. "Abas não funcionam"
**Solução:** CSS inline foi adicionado para garantir funcionamento

### 5. "Filtros não funcionam"
**Solução:** Estado está no App.jsx, não nos componentes filhos

---

## 🎯 TESTE FINAL

Após implementar tudo:

1. **Clique nas abas** - Devem trocar de cor (roxo ativo, verde hover)
2. **Digite no filtro** - Deve filtrar os itens
3. **Clique nos botões** - Devem mostrar alertas
4. **Teste responsivo** - Resize a tela

---

## ✅ GARANTIA

Se seguir **exatamente** estas instruções no Replit, o resultado será **idêntico** ao original:
- ✅ Cores corretas (roxo/verde)
- ✅ Layout responsivo
- ✅ Filtros funcionais
- ✅ Abas interativas
- ✅ Botões de ação funcionais

**NÃO PULE NENHUM PASSO** e **NÃO MODIFIQUE** o código fornecido!