// EXEMPLOS PRÁTICOS DE COMPONENTES PARA REPLICAÇÃO EXATA

// ==================== 1. METRIC CARD PADRÃO ====================
const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="metric-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-black mt-1">{value}</p>
        <p className={`text-xs mt-1 text-${color}-600`}>{subtitle}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

// ==================== 2. LISTA PADRONIZADA ====================
const StandardList = ({ items, title, onAdd }) => (
  <div className="main-card p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">
        {title} ({items.length})
      </h3>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      )}
    </div>

    <div className="standard-list-container">
      <div className="standard-list-content">
        {items.map((item) => (
          <div key={item.id} className="standard-list-item group">
            <div className="list-item-main">
              <div className="list-item-title">{item.title}</div>
              <div className="list-item-subtitle">{item.subtitle}</div>
              <div className="list-item-meta">{item.meta}</div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`list-status-badge ${getStatusClass(item.status)}`}>
                {item.statusLabel}
              </span>
              
              <div className="list-item-actions">
                <button className="list-action-button view" title="Visualizar">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="list-action-button edit" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="list-action-button delete" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ==================== 3. SIDEBAR COMPLETA ====================
const Sidebar = ({ activeSection, onSectionChange, userProfile }) => (
  <div className="w-70 bg-gray-900 text-white fixed left-0 top-0 h-full overflow-y-auto">
    {/* Logo área */}
    <div className="p-6 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg">Sistema</h1>
          <p className="text-xs text-gray-400">{userProfile.category}</p>
        </div>
      </div>
    </div>

    {/* Menu Navigation */}
    <nav className="py-4">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
            activeSection === item.id
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>

    {/* User Profile Footer */}
    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium">{userProfile.name}</p>
          <p className="text-xs text-gray-400">{userProfile.email}</p>
        </div>
      </div>
    </div>
  </div>
);

// ==================== 4. HEADER DE SEÇÃO ====================
const SectionHeader = ({ title, subtitle, children }) => (
  <div className="app-section">
    <div className="section-header">
      <h1 className="section-title">{title}</h1>
      <p className="section-subtitle">{subtitle}</p>
    </div>
    {children}
  </div>
);

// ==================== 5. GRID DE MÉTRICAS ====================
const MetricsGrid = ({ metrics }) => (
  <div className="metrics-grid">
    {metrics.map((metric, index) => (
      <MetricCard
        key={index}
        title={metric.label}
        value={metric.value}
        subtitle={metric.change}
        icon={metric.icon}
        color={metric.color}
      />
    ))}
  </div>
);

// ==================== 6. SISTEMA DE TABS ====================
const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="tab-navigation">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
      >
        <tab.icon className="w-4 h-4" />
        {tab.label}
      </button>
    ))}
  </div>
);

// ==================== 7. MODAL PADRÃO ====================
const StandardModal = ({ isOpen, onClose, title, children, onConfirm, confirmText = "Confirmar" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== 8. FILTROS PADRONIZADOS ====================
const FilterSection = ({ searchTerm, onSearchChange, dateFrom, dateTo, onDateFromChange, onDateToChange, onClearFilters }) => (
  <div className="flex flex-wrap gap-4 items-center mb-6">
    <div className="flex-1">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="form-input"
      />
    </div>
    <input
      type="date"
      value={dateFrom}
      onChange={(e) => onDateFromChange(e.target.value)}
      className="form-input"
      placeholder="Data inicial"
    />
    <input
      type="date"
      value={dateTo}
      onChange={(e) => onDateToChange(e.target.value)}
      className="form-input"
      placeholder="Data final"
    />
    <button
      onClick={onClearFilters}
      className="btn btn-outline"
    >
      Limpar Filtros
    </button>
  </div>
);

// ==================== 9. HELPER FUNCTIONS ====================
const getStatusClass = (status) => {
  switch (status) {
    case 'success': case 'active': case 'completed': return 'status-success';
    case 'warning': case 'pending': case 'low-stock': return 'status-warning';
    case 'danger': case 'error': case 'expired': return 'status-danger';
    case 'info': case 'scheduled': return 'status-info';
    default: return 'status-pending';
  }
};

// ==================== 10. EXEMPLO DE PÁGINA COMPLETA ====================
const ExampleSection = () => {
  const [activeTab, setActiveTab] = useState('lista');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const metrics = [
    { label: 'Total Itens', value: '245', change: '+12% este mês', icon: Package, color: 'green' },
    { label: 'Pendentes', value: '8', change: 'Requer atenção', icon: Clock, color: 'yellow' },
    { label: 'Concluídos', value: '237', change: '96% taxa sucesso', icon: CheckCircle, color: 'blue' },
    { label: 'Receita', value: 'R$ 15.240', change: '+8% vs mês anterior', icon: DollarSign, color: 'purple' }
  ];

  const tabs = [
    { id: 'lista', label: 'Lista', icon: List },
    { id: 'graficos', label: 'Gráficos', icon: BarChart3 },
    { id: 'relatorios', label: 'Relatórios', icon: FileText }
  ];

  return (
    <SectionHeader 
      title="Exemplo de Seção" 
      subtitle="Demonstração do design padrão completo"
    >
      <MetricsGrid metrics={metrics} />
      
      <div className="main-card p-6">
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <FilterSection
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFrom=""
          dateTo=""
          onDateFromChange={() => {}}
          onDateToChange={() => {}}
          onClearFilters={() => setSearchTerm('')}
        />
        
        {/* Conteúdo da tab ativa */}
        <div className="animate-fade-in">
          {activeTab === 'lista' && <div>Conteúdo da lista...</div>}
          {activeTab === 'graficos' && <div>Gráficos...</div>}
          {activeTab === 'relatorios' && <div>Relatórios...</div>}
        </div>
      </div>

      <StandardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modal de Exemplo"
        onConfirm={() => setShowModal(false)}
      >
        <p>Conteúdo do modal...</p>
      </StandardModal>
    </SectionHeader>
  );
};

export default ExampleSection;