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

import { 
  Package, 
  ArrowRightLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  DollarSign
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

  // Hooks para dados
  const { products = [] } = useProducts();
  const { transfers = [] } = useTransfers();

  // Tabs do sistema
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft }
  ];

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
              .filter(product => {
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
                          onClick={() => console.log('Editar produto', product.id)}
                          className="list-action-button edit"
                          title="Editar produto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => console.log('Controle estoque', product.id)}
                          className="list-action-button view"
                          title="Controle de estoque"
                        >
                          <Package className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => console.log('Registrar venda', product.id)}
                          className="list-action-button transfer"
                          title="Registrar venda"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => {
                            showConfirm({
                              title: 'Confirmar Exclusão',
                              message: `Tem certeza que deseja excluir o produto "${product.name}"?`,
                              onConfirm: () => console.log('Excluir produto', product.id)
                            });
                          }}
                          className="list-action-button delete"
                          title="Excluir produto"
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
              ?.filter(transfer => {
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
          {selectedCategory === 'farmacia' ? 'Farmácia Central' :
           selectedCategory === 'pet' ? 'Pet Clinic' :
           selectedCategory === 'medico' ? 'Clínica Saúde' :
           selectedCategory === 'vendas' ? 'Comercial Tech' :
           selectedCategory === 'design' ? 'Agência Creative' :
           selectedCategory === 'sites' ? 'Web Agency' : 'Categoria Selecionada'} - 
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

      {/* Modal Adicionar Produto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Adicionar Novo Produto</h3>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Paracetamol 500mg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="100"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    showAlert({
                      title: "Produto Adicionado",
                      description: "O produto foi adicionado com sucesso ao estoque!",
                      variant: "default"
                    });
                    setShowAddProductModal(false);
                  }}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Transferência */}
      {showAddTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
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
                <button
                  onClick={() => setShowAddTransferModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
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