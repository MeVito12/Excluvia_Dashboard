import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategory } from '@/contexts/CategoryContext';
import { toast } from 'sonner';
import { 
  Package, 
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Minus,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Tipos do produto baseados no schema
interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  description?: string;
  isPerishable: boolean;
  manufacturingDate?: Date | null;
  expiryDate?: Date | null;
  businessCategory: string;
  userId: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface ProductFormData {
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  description: string;
  isPerishable: boolean;
  manufacturingDate: string;
  expiryDate: string;
}

// Função para obter status do produto baseado no estoque e validade
const getProductStatus = (stock: number, minStock: number, expiryDate?: Date | null) => {
  if (stock === 0) return { status: 'Sem Estoque', color: 'text-red-600 bg-red-50' };
  if (expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'Vencido', color: 'text-red-600 bg-red-50' };
    if (diffDays <= 3) return { status: 'Próximo ao Vencimento', color: 'text-orange-600 bg-orange-50' };
  }
  if (stock <= minStock) return { status: 'Estoque Baixo', color: 'text-yellow-600 bg-yellow-50' };
  return { status: 'Em Estoque', color: 'text-green-600 bg-green-50' };
};

// Função para fazer requisições à API
const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
};

const EstoqueFunctional = () => {
  const { selectedCategory } = useCategory();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockOperation, setStockOperation] = useState<'in' | 'out'>('in');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockReason, setStockReason] = useState('');

  // Formulário de produto
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    category: '',
    stock: 0,
    minStock: 10,
    price: 0,
    description: '',
    isPerishable: false,
    manufacturingDate: '',
    expiryDate: ''
  });

  // Query para buscar produtos
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () => apiRequest(`/api/products?businessCategory=${selectedCategory}&userId=1`)
  });

  // Mutation para criar produto
  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => 
      apiRequest('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          businessCategory: selectedCategory,
          manufacturingDate: data.manufacturingDate || null,
          expiryDate: data.expiryDate || null
        })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowAddModal(false);
      resetForm();
      toast.success('Produto criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    }
  });

  // Mutation para atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowEditModal(false);
      setEditingProduct(null);
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar produto: ${error.message}`);
    }
  });

  // Mutation para deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    }
  });

  // Mutation para atualizar estoque
  const updateStockMutation = useMutation({
    mutationFn: ({ id, quantity, reason, type }: { id: number; quantity: number; reason: string; type: 'in' | 'out' }) =>
      apiRequest(`/api/products/${id}/stock?businessCategory=${selectedCategory}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, reason, type })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowStockModal(false);
      setStockProduct(null);
      setStockQuantity('');
      setStockReason('');
      toast.success('Estoque atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar estoque: ${error.message}`);
    }
  });

  const resetForm = () => {
    setProductForm({
      name: '',
      category: '',
      stock: 0,
      minStock: 10,
      price: 0,
      description: '',
      isPerishable: false,
      manufacturingDate: '',
      expiryDate: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productForm });
    } else {
      createProductMutation.mutate(productForm);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      price: product.price,
      description: product.description || '',
      isPerishable: product.isPerishable,
      manufacturingDate: product.manufacturingDate ? new Date(product.manufacturingDate).toISOString().split('T')[0] : '',
      expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Confirma a exclusão do produto "${product.name}"?\n\nEsta ação não pode ser desfeita.`)) {
      deleteProductMutation.mutate(product.id);
    }
  };

  const handleStockUpdate = () => {
    if (!stockProduct || !stockQuantity || !stockReason) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    updateStockMutation.mutate({
      id: stockProduct.id,
      quantity: parseInt(stockQuantity),
      reason: stockReason,
      type: stockOperation
    });
  };

  const openStockModal = (product: Product, operation: 'in' | 'out') => {
    setStockProduct(product);
    setStockOperation(operation);
    setShowStockModal(true);
  };

  // Filtrar produtos
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorias disponíveis
  const categories = [...new Set(products.map((p: Product) => p.category))];

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Erro ao carregar produtos</h3>
          <p className="text-red-700">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
          <p className="text-sm text-red-600 mt-2">
            Execute o SQL schema no Supabase Dashboard para configurar o banco de dados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estoque</h2>
          <p className="text-gray-600">Gerenciamento completo de produtos</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de produtos */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product: Product) => {
                  const { status, color } = getProductStatus(product.stock, product.minStock, product.expiryDate);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500">{product.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.stock}</span>
                          <span className="text-gray-500">/ {product.minStock} mín</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openStockModal(product, 'in')}
                            className="text-green-600 hover:text-green-900"
                            title="Adicionar estoque"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openStockModal(product, 'out')}
                            className="text-orange-600 hover:text-orange-900"
                            title="Remover estoque"
                          >
                            <TrendingDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar produto"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir produto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500">Adicione produtos ao estoque para começar</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Adicionar/Editar Produto */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <input
                      type="text"
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.minStock}
                      onChange={(e) => setProductForm(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPerishable"
                      checked={productForm.isPerishable}
                      onChange={(e) => setProductForm(prev => ({ ...prev, isPerishable: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="isPerishable" className="text-sm font-medium text-gray-700">
                      Produto perecível
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {productForm.isPerishable && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fabricação</label>
                      <input
                        type="date"
                        value={productForm.manufacturingDate}
                        onChange={(e) => setProductForm(prev => ({ ...prev, manufacturingDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                      <input
                        type="date"
                        value={productForm.expiryDate}
                        onChange={(e) => setProductForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createProductMutation.isPending || updateProductMutation.isPending}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {createProductMutation.isPending || updateProductMutation.isPending 
                      ? 'Salvando...' 
                      : editingProduct ? 'Atualizar' : 'Criar'
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gerenciar Estoque */}
      {showStockModal && stockProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {stockOperation === 'in' ? 'Adicionar Estoque' : 'Remover Estoque'}
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Produto: <strong>{stockProduct.name}</strong></p>
                <p className="text-sm text-gray-600">Estoque atual: <strong>{stockProduct.stock}</strong></p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                  <input
                    type="number"
                    min="1"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivo *</label>
                  <input
                    type="text"
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    placeholder={stockOperation === 'in' ? 'Ex: Compra, Reposição' : 'Ex: Venda, Avaria'}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => {
                    setShowStockModal(false);
                    setStockProduct(null);
                    setStockQuantity('');
                    setStockReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStockUpdate}
                  disabled={updateStockMutation.isPending}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    stockOperation === 'in' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-orange-600 hover:bg-orange-700'
                  } disabled:opacity-50`}
                >
                  {updateStockMutation.isPending 
                    ? 'Atualizando...' 
                    : stockOperation === 'in' ? 'Adicionar' : 'Remover'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoqueFunctional;