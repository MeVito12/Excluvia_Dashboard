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
  const { showConfirm, confirmOpen, confirmData, closeConfirm, handleConfirm } = useCustomConfirm();
  
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Hooks para dados
  const { data: products = [] } = useProducts();
  const { data: transfers = [] } = useTransfers();

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
            onClick={() => console.log('Adicionar produto')}
          >
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-64 px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas as categorias</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="cosmeticos">Cosméticos</option>
            <option value="higiene">Higiene</option>
          </select>
        </div>

        <div className="standard-list-container">
          <div className="standard-list-content">
            {products
              .filter(product => {
                const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const categoryMatch = filterCategory === 'all' || 
                  product.category?.toLowerCase().includes(filterCategory.toLowerCase());
                return searchMatch && categoryMatch;
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
                onClick={() => console.log('Adicionar primeiro produto')}
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
            onClick={() => console.log('Adicionar transferência')}
          >
            <Plus className="w-4 h-4" />
            Adicionar Transferência
          </button>
        </div>

        <div className="standard-list-container">
          <div className="standard-list-content">
            {transfers?.map((transfer: any) => (
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