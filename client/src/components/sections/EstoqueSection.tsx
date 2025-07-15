import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getSalesByCategory, 
  getClientsByCategory,
  type Sale,
  type Client
} from '@/lib/mockData';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

// Tipos do produto baseados no schema do banco
interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  description?: string;
  isPerishable: boolean;
  manufacturingDate?: string | null;
  expiryDate?: string | null;
  businessCategory: string;
  userId: number;
  createdAt: string;
}

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
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const queryClient = useQueryClient();

  // Query para buscar produtos do banco
  const { data: products = [], isLoading: productsLoading, error } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/products?businessCategory=${selectedCategory}&userId=1`);
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      return response.json();
    }
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    currentStock: '',
    manufacturingDate: '',
    expiryDate: '',
    isPerishable: false,
    category: 'Geral',
    price: '',
    minStock: '10'
  });

  const [sales, setSales] = useState(() => getSalesByCategory(selectedCategory));
  
  // Atualizar vendas quando a categoria mudar
  React.useEffect(() => {
    setSales(getSalesByCategory(selectedCategory));
  }, [selectedCategory]);

  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<any>(null);
  const [stockAdjustment, setStockAdjustment] = useState({ quantity: '', operation: 'add', reason: '' });

  // Categorias que não têm sistema de estoque
  const categoriesWithoutStock = ['design', 'sites'];

  // Verificar se a categoria atual tem sistema de estoque
  const hasStockSystem = !categoriesWithoutStock.includes(selectedCategory);

  // Mutations para banco de dados
  const createProductMutation = useMutation({
    mutationFn: (data: any) => 
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          businessCategory: selectedCategory,
          userId: 1,
          stock: parseInt(data.currentStock) || 0,
          minStock: parseInt(data.minStock) || 10,
          price: data.price || "0",
          manufacturingDate: data.manufacturingDate || null,
          expiryDate: data.expiryDate || null
        })
      }).then(res => {
        if (!res.ok) throw new Error('Erro ao criar produto');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        currentStock: '',
        manufacturingDate: '',
        expiryDate: '',
        isPerishable: false,
        category: 'Geral',
        price: '',
        minStock: '10'
      });
      toast.success('Produto adicionado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao adicionar produto: ' + error.message);
    }
  });

  // Mutation para atualizar estoque
  const updateStockMutation = useMutation({
    mutationFn: ({ id, quantity, reason, type }: { id: number; quantity: number; reason: string; type: 'in' | 'out' }) =>
      fetch(`/api/products/${id}/stock?businessCategory=${selectedCategory}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, reason, type })
      }).then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar estoque');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setShowStockModal(false);
      setStockAdjustment({ quantity: '', operation: 'add', reason: '' });
      toast.success('Estoque atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar estoque: ' + error.message);
    }
  });

  // Mutation para deletar produto
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => 
      fetch(`/api/products/${id}`, { 
        method: 'DELETE' 
      }).then(res => {
        if (!res.ok) throw new Error('Erro ao excluir produto');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  });

  // Função para adicionar novo produto
  const addProduct = () => {
    if (!newProduct.name || !newProduct.currentStock) {
      alert('Por favor, preencha nome e estoque atual.');
      return;
    }

    // Validação para produtos perecíveis
    if (newProduct.isPerishable && (!newProduct.manufacturingDate || !newProduct.expiryDate)) {
      alert('Para produtos perecíveis, preencha a data de fabricação e validade.');
      return;
    }

    createProductMutation.mutate(newProduct);
  };

  // Função para ajustar estoque manualmente
  const adjustStock = () => {
    if (!stockAdjustment.quantity || !stockProduct) {
      alert('Por favor, preencha a quantidade.');
      return;
    }

    const quantity = parseInt(stockAdjustment.quantity);
    const type = stockAdjustment.operation === 'add' ? 'in' : 'out';
    const reason = stockAdjustment.reason || (type === 'in' ? 'Ajuste manual - entrada' : 'Ajuste manual - saída');

    updateStockMutation.mutate({
      id: stockProduct.id,
      quantity,
      reason,
      type
    });
  };

  // Função para processar venda e deduzir do estoque
  const processSale = (productId: number, quantitySold: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    if (product.stock < quantitySold) {
      alert(`⚠️ Estoque insuficiente!\n\nDisponível: ${product.stock} unidades\nSolicitado: ${quantitySold} unidades`);
      return;
    }

    // Atualizar estoque via API
    updateStockMutation.mutate({
      id: productId,
      quantity: quantitySold,
      reason: `Venda processada - ${quantitySold} unidades`,
      type: 'out'
    });
  };

  // Função para editar produto
  const editProduct = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setShowEditModal(true);
    }
  };

  // Função para excluir produto
  const deleteProduct = (productId: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (product && confirm(`⚠️ Confirma a exclusão do produto "${product.name}"?\n\nEsta ação não pode ser desfeita.`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  // Se não tem sistema de estoque, mostrar interface de portfólio
  if (!hasStockSystem) {
    return (
      <div className="app-section">
        <div className="main-card">
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sistema de Portfólio</h3>
            <p className="text-gray-600 mb-6">
              Para negócios criativos, use a seção <strong>Atendimento</strong> para gerenciar seu portfólio de projetos.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-600" />
                <div className="text-left">
                  <h4 className="font-medium text-blue-900">Acesse seu portfólio</h4>
                  <p className="text-sm text-blue-700">Vá para Atendimento → Portfólio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Apenas aba de produtos
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package }
  ];

  // Filtrar produtos
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorias disponíveis
  const categories = [...new Set(products.map((p: Product) => p.category))];

  // Se há erro ao carregar dados
  if (error) {
    return (
      <div className="app-section">
        <div className="main-card">
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Erro ao carregar produtos</h3>
            <p className="text-red-700 mb-4">
              {error instanceof Error ? error.message : 'Erro desconhecido'}
            </p>
            <p className="text-sm text-red-600">
              Execute o SQL schema no Supabase Dashboard para configurar o banco de dados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-section">
      <div className="main-card">
        {/* Abas */}
        <div className="tab-navigation">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                <IconComponent className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo da aba produtos */}
        <div className="tab-content">
          {/* Header */}
          <div className="section-header">
            <div>
              <h3 className="section-title">Produtos</h3>
              <p className="section-subtitle">Gerencie seu estoque de produtos</p>
            </div>
            <button
              onClick={() => {
                setNewProduct({
                  name: '',
                  currentStock: '',
                  manufacturingDate: '',
                  expiryDate: '',
                  isPerishable: false,
                  category: 'Geral',
                  price: '',
                  minStock: '10'
                });
                setShowAddProductModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </button>
          </div>

          {/* Filtros */}
          <div className="filter-section">
            <div className="filter-group">
              <div className="search-input-wrapper">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de produtos */}
          {productsLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <Package className="empty-icon" />
              <h3 className="empty-title">Nenhum produto encontrado</h3>
              <p className="empty-subtitle">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Tente ajustar seus filtros ou adicione um novo produto.'
                  : 'Comece adicionando seu primeiro produto ao estoque.'
                }
              </p>
            </div>
          ) : (
            <div className="grid-container">
              {filteredProducts.map((product: Product) => {
                const status = getProductStatus(product.stock, product.minStock, product.expiryDate || undefined);
                
                return (
                  <div key={product.id} className="product-card">
                    <div className="card-header">
                      <h4 className="card-title">{product.name}</h4>
                      <div className="status-badge">
                        <div className="status-indicators">
                          {status === 'Vencido' && (
                            <XCircle className="w-4 h-4 text-red-600" title="Produto vencido" />
                          )}
                          {status === 'Próximo ao Vencimento' && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" title="Próximo ao vencimento" />
                          )}
                          {status === 'Estoque Baixo' && (
                            <Package className="w-4 h-4 text-orange-500" title="Estoque baixo" />
                          )}
                          {status === 'Sem Estoque' && (
                            <XCircle className="w-4 h-4 text-red-600" title="Sem estoque" />
                          )}
                          {status === 'Em Estoque' && (
                            <CheckCircle className="w-4 h-4 text-green-500" title="Em estoque" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="product-info">
                        <p className="product-category">{product.category}</p>
                        <p className="product-stock">Estoque: {product.stock} unidades</p>
                        <p className="product-price">Preço: R$ {Number(product.price || 0).toFixed(2)}</p>
                        {product.expiryDate && (
                          <p className="product-expiry">
                            <Calendar className="w-4 h-4" />
                            Validade: {new Date(product.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="action-buttons">
                        <button 
                          onClick={() => {
                            setStockProduct(product);
                            setShowStockModal(true);
                          }}
                          className="btn btn-outline btn-sm" 
                          title="Controlar estoque"
                        >
                          <Package className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const quantity = parseInt(prompt(`Quantas unidades de "${product.name}" foram vendidas?`) || '0');
                            if (quantity > 0) {
                              processSale(product.id, quantity);
                            }
                          }}
                          className="btn btn-outline btn-sm" 
                          title="Processar venda"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => editProduct(product.id)}
                          className="btn btn-outline btn-sm" 
                          title="Editar produto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="btn btn-outline btn-sm btn-danger" 
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
          )}
        </div>
      </div>

      {/* Modal para adicionar produto */}
      {showAddProductModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Novo Produto</h3>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    placeholder="Nome do produto"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria *</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                    placeholder="Categoria"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estoque Atual *</label>
                  <input
                    type="number"
                    value={newProduct.currentStock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, currentStock: e.target.value }))}
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estoque Mínimo</label>
                  <input
                    type="number"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, minStock: e.target.value }))}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="form-input"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newProduct.isPerishable}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, isPerishable: e.target.checked }))}
                    className="checkbox"
                  />
                  <span>Produto perecível</span>
                </label>
              </div>
              {newProduct.isPerishable && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Fabricação</label>
                    <input
                      type="date"
                      value={newProduct.manufacturingDate}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, manufacturingDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data de Validade</label>
                    <input
                      type="date"
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={addProduct}
                disabled={createProductMutation.isPending}
                className="btn btn-primary"
              >
                {createProductMutation.isPending ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para controle de estoque */}
      {showStockModal && stockProduct && (
        <div className="modal-backdrop">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h3 className="modal-title">Controlar Estoque</h3>
              <button 
                onClick={() => setShowStockModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-subtitle">Produto: {stockProduct.name}</p>
              <p className="modal-subtitle">Estoque atual: {stockProduct.stock} unidades</p>
              
              <div className="form-group">
                <label className="form-label">Operação</label>
                <select
                  value={stockAdjustment.operation}
                  onChange={(e) => setStockAdjustment(prev => ({ ...prev, operation: e.target.value }))}
                  className="form-input"
                >
                  <option value="add">Adicionar (+)</option>
                  <option value="remove">Remover (-)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Quantidade</label>
                <input
                  type="number"
                  value={stockAdjustment.quantity}
                  onChange={(e) => setStockAdjustment(prev => ({ ...prev, quantity: e.target.value }))}
                  className="form-input"
                  min="1"
                  placeholder="Quantidade"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Motivo (opcional)</label>
                <input
                  type="text"
                  value={stockAdjustment.reason}
                  onChange={(e) => setStockAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                  className="form-input"
                  placeholder="Motivo do ajuste"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowStockModal(false)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={adjustStock}
                disabled={updateStockMutation.isPending}
                className="btn btn-primary"
              >
                {updateStockMutation.isPending ? 'Atualizando...' : 'Atualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoqueSection;