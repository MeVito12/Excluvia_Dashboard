// === EXEMPLOS DE COMPONENTES PRONTOS PARA USAR ===
// Copie estes componentes para seu novo projeto

import React, { useState } from 'react';
import { Search, Plus, Package, ArrowRightLeft, Edit, Trash2, Eye } from 'lucide-react';

// 1. COMPONENTE DE FILTROS PADRONIZADO
const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  filterCategory, 
  setFilterCategory, 
  statusFilter, 
  setStatusFilter,
  categoryOptions = [],
  statusOptions = [],
  searchPlaceholder = "Buscar...",
  onClearFilters
}) => {
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setStatusFilter('all');
    if (onClearFilters) onClearFilters();
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

// 2. COMPONENTE DE LISTA DE ITENS PADRONIZADO
const ItemList = ({ 
  items = [], 
  onEdit, 
  onDelete, 
  onView,
  renderStatus,
  renderActions,
  emptyStateConfig = {
    icon: Package,
    title: "Nenhum item encontrado",
    description: "Os itens aparecerão aqui quando adicionados",
    actionLabel: "Adicionar Item",
    onAction: null
  }
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
                
                {renderActions && renderActions(item)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. COMPONENTE DE NAVEGAÇÃO POR ABAS
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

// 4. COMPONENTE DE STATUS BADGE
const StatusBadge = ({ status, variant = 'default' }) => {
  const getStatusClass = () => {
    switch (variant) {
      case 'success': return 'status-success';
      case 'warning': return 'status-warning';
      case 'danger': return 'status-danger';
      case 'info': return 'status-info';
      case 'pending': return 'status-pending';
      default: return 'status-info';
    }
  };

  return (
    <span className={`list-status-badge ${getStatusClass()}`}>
      {status}
    </span>
  );
};

// 5. COMPONENTE DE MODAL PADRÃO
const StandardModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "primary",
  maxWidth = "md" 
}) => {
  if (!isOpen) return null;

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      default: return 'max-w-md';
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${getMaxWidthClass()}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        <div className="modal-footer">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`flex-1 btn btn-${confirmVariant}`}
            >
              {confirmLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 btn btn-outline"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. COMPONENTE DE MÉTRICAS
const MetricCard = ({ 
  label, 
  value, 
  description, 
  icon: IconComponent, 
  iconColor = "blue",
  trend,
  onClick 
}) => {
  const getIconColorClass = () => {
    switch (iconColor) {
      case 'green': return 'bg-green-100 text-green-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      default: return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <div 
      className={`metric-card-standard ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="metric-card-content">
          <p className="metric-card-label">{label}</p>
          <p className="metric-card-value">{value}</p>
          {description && (
            <p className={`metric-card-description ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {description}
            </p>
          )}
        </div>
        {IconComponent && (
          <div className={`metric-card-icon ${getIconColorClass()}`}>
            <IconComponent className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

// 7. HOOK PERSONALIZADO PARA FILTROS
const useFilters = (initialData = [], searchFields = ['name']) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = initialData.filter(item => {
    // Filtro de busca
    const searchMatch = searchFields.some(field => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filtro de categoria
    const categoryMatch = filterCategory === 'all' || 
      item.category?.toLowerCase().includes(filterCategory.toLowerCase());
    
    // Filtro de status
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    
    return searchMatch && categoryMatch && statusMatch;
  });

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

// 8. EXEMPLO DE USO COMPLETO
const ExampleSection = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [showModal, setShowModal] = useState(false);
  
  // Dados de exemplo
  const mockData = [
    { 
      id: 1, 
      name: "Item 1", 
      description: "Descrição do item 1", 
      status: "active",
      category: "categoria1",
      metadata: "Informação adicional"
    },
    { 
      id: 2, 
      name: "Item 2", 
      description: "Descrição do item 2", 
      status: "inactive",
      category: "categoria2",
      metadata: "Outra informação"
    }
  ];
  
  // Usando o hook de filtros
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
    { value: 'categoria1', label: 'Categoria 1' },
    { value: 'categoria2', label: 'Categoria 2' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' }
  ];

  const handleEdit = (item) => {
    console.log('Editando:', item);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    console.log('Excluindo:', item);
  };

  const renderStatus = (item) => (
    <StatusBadge 
      status={item.status === 'active' ? 'Ativo' : 'Inativo'}
      variant={item.status === 'active' ? 'success' : 'warning'}
    />
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Exemplo de Seção</h1>
        <p className="section-subtitle">
          Demonstração do sistema de design padronizado
        </p>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Total de Itens"
          value={mockData.length}
          description="Itens cadastrados"
          icon={Package}
          iconColor="blue"
        />
        <MetricCard
          label="Ativos"
          value={mockData.filter(i => i.status === 'active').length}
          description="Itens ativos"
          icon={Package}
          iconColor="green"
        />
      </div>

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="main-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {activeTab === 'items' ? 'Lista de Itens' : 'Transferências'} ({filteredData.length})
          </h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
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
          onClearFilters={clearFilters}
        />

        <ItemList
          items={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          renderStatus={renderStatus}
          emptyStateConfig={{
            icon: Package,
            title: "Nenhum item encontrado",
            description: "Adicione itens para começar",
            actionLabel: "Adicionar Primeiro Item",
            onAction: () => setShowModal(true)
          }}
        />
      </div>

      <StandardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Adicionar Item"
        onConfirm={() => {
          console.log('Item adicionado');
          setShowModal(false);
        }}
        confirmLabel="Adicionar"
      >
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nome do Item</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Digite o nome"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea 
              className="form-textarea" 
              placeholder="Digite a descrição"
            />
          </div>
        </div>
      </StandardModal>
    </div>
  );
};

export default ExampleSection;

// === INSTRUÇÕES DE USO ===
/*
1. Copie os componentes necessários para seu projeto
2. Instale as dependências: npm install lucide-react
3. Configure o Tailwind CSS com as classes do arquivo EXPORT_CSS_CLASSES.css
4. Importe e use os componentes conforme o exemplo
5. Customize os dados e funcionalidades conforme sua necessidade

Exemplo de importação:
import { FilterBar, ItemList, TabNavigation, StatusBadge } from './components/StandardComponents';

O sistema é completamente modular e reutilizável!
*/