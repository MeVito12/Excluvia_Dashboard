import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useTransfers } from '@/hooks/useTransfers';
import { 
  Package, 
  Search,
  Plus,
  Eye,
  Trash2,
  ArrowRightLeft,
  CheckCircle
} from 'lucide-react';

const EstoqueSection = () => {
  const { user } = useAuth();
  const { data: products = [] } = useProducts();
  const { data: transfers = [] } = useTransfers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const getProductStatus = (stock: number, minStock: number, expiryDate?: string) => {
    if (stock === 0) return 'Sem Estoque';
    if (stock <= minStock) return 'Estoque Baixo';
    
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 'Vencido';
      if (diffDays <= 7) return 'Vencimento Próximo';
    }
    
    return 'Em Estoque';
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Estoque</h2>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </button>
      </div>

      <div className="main-card">
        <div className="section-header">
          <h3 className="text-xl font-semibold text-gray-800">Produtos</h3>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todas as categorias</option>
              <option value="medicamentos">Medicamentos</option>
              <option value="alimentos">Alimentos</option>
              <option value="equipamentos">Equipamentos</option>
            </select>
          </div>
        </div>

        {/* Lista de Produtos */}
        <div className="space-y-3">
          {products
            .map((product: any) => ({
              ...product,
              status: getProductStatus(product.stock, product.minStock || 0, product.expiryDate?.toString())
            }))
            .filter((product: any) => {
              const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
              const categoryMatch = filterCategory === 'all' || 
                product.category?.toLowerCase().includes(filterCategory.toLowerCase());
              return searchMatch && categoryMatch;
            })
            .map((product: any) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  {/* Ícone do produto */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    product.status === 'Sem Estoque' || product.status === 'Vencido' ? 'bg-red-100' :
                    product.status === 'Estoque Baixo' || product.status === 'Vencimento Próximo' ? 'bg-yellow-100' :
                    'bg-green-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      product.status === 'Sem Estoque' || product.status === 'Vencido' ? 'text-red-600' :
                      product.status === 'Estoque Baixo' || product.status === 'Vencimento Próximo' ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>

                  {/* Informações principais */}
                  <div className="flex-1 ml-4 min-w-0">
                    <h4 className="text-base font-semibold text-gray-800 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {product.category} • {product.stock} unidades
                    </p>
                    {product.expiryDate && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        Vencimento: {new Date(product.expiryDate).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    
                    {/* Badge de status */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'Em Estoque' ? 'bg-green-100 text-green-800' :
                        product.status === 'Estoque Baixo' ? 'bg-yellow-100 text-yellow-800' :
                        product.status === 'Sem Estoque' ? 'bg-red-100 text-red-800' :
                        product.status === 'Vencido' ? 'bg-red-100 text-red-800' :
                        product.status === 'Vencimento Próximo' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="text-right mr-4">
                    <div className="text-lg font-bold text-gray-900">
                      R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center space-x-2">
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      title="Controle de estoque"
                    >
                      <Package className="w-4 h-4" />
                    </button>

                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
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

      {/* Seção de Transferências */}
      <div className="main-card mt-6">
        <div className="section-header">
          <h3 className="text-xl font-semibold text-gray-800">Transferências</h3>
        </div>

        <div className="space-y-3">
          {transfers?.map((transfer: any) => (
            <div key={transfer.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                {/* Ícone da transferência */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  transfer.status === 'pending' ? 'bg-yellow-100' :
                  transfer.status === 'approved' ? 'bg-blue-100' :
                  transfer.status === 'completed' ? 'bg-green-100' :
                  transfer.status === 'rejected' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  <ArrowRightLeft className={`w-5 h-5 ${
                    transfer.status === 'pending' ? 'text-yellow-600' :
                    transfer.status === 'approved' ? 'text-blue-600' :
                    transfer.status === 'completed' ? 'text-green-600' :
                    transfer.status === 'rejected' ? 'text-red-600' :
                    'text-gray-600'
                  }`} />
                </div>

                {/* Informações principais */}
                <div className="flex-1 ml-4 min-w-0">
                  <h4 className="text-base font-semibold text-gray-800 truncate">
                    {transfer.productName || `Produto ID: ${transfer.productId}`}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {transfer.quantity} unidades
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    De: {transfer.fromBranchName} → Para: {transfer.toBranchName}
                  </p>
                  
                  {/* Badge de status */}
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transfer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      transfer.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      transfer.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transfer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transfer.status === 'pending' ? 'Pendente' :
                       transfer.status === 'approved' ? 'Aprovado' :
                       transfer.status === 'completed' ? 'Concluído' :
                       transfer.status === 'rejected' ? 'Rejeitado' :
                       transfer.status}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-2">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    title="Aprovar transferência"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>

                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
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
    </div>
  );
};

export default EstoqueSection;