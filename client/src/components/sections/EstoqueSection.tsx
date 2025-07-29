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
  Calendar,

  ArrowRightLeft,
  Send,
  Inbox,
  RotateCcw
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
  const { isOpen: confirmOpen, confirmData, showConfirm, closeConfirm, handleConfirm } = useCustomConfirm();
  const [activeTab, setActiveTab] = useState('produtos');
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterUnit, setFilterUnit] = useState('all');
  // Usar hooks para dados reais da API
  const {
    products,
    isLoading: productsLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    isCreating,
    isUpdating,
    isDeleting
  } = useProducts();
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
  // Usar hooks para vendas e clientes
  const {
    sales,
    isLoading: salesLoading,
    createSale
  } = useSales();

  const {
    clients,
    isLoading: clientsLoading
  } = useClients();

  // Hook para transferências
  const {
    transfers,
    branches,
    isLoadingTransfers,
    isLoadingBranches,
    createTransfer,
    updateTransfer,
    isCreatingTransfer,
    isUpdatingTransfer
  } = useTransfers();
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<any>(null);
  const [stockAdjustment, setStockAdjustment] = useState({ quantity: '', operation: 'add', reason: '' });
  
  // Estados para transferências
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    productId: '',
    fromBranchId: '',
    toBranchId: '',
    quantity: '',
    notes: ''
  });

  // Categorias que não têm sistema de estoque
  const categoriesWithoutStock = ['design', 'sites'];

  // Verificar se a categoria atual tem sistema de estoque
  const hasStockSystem = !categoriesWithoutStock.includes(selectedCategory);

  // Função para adicionar novo produto
  const addProduct = () => {
    if (!newProduct.name || !newProduct.currentStock) {
      showAlert({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e estoque atual."
      });
      return;
    }

    // Validação para produtos perecíveis
    if (newProduct.isPerishable && (!newProduct.manufacturingDate || !newProduct.expiryDate)) {
      showAlert({
        variant: "destructive",
        title: "Dados de produto perecível",
        description: "Para produtos perecíveis, preencha a data de fabricação e validade."
      });
      return;
    }

    const productData = {
      name: newProduct.name,
      stock: parseInt(newProduct.currentStock),
      minStock: parseInt(newProduct.minStock),
      price: parseFloat(newProduct.price) || 0,
      description: '',
      isPerishable: newProduct.isPerishable,
      manufacturingDate: newProduct.isPerishable ? new Date(newProduct.manufacturingDate) : undefined,
      expiryDate: newProduct.isPerishable ? new Date(newProduct.expiryDate) : undefined,
      businessCategory: selectedCategory,
      userId: userId
    };

    createProduct(productData);
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
    setShowAddProductModal(false);
    showAlert({
      title: "Produto Adicionado",
      description: `"${productData.name}" foi adicionado ao estoque com ${productData.stock} unidades!`,
      variant: "success"
    });
  };

  // Função para ajustar estoque manualmente
  const adjustStock = () => {
    if (!stockAdjustment.quantity || !stockProduct) {
      showAlert({
        variant: "destructive",
        title: "Quantidade obrigatória",
        description: "Por favor, preencha a quantidade para ajustar."
      });
      return;
    }

    const quantity = parseInt(stockAdjustment.quantity);
    const newStock = stockAdjustment.operation === 'add' 
      ? stockProduct.stock + quantity 
      : stockProduct.stock - quantity;

    if (newStock < 0) {
      showAlert({
        variant: "destructive",
        title: "Estoque insuficiente",
        description: "O estoque não pode ficar negativo."
      });
      return;
    }

    updateProduct({ 
      id: stockProduct.id, 
      data: { stock: newStock }
    });

    const operation = stockAdjustment.operation === 'add' ? 'adicionadas' : 'removidas';
    showAlert({
      title: "Estoque Ajustado",
      description: `${quantity} unidades ${operation} do estoque de "${stockProduct.name}"`,
      variant: "success"
    });
    
    setShowStockModal(false);
    setStockAdjustment({ quantity: '', operation: 'add', reason: '' });
  };

  // Função para processar venda e deduzir do estoque
  const processSale = (productId: number, quantitySold: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock < quantitySold) {
      showAlert({
        variant: "destructive",
        title: "Estoque insuficiente",
        description: `Disponível apenas ${product.stock} unidades do produto`
      });
      return;
    }

    // Atualizar estoque do produto
    updateProduct({ 
      id: productId, 
      data: { stock: product.stock - quantitySold }
    });

    // Registrar venda usando a API
    const saleData = {
      productId,
      clientId: 1, // Usar cliente padrão por enquanto
      quantity: quantitySold,
      totalPrice: product.price * quantitySold,
      paymentMethod: 'Dinheiro',
      businessCategory: selectedCategory,
      userId: userId,
      saleDate: new Date()
    };

    createSale(saleData);
    showAlert({
      title: "Venda Processada",
      description: `${quantitySold} unidades de "${product.name}" vendidas com sucesso`,
      variant: "success"
    });
  };

  // Funções operacionais para produtos
  const replenishStock = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateProduct({ 
        id: productId, 
        data: { stock: product.stock + 50 }
      });
      showAlert({
        title: "Estoque Reposto",
        description: "+50 unidades adicionadas ao produto com sucesso",
        variant: "success"
      });
    }
  };

  const markAsExpired = (productId: number) => {
    updateProduct({ 
      id: productId, 
      data: { stock: 0 }
    });
    showAlert({
      variant: "destructive",
      title: "Produto Vencido",
      description: "Produto marcado como vencido e estoque zerado automaticamente"
    });
  };

  // Função para editar produto
  const editProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setShowEditModal(true);
    }
  };

  // Função para salvar produto editado
  const saveEditedProduct = (editedProduct: any) => {
    updateProduct({ 
      id: editedProduct.id, 
      data: editedProduct 
    });
    setShowEditModal(false);
    setEditingProduct(null);
    showAlert({
      title: "Produto Atualizado",
      description: "As informações do produto foram salvas com sucesso",
      variant: "success"
    });
  };

  // Função para excluir produto
  const handleDeleteProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      showConfirm(
        {
          title: "Confirmar Exclusão",
          description: `Confirma a exclusão do produto "${product.name}"? Esta ação não pode ser desfeita.`,
          confirmText: "Excluir",
          cancelText: "Cancelar"
        },
        () => {
          deleteProduct(productId);
          showAlert({
            title: "Produto Excluído",
            description: "O produto foi removido do sistema com sucesso",
            variant: "success"
          });
        }
      );
    }
  };

  const addNewProduct = () => {
    const productData = {
      name: 'Novo Produto',
      description: '',
      stock: 0,
      minStock: 5,
      price: 10.00,
      isPerishable: false,
      businessCategory: selectedCategory,
      userId: userId
    };
    
    createProduct(productData);
    showAlert({
      title: "Produto Adicionado com Sucesso!",
      description: "Você pode editar os detalhes clicando no botão de edição.",
      variant: "success"
    });
  };



  // Abas do sistema de estoque
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft }
  ];

  // Função para calcular dias até o vencimento
  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para determinar status do produto
  const getProductStatus = (stock: number, minStock: number, expiryDate?: string) => {
    if (expiryDate) {
      const daysLeft = getDaysUntilExpiry(expiryDate);
      if (daysLeft <= 0) return 'Vencido';
      if (daysLeft <= 3) return 'Vencimento Próximo';
    }
    if (stock <= 0) return 'Sem Estoque';
    if (stock <= minStock) return 'Estoque Baixo';
    return 'Em Estoque';
  };

  // Estado de loading para mostrar feedback ao usuário
  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  // Sistema agora usa 100% dados reais da API - funções mock removidas

  const renderProducts = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Gestão de Produtos</h3>
          <button 
            onClick={() => setShowAddProductModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 z-10" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48"
            >
            <option value="all">Todas as categorias</option>
            {selectedCategory === 'vendas' && (
              <>
                <option value="eletronicos">Eletrônicos</option>
                <option value="vestuario">Vestuário</option>
                <option value="calcados">Calçados</option>
              </>
            )}
            {selectedCategory === 'pet' && (
              <>
                <option value="racao">Ração</option>
                <option value="medicamentos">Medicamentos</option>
                <option value="acessorios">Acessórios</option>
                <option value="higiene">Higiene</option>
                <option value="brinquedos">Brinquedos</option>
              </>
            )}
            {selectedCategory === 'medico' && (
              <>
                <option value="analgesicos">Analgésicos</option>
                <option value="antibioticos">Antibióticos</option>
                <option value="equipamentos">Equipamentos</option>
                <option value="descartaveis">Descartáveis</option>
                <option value="epi">EPI</option>
              </>
            )}
            {selectedCategory === 'farmacia' && (
              <>
                <option value="analgesicos">Analgésicos</option>
                <option value="antibioticos">Antibióticos</option>
                <option value="vitaminas">Vitaminas</option>
                <option value="dermocosmeticos">Dermocosméticos</option>
              </>
            )}
            {selectedCategory === 'estetica' && (
              <>
                <option value="preenchedores">Preenchedores</option>
                <option value="neurotoxinas">Neurotoxinas</option>
                <option value="tratamentos">Tratamentos</option>
                <option value="cosmeticos">Cosméticos</option>
              </>
            )}
            </select>
          </div>
        </div>

        <div className="item-list">
          {products
            .map(product => ({
              ...product,
              status: getProductStatus(product.stock, product.minStock || 0, product.expiryDate?.toString())
            }))
            .filter(product => {
              // Filtro por termo de busca
              const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
              
              // Filtro por categoria
              const categoryMatch = filterCategory === 'all' || 
                product.category?.toLowerCase().includes(filterCategory.toLowerCase());
              
              return searchMatch && categoryMatch;
            })
            .map((product: any) => (
              <div key={product.id} className="list-item">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold text-gray-800 truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.category} • {product.stock} unidades
                      </p>
                      {product.description && (
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-green-600">
                        R$ {Number(product.price || 0).toFixed(2).replace('.', ',')}
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'Em Estoque' ? 'bg-green-100 text-green-800' :
                        product.status === 'Estoque Baixo' ? 'bg-yellow-100 text-yellow-800' :
                        product.status === 'Sem Estoque' ? 'bg-red-100 text-red-800' :
                        product.status === 'Vencido' ? 'bg-red-100 text-red-800' :
                        product.status === 'Vencimento Próximo' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setShowEditModal(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Editar produto"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setShowStockModal(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    title="Controle de estoque"
                  >
                    <Package className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setShowSaleModal(true);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                    title="Registrar venda"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => {
                      showConfirm({
                        title: 'Confirmar Exclusão',
                        message: `Tem certeza que deseja excluir o produto "${product.name}"?`,
                        onConfirm: () => handleDeleteProduct(product.id)
                      });
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Excluir produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

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

  const renderTransfers = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Transferências</h3>
        </div>

        <div className="item-list">
          {transfers?.map((transfer: any) => (
            <div key={transfer.id} className="list-item">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-800 truncate">
                      {transfer.productName || `Produto ID: ${transfer.productId}`}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {transfer.quantity} unidades
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      De: {transfer.fromBranchName} → Para: {transfer.toBranchName}
                    </p>
                  </div>

                  <div className="ml-4 text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!transfers || transfers.length === 0) && (
            <div className="text-center py-8">
              <ArrowRightLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma transferência encontrada</h3>
              <p className="text-gray-500">As transferências entre filiais aparecerão aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <h2 className="text-2xl font-bold text-gray-800">Estoque</h2>
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

      {/* Modais aqui */}
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
