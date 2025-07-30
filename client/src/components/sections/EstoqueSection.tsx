import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { useCustomConfirm } from '@/hooks/use-custom-confirm';
import { CustomConfirm } from '@/components/ui/custom-confirm';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { useClients } from '@/hooks/useClients';
import { useTransfers } from '@/hooks/useTransfers';
import type { Product, Transfer } from '@shared/schema';

import { 
  Package, 
  ArrowRightLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

// Função para obter status do produto baseado no estoque e validade
const getProductStatus = (stock: number, minStock: number, expiryDate?: string) => {
  if (stock === 0) return 'Sem Estoque';
  if (expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencido';
    if (diffDays <= 3) return 'Próximo ao Vencimento';
  }
  if (stock <= minStock) return 'Estoque Baixo';
  return 'Em Estoque';
};

const EstoqueSection = () => {
  const { selectedCategory } = useCategory();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const { showConfirm, isOpen: confirmOpen, confirmData, closeConfirm, handleConfirm } = useCustomConfirm();
  
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddTransferModal, setShowAddTransferModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForSalePrice, setShowForSalePrice] = useState(false);
  const [showPerishableDates, setShowPerishableDates] = useState(false);

  // Hooks para dados
  const { products = [], deleteProduct, updateProduct, isDeleting, isUpdating } = useProducts();
  const { transfers = [] } = useTransfers();

  // Tabs do sistema
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft }
  ];

  // Funções para manipular produtos
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    showConfirm({
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir o produto "${product.name}"?`
    }, () => {
      deleteProduct(product.id);
      showAlert({
        title: 'Produto Excluído',
        description: `O produto "${product.name}" foi excluído com sucesso.`
      });
    });
  };

  const handleStockControl = (product: Product) => {
    showAlert({
      title: 'Controle de Estoque',
      description: `Produto: ${product.name}\nEstoque atual: ${product.stock} unidades\nEstoque mínimo: ${product.minStock || 0} unidades`
    });
  };



  // Renderização dos produtos
  const renderProducts = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Produtos ({products.length})
          </h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddProductModal(true)}
          >
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar produtos..."
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
              <option value="all">Todas as categorias</option>
              <option value="medicamentos">Medicamentos</option>
              <option value="cosmeticos">Cosméticos</option>
              <option value="higiene">Higiene</option>
              <option value="alimentos">Alimentos</option>
              <option value="equipamentos">Equipamentos</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="Em Estoque">Em Estoque</option>
              <option value="Estoque Baixo">Estoque Baixo</option>
              <option value="Vencido">Vencido</option>
              <option value="Próximo ao Vencimento">Próximo ao Vencimento</option>
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

        <div className="standard-list-container">
          <div className="standard-list-content">
            {products
              .filter((product: Product) => {
                const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const categoryMatch = filterCategory === 'all' || 
                  product.category?.toLowerCase().includes(filterCategory.toLowerCase());
                const status = getProductStatus(product.stock, product.minStock || 0, product.expiryDate?.toString());
                const statusMatch = statusFilter === 'all' || status === statusFilter;
                return searchMatch && categoryMatch && statusMatch;
              })
              .map((product: any) => {
                const status = getProductStatus(product.stock, product.minStock || 0, product.expiryDate?.toString());
                
                return (
                  <div key={product.id} className="standard-list-item group">
                    <div className="list-item-main">
                      <div className="list-item-title">{product.name}</div>
                      <div className="list-item-subtitle">{product.category} • {product.stock} unidades</div>
                      <div className="list-item-meta">
                        {product.description} | R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`list-status-badge ${
                        status === 'Em Estoque' ? 'status-success' :
                        status === 'Estoque Baixo' ? 'status-warning' :
                        status === 'Sem Estoque' ? 'status-danger' :
                        status === 'Vencido' ? 'status-danger' :
                        status === 'Próximo ao Vencimento' ? 'status-pending' :
                        'status-info'
                      }`}>
                        {status}
                      </span>
                      
                      <div className="list-item-actions">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="list-action-button edit"
                          title="Editar produto"
                          disabled={isUpdating}
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleStockControl(product)}
                          className="list-action-button view"
                          title="Controle de estoque"
                        >
                          <Package className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="list-action-button delete"
                          title="Excluir produto"
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          
          {products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500 mb-4">Comece adicionando produtos ao seu estoque</p>
              <button 
                onClick={() => setShowAddProductModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Adicionar Primeiro Produto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderização das transferências
  const renderTransfers = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Transferências ({transfers?.length || 0})
          </h3>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddTransferModal(true)}
          >
            <Plus className="w-4 h-4" />
            Adicionar Transferência
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar transferências..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovado</option>
            <option value="completed">Concluído</option>
            <option value="rejected">Rejeitado</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="btn btn-outline"
          >
            Limpar Filtros
          </button>
        </div>

        <div className="standard-list-container">
          <div className="standard-list-content">
            {transfers
              ?.filter((transfer: any) => {
                const searchMatch = (transfer.productName || `Produto ID: ${transfer.productId}`).toLowerCase().includes(searchTerm.toLowerCase());
                const statusMatch = statusFilter === 'all' || transfer.status === statusFilter;
                return searchMatch && statusMatch;
              })
              .map((transfer: any) => (
              <div key={transfer.id} className="standard-list-item group">
                <div className="list-item-main">
                  <div className="list-item-title">{transfer.productName || `Produto ID: ${transfer.productId}`}</div>
                  <div className="list-item-subtitle">{transfer.quantity} unidades</div>
                  <div className="list-item-meta">
                    De: {transfer.fromBranchName} → Para: {transfer.toBranchName}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`list-status-badge ${
                    transfer.status === 'pending' ? 'status-warning' :
                    transfer.status === 'approved' ? 'status-info' :
                    transfer.status === 'completed' ? 'status-success' :
                    transfer.status === 'rejected' ? 'status-danger' :
                    'status-info'
                  }`}>
                    {transfer.status === 'pending' ? 'Pendente' :
                     transfer.status === 'approved' ? 'Aprovado' :
                     transfer.status === 'completed' ? 'Concluído' :
                     transfer.status === 'rejected' ? 'Rejeitado' :
                     transfer.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(!transfers || transfers.length === 0) && (
          <div className="text-center py-8">
            <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma transferência encontrada</h3>
            <p className="text-gray-500">As transferências entre filiais aparecerão aqui</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Estoque</h1>
        <p className="section-subtitle">
          Gerencie produtos, estoque e transferências entre filiais
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="metrics-grid">
        {activeTab === 'produtos' ? (
          <>
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estoque Bom</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.minStock || 0), product.expiryDate);
                      return status === 'Em Estoque';
                    }).length || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Produtos em condições normais</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.minStock || 0), product.expiryDate);
                      return status === 'Estoque Baixo';
                    }).length || 0}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Produtos com baixo estoque</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próximos ao Vencimento</p>
                  <p className="text-2xl font-bold text-orange-700 mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.minStock || 0), product.expiryDate);
                      return status === 'Próximo ao Vencimento';
                    }).length || 0}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Produtos próximos do vencimento</p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Vencidos</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.minStock || 0), product.expiryDate);
                      return status === 'Vencido';
                    }).length || 0}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Produtos que já venceram</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-1">
                    {transfers?.filter((transfer: any) => transfer.status === 'pending').length || 0}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Aguardando aprovação</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <ArrowRightLeft className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {transfers?.filter((transfer: any) => transfer.status === 'approved').length || 0}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Aprovadas para execução</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {transfers?.filter((transfer: any) => transfer.status === 'completed').length || 0}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Transferências finalizadas</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <ArrowRightLeft className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejeitadas</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {transfers?.filter((transfer: any) => transfer.status === 'rejected').length || 0}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Transferências canceladas</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <ArrowRightLeft className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </>
        )}
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

      {/* Modal Adicionar Produto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Adicionar Novo Produto</h3>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              showAlert({
                title: "Produto Adicionado",
                description: "O produto foi adicionado com sucesso ao estoque!"
              });
              setShowAddProductModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ex: Paracetamol 500mg"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                    <input
                      name="minStock"
                      type="number"
                      min="0"
                      defaultValue="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      defaultValue="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="100"
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      id="forSale"
                      name="forSale"
                      type="checkbox"
                      onChange={(e) => setShowForSalePrice(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="forSale" className="text-sm font-medium text-gray-700">
                      Está à venda
                    </label>
                  </div>
                  
                  {showForSalePrice && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda</label>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      id="isPerishable"
                      name="isPerishable"
                      type="checkbox"
                      onChange={(e) => setShowPerishableDates(e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPerishable" className="text-sm font-medium text-gray-700">
                      É perecível
                    </label>
                  </div>
                  
                  {showPerishableDates && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fabricação</label>
                        <input
                          name="manufacturingDate"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                        <input
                          name="expiryDate"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Adicionar Produto
                  </button>
                </div>
              </div>
            </form>
            

          </div>
        </div>
      )}

      {/* Modal Adicionar Transferência */}
      {showAddTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Nova Transferência</h3>
              <button 
                onClick={() => setShowAddTransferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Selecione um produto</option>
                  {products.map((product: any) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filial Origem</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Selecione origem</option>
                  <option value="matriz">Matriz - Centro</option>
                  <option value="norte">Filial Norte</option>
                  <option value="sul">Filial Sul</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filial Destino</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Selecione destino</option>
                  <option value="matriz">Matriz - Centro</option>
                  <option value="norte">Filial Norte</option>
                  <option value="sul">Filial Sul</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddTransferModal(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    showAlert({
                      title: "Transferência Criada",
                      description: "A transferência foi criada e está pendente de aprovação!",
                      variant: "default"
                    });
                    setShowAddTransferModal(false);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Criar Transferência
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Produto */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Editar Produto</h3>
              <button 
                onClick={() => {
                  setShowEditProductModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedProduct = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                price: parseFloat(formData.get('price') as string),
                stock: parseInt(formData.get('stock') as string),
                minStock: parseInt(formData.get('minStock') as string)
              };
              
              updateProduct({ id: editingProduct.id, product: updatedProduct });
              setShowEditProductModal(false);
              setEditingProduct(null);
              showAlert({
                title: 'Produto Atualizado',
                description: `O produto "${updatedProduct.name}" foi atualizado com sucesso.`
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingProduct.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    name="description"
                    type="text"
                    defaultValue={editingProduct.description || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <input
                    name="category"
                    type="text"
                    defaultValue={editingProduct.category || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={editingProduct.price}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                    <input
                      name="stock"
                      type="number"
                      defaultValue={editingProduct.stock}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                  <input
                    name="minStock"
                    type="number"
                    defaultValue={editingProduct.minStock || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditProductModal(false);
                      setEditingProduct(null);
                    }}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomAlert isOpen={isOpen} onClose={closeAlert} {...alertData} />
      <CustomConfirm 
        isOpen={confirmOpen} 
        onClose={closeConfirm} 
        onConfirm={handleConfirm} 
        {...confirmData} 
      />
    </div>
  );
};

export default EstoqueSection;