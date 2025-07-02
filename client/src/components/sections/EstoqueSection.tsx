import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const EstoqueSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Tabs do sistema
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 }
  ];

  // Dados mockados por categoria
  const getProductData = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, name: 'Pizza Margherita', category: 'Pizzas', stock: 50, minStock: 10, price: 35.00, status: 'Em Estoque' },
        { id: 2, name: 'Hambúrguer Artesanal', category: 'Hambúrgueres', stock: 25, minStock: 8, price: 28.00, status: 'Em Estoque' },
        { id: 3, name: 'Refrigerante 350ml', category: 'Bebidas', stock: 3, minStock: 20, price: 5.00, status: 'Estoque Baixo' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, name: 'Smartphone Galaxy S24', category: 'Eletrônicos', stock: 15, minStock: 5, price: 2899.99, status: 'Em Estoque' },
        { id: 2, name: 'Notebook Dell Inspiron', category: 'Eletrônicos', stock: 8, minStock: 3, price: 2499.99, status: 'Em Estoque' },
        { id: 3, name: 'Camiseta Polo Ralph Lauren', category: 'Vestuário', stock: 2, minStock: 10, price: 189.99, status: 'Estoque Baixo' }
      ];
    }
    return [
      { id: 1, name: 'Produto Geral', category: 'Geral', stock: 10, minStock: 5, price: 50.00, status: 'Em Estoque' }
    ];
  };

  const getSalesData = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, date: '2024-12-25', client: 'João Silva', items: ['Pizza Margherita x2'], total: 70.00, status: 'Concluída' },
        { id: 2, date: '2024-12-24', client: 'Maria Santos', items: ['Hambúrguer x1', 'Refrigerante x2'], total: 38.00, status: 'Concluída' },
        { id: 3, date: '2024-12-23', client: 'Carlos Oliveira', items: ['Pizza Margherita x1'], total: 35.00, status: 'Pendente' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, date: '2024-12-25', client: 'Ana Costa', items: ['Smartphone Galaxy S24'], total: 2899.99, status: 'Concluída' },
        { id: 2, date: '2024-12-24', client: 'Pedro Lima', items: ['Notebook Dell', 'Camiseta Polo'], total: 2689.98, status: 'Concluída' },
        { id: 3, date: '2024-12-23', client: 'Lucia Ferreira', items: ['Camiseta Polo x2'], total: 379.98, status: 'Pendente' }
      ];
    }
    return [
      { id: 1, date: '2024-12-25', client: 'Cliente', items: ['Produto'], total: 50.00, status: 'Concluída' }
    ];
  };

  const getClientData = () => {
    if (selectedCategory === 'alimenticio') {
      return [
        { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 450.00, status: 'Ativo' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 88888-8888', lastOrder: '2024-12-24', totalSpent: 280.00, status: 'Ativo' },
        { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 77777-7777', lastOrder: '2024-12-20', totalSpent: 120.00, status: 'Inativo' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 8500.00, status: 'Ativo' },
        { id: 2, name: 'Pedro Lima', email: 'pedro@email.com', phone: '(11) 88888-8888', lastOrder: '2024-12-24', totalSpent: 3200.00, status: 'Ativo' },
        { id: 3, name: 'Lucia Ferreira', email: 'lucia@email.com', phone: '(11) 77777-7777', lastOrder: '2024-12-20', totalSpent: 750.00, status: 'Ativo' }
      ];
    }
    return [
      { id: 1, name: 'Cliente Geral', email: 'cliente@email.com', phone: '(11) 99999-9999', lastOrder: '2024-12-25', totalSpent: 100.00, status: 'Ativo' }
    ];
  };

  const renderProducts = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Gestão de Produtos</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-10"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="modern-input w-48"
          >
            <option value="all">Todas as categorias</option>
            {selectedCategory === 'alimenticio' && (
              <>
                <option value="pizzas">Pizzas</option>
                <option value="hamburgueres">Hambúrgueres</option>
                <option value="bebidas">Bebidas</option>
              </>
            )}
            {selectedCategory === 'vendas' && (
              <>
                <option value="eletronicos">Eletrônicos</option>
                <option value="vestuario">Vestuário</option>
                <option value="casa">Casa e Decoração</option>
              </>
            )}
          </select>
        </div>

        <div className="item-list">
          {getProductData().map((product) => (
            <div key={product.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">Categoria: {product.category}</p>
                  <p className="text-sm text-gray-600">Estoque: {product.stock} unidades</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</p>
                  <span className={`badge ${
                    product.status === 'Em Estoque' ? 'badge-success' : 
                    product.status === 'Estoque Baixo' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline p-2">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="btn btn-outline p-2">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Histórico de Vendas</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Nova Venda
          </button>
        </div>

        <div className="item-list">
          {getSalesData().map((sale) => (
            <div key={sale.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">Venda #{sale.id}</h4>
                  <p className="text-sm text-gray-600">Cliente: {sale.client}</p>
                  <p className="text-sm text-gray-600">Data: {sale.date}</p>
                  <p className="text-sm text-gray-600">Items: {sale.items.join(', ')}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {sale.total.toFixed(2)}</p>
                  <span className={`badge ${
                    sale.status === 'Concluída' ? 'badge-success' : 
                    sale.status === 'Pendente' ? 'badge-warning' : 'badge-error'
                  }`}>
                    {sale.status}
                  </span>
                </div>
              </div>
              <button className="btn btn-outline p-2">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Base de Clientes</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Adicionar Cliente
          </button>
        </div>

        <div className="item-list">
          {getClientData().map((client) => (
            <div key={client.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{client.name}</h4>
                  <p className="text-sm text-gray-600">Email: {client.email}</p>
                  <p className="text-sm text-gray-600">Telefone: {client.phone}</p>
                  <p className="text-sm text-gray-600">Último pedido: {client.lastOrder}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {client.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mb-1">Total gasto</p>
                  <span className={`badge ${client.status === 'Ativo' ? 'badge-success' : 'badge-warning'}`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <button className="btn btn-outline p-2">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="animate-fade-in">
      <div className="content-grid">
        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Relatórios de Vendas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vendas Hoje</span>
              <span className="font-medium text-gray-900">R$ 6.499,97</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Vendas Esta Semana</span>
              <span className="font-medium text-gray-900">R$ 15.299,95</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Meta Mensal</span>
              <span className="font-medium text-gray-900">R$ 50.000,00</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-gray-500">30% da meta atingida</p>
          </div>
        </div>

        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Produtos Mais Vendidos</h3>
          <div className="space-y-3">
            {getProductData().slice(0, 3).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <span className="text-sm text-gray-600">{product.name}</span>
                </div>
                <span className="font-medium text-gray-900">{Math.floor(Math.random() * 20) + 5} unidades</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-card p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-blue-600" />
          <h4 className="font-medium text-gray-800">Notificações Instantâneas</h4>
        </div>
        <p className="text-sm text-gray-600">
          Você receberá alertas automáticos para: estoque baixo, produtos vencendo, novas vendas e clientes inativos.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'produtos':
        return renderProducts();
      case 'vendas':
        return renderSales();
      case 'clientes':
        return renderClients();
      case 'relatorios':
        return renderReports();
      default:
        return renderProducts();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Gestão de Estoque</h1>
        <p className="section-subtitle">
          Controle total dos seus produtos, vendas e clientes
        </p>
      </div>

      {/* Métricas de Estoque */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">126</p>
              <p className="text-xs text-green-600 mt-1">+5 esta semana</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ 6.499</p>
              <p className="text-xs text-green-600 mt-1">+18% vs ontem</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
              <p className="text-xs text-blue-600 mt-1">+12 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
              <p className="text-xs text-yellow-600 mt-1">Requer atenção</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {renderTabContent()}
    </div>
  );
};

export default EstoqueSection;