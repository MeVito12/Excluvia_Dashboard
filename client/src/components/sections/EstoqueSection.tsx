import { useProducts, useCategories, useSubcategories, useSales, useClients, useAppointments, useFinancial, useTransfers, useMoneyTransfers, useBranches, useCreateProduct, useCreateSale, useCreateClient, useCreateAppointment, useCreateFinancial, useCreateTransfer, useCreateMoneyTransfer, useCreateBranch, useCreateCartSale } from "@/hooks/useData";
import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { formatDateBR } from '@/utils/dateFormat';
import { useAuth } from '@/contexts/AuthContext';
import type { Product, Transfer } from '@shared/schema';

import { 
  Package, 
  ArrowRightLeft,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  CheckCircle2,
  Calendar
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
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showStockControlModal, setShowStockControlModal] = useState(false);
  const [stockControlProduct, setStockControlProduct] = useState<Product | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showProductSelectionModal, setShowProductSelectionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transferQuantity, setTransferQuantity] = useState(1);

  // Estados para filtros de data
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      from: sevenDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);

  // Hooks para dados
  const { user } = useAuth();
  const companyId = user?.company_id;
  
  const { data: products = [], isLoading } = useProducts(undefined, companyId);
  const { data: categories = [] } = useCategories(companyId);
  const { data: subcategories = [] } = useSubcategories(companyId);
  const { data: transfers = [], isLoading: isTransfersLoading } = useTransfers(undefined, companyId);
  const { data: branches = [] } = useBranches(companyId);
  const { mutateAsync: createProduct } = useCreateProduct();
  const createTransfer = useCreateTransfer();
  
  // Para corrigir variáveis undefined
  const isUpdating = false;
  const isDeleting = false;
  const isCreatingTransfer = false;

  // Função para buscar nome do produto
  const getProductName = (productId: number): string => {
    const product = products.find((p: any) => p.id === productId);
    return product?.name || `Produto ID: ${productId}`;
  };

  // Função para selecionar produto na transferência
  const selectProductForTransfer = (product: Product, quantity: number) => {
    setSelectedProduct(product);
    setTransferQuantity(quantity);
    setShowProductSelectionModal(false);
  };

  // Função para remover produto selecionado
  const removeSelectedProduct = () => {
    setSelectedProduct(null);
    setTransferQuantity(1);
  };

  // Verificar se a empresa tem filiais
  const hasBranches = branches && branches.length > 1; // Mais de 1 filial (incluindo matriz)
  
  // Redefine aba ativa se transferências não estiverem disponíveis
  React.useEffect(() => {
    if (activeTab === 'transferencias' && !hasBranches) {
      setActiveTab('produtos');
    }
  }, [activeTab, hasBranches]);
  
  // Tabs do sistema - só mostra transferências se houver filiais
  const tabs = [
    { id: 'produtos', label: 'Produtos', icon: Package },
    ...(hasBranches ? [{ id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft }] : [])
  ];

  // Funções para manipular produtos
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    console.log("Action performed", {
      title: 'Confirmar Exclusão',
      description: `Tem certeza que deseja excluir o produto "${product.name}"?`
    }, () => {
      // deleteProduct(product.id);
      console.log("Action performed");
      // toast({
      //   title: 'Produto Excluído',
      //   description: `O produto "${product.name}" foi excluído com sucesso.`
      // });
    });
  };

  const handleStockControl = (product: Product) => {
    setStockControlProduct(product);
    setStockAdjustment(0);
    setAdjustmentReason('');
    setShowStockControlModal(true);
  };

  // Função para ações de transferência
  const handleTransferAction = async (transferId: number, newStatus: string) => {
    try {
      // updateTransfer({ id: transferId, transfer: { notes: `Status updated to ${newStatus}` } });
      
      const statusTexts = {
        'approved': 'aprovada',
        'completed': 'concluída',
        'rejected': 'rejeitada'
      };
      
      console.log("Action performed");
      // toast({
      //   title: 'Transferência Atualizada',
      //   description: `A transferência foi ${statusTexts[newStatus as keyof typeof statusTexts]} com sucesso.`
      // });
    } catch (error) {
      console.log("Action performed");
      // toast({
      //   title: 'Erro',
      //   description: 'Erro ao atualizar a transferência. Tente novamente.',
      //   variant: 'destructive'
      // });
    }
  };

  const handleStockAdjustment = async () => {
    if (!stockControlProduct || stockAdjustment === 0) {
      console.log("Action performed");
      // toast({
      //   title: 'Erro',
      //   description: 'Por favor, insira uma quantidade válida para ajustar.',
      //   variant: 'destructive'
      // });
      return;
    }

    const newStock = stockControlProduct.stock + stockAdjustment;
    if (newStock < 0) {
      console.log("Action performed");
      // toast({
      //   title: 'Erro',
      //   description: 'O estoque não pode ficar negativo.',
      //   variant: 'destructive'
      // });
      return;
    }

    try {
      await updateProduct({
        id: stockControlProduct.id,
        product: {
          ...stockControlProduct,
          stock: newStock
        }
      });

      console.log("Action performed");
      // toast({
      //   title: 'Estoque Atualizado',
      //   description: `Estoque do produto "${stockControlProduct.name}" atualizado de ${stockControlProduct.stock} para ${newStock} unidades.`
      // });

      setShowStockControlModal(false);
      setStockControlProduct(null);
      setStockAdjustment(0);
      setAdjustmentReason('');
    } catch (error) {
      console.log("Action performed");
      // toast({
      //   title: 'Erro',
      //   description: 'Erro ao atualizar o estoque. Tente novamente.',
      //   variant: 'destructive'
      // });
    }
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
              <option value="Estoque Crítico">Estoque Crítico</option>
              <option value="Estoque Baixo">Estoque Baixo</option>
              <option value="Sem Estoque">Sem Estoque</option>
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
              .filter((product: any) => {
                const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const categoryMatch = filterCategory === 'all' || 
                  product.category?.toLowerCase().includes(filterCategory.toLowerCase());
                const status = getProductStatus(product.stock, product.min_stock || 0, product.expiry_date?.toString());
                const statusMatch = statusFilter === 'all' || 
                  status === statusFilter ||
                  (statusFilter === 'Estoque Crítico' && (status === 'Estoque Baixo' || status === 'Sem Estoque'));
                return searchMatch && categoryMatch && statusMatch;
              })
              .map((product: any) => {
                const status = getProductStatus(product.stock, product.min_stock || 0, product.expiry_date?.toString());
                
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
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 whitespace-nowrap">De:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="dd/mm/aaaa"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Até:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="dd/mm/aaaa"
            />
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              const today = new Date();
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(today.getDate() - 7);
              setDateFrom(sevenDaysAgo.toISOString().split('T')[0]);
              setDateTo(today.toISOString().split('T')[0]);
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
                const productName = getProductName(transfer.productId);
                const searchMatch = productName.toLowerCase().includes(searchTerm.toLowerCase());
                const statusMatch = statusFilter === 'all' || transfer.status === statusFilter || 
                  (statusFilter === 'approved' && (transfer.status === 'approved' || transfer.status === 'in_transit'));
                
                // Filtro de data
                let dateMatch = true;
                if (dateFrom || dateTo) {
                  const transferDate = new Date(transfer.transfer_date || transfer.created_at);
                  const fromDate = dateFrom ? new Date(dateFrom) : null;
                  const toDate = dateTo ? new Date(dateTo) : null;
                  
                  if (fromDate && toDate) {
                    dateMatch = transferDate >= fromDate && transferDate <= toDate;
                  } else if (fromDate) {
                    dateMatch = transferDate >= fromDate;
                  } else if (toDate) {
                    dateMatch = transferDate <= toDate;
                  }
                }
                
                return searchMatch && statusMatch && dateMatch;
              })
              .map((transfer: any) => (
              <div key={transfer.id} className="standard-list-item group">
                <div className="list-item-main">
                  <div className="list-item-title">{getProductName(transfer.productId)}</div>
                  <div className="list-item-subtitle">{transfer.quantity} unidades</div>
                  <div className="list-item-meta">
                    De: {transfer.fromBranchName} → Para: {transfer.toBranchName}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`list-status-badge ${
                    transfer.status === 'pending' ? 'status-warning' :
                    transfer.status === 'approved' || transfer.status === 'in_transit' ? 'status-info' :
                    transfer.status === 'completed' ? 'status-success' :
                    transfer.status === 'rejected' ? 'status-danger' :
                    'status-info'
                  }`}>
                    {transfer.status === 'pending' ? 'Pendente' :
                     transfer.status === 'approved' || transfer.status === 'in_transit' ? 'Aprovado' :
                     transfer.status === 'completed' ? 'Concluído' :
                     transfer.status === 'rejected' ? 'Rejeitado' :
                     transfer.status}
                  </span>
                  
                  <div className="list-item-actions">
                    {transfer.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleTransferAction(transfer.id, 'approved')}
                          className="list-action-button edit"
                          title="Aprovar transferência"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleTransferAction(transfer.id, 'rejected')}
                          className="list-action-button delete"
                          title="Rejeitar transferência"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {(transfer.status === 'approved' || transfer.status === 'in_transit') && (
                      <button 
                        onClick={() => handleTransferAction(transfer.id, 'completed')}
                        className="list-action-button view"
                        title="Marcar como concluída"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
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
                  <p className="text-2xl font-bold text-black mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.min_stock || 0), product.expiry_date);
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
                  <p className="text-sm font-medium text-gray-600">Estoque Crítico</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.min_stock || 0), product.expiry_date);
                      return status === 'Estoque Baixo' || status === 'Sem Estoque';
                    }).length || 0}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Produtos com baixo estoque ou zerados</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Próximos ao Vencimento</p>
                  <p className="text-2xl font-bold text-black mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.min_stock || 0), product.expiry_date);
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
                  <p className="text-2xl font-bold text-black mt-1">
                    {products?.filter((product: any) => {
                      const status = getProductStatus(Number(product.stock || 0), Number(product.min_stock || 0), product.expiry_date);
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
                  <p className="text-2xl font-bold text-black mt-1">
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
                  <p className="text-2xl font-bold text-black mt-1">
                    {transfers?.filter((transfer: any) => transfer.status === 'approved' || transfer.status === 'in_transit').length || 0}
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
                  <p className="text-2xl font-bold text-black mt-1">
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
                  <p className="text-2xl font-bold text-black mt-1">
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
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              
              try {
                const productData = {
                  name: formData.get('name') as string,
                  description: formData.get('description') as string || '',
                  category_id: parseInt(formData.get('categoryId') as string),
                  subcategory_id: formData.get('subcategoryId') ? parseInt(formData.get('subcategoryId') as string) : undefined,
                  price: formData.get('forSale') ? parseFloat(formData.get('price') as string || '0') : 0,
                  stock: parseInt(formData.get('stock') as string || '0'),
                  min_stock: parseInt(formData.get('minStock') as string || '0'),
                  barcode: formData.get('barcode') as string || '',
                  manufacturing_date: formData.get('manufacturingDate') as string || null,
                  expiry_date: formData.get('expiryDate') as string || null,
                  is_perishable: !!formData.get('isPerishable'),
                  for_sale: !!formData.get('forSale'),
                };

                await createProduct(productData);
                
                // Notificação de sucesso
                console.log("Produto adicionado com sucesso!");
                setShowAddProductModal(false);
                
                // Reset form states
                setShowForSalePrice(false);
                setShowPerishableDates(false);
                setSelectedCategoryId('');
              } catch (error) {
                console.error('Erro ao adicionar produto:', error);
              }
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    name="description"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descrição detalhada do produto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <select
                      name="categoryId"
                      required
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Selecionar categoria</option>
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-xs text-orange-600 mt-1">
                        Nenhuma categoria cadastrada. Vá para Cadastros para criar categorias.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                    <select
                      name="subcategoryId"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      disabled={!selectedCategoryId}
                    >
                      <option value="">Selecionar subcategoria (opcional)</option>
                      {subcategories
                        .filter((sub: any) => sub.category_id === parseInt(selectedCategoryId))
                        .map((subcategory: any) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </option>
                        ))}
                    </select>
                    {selectedCategoryId && subcategories.filter((sub: any) => sub.category_id === parseInt(selectedCategoryId)).length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Nenhuma subcategoria disponível para esta categoria.
                      </p>
                    )}
                  </div>
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
                    <div className="space-y-3">
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                        <input
                          name="barcode"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                          placeholder="Digite ou escaneie o código de barras"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Este código será usado para identificar o produto no sistema de vendas
                        </p>
                      </div>
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto {selectedProduct ? '(1 selecionado)' : ''}
                </label>
                
                {/* Produto selecionado */}
                {selectedProduct && (
                  <div className="mb-3">
                    <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-purple-800">{selectedProduct.name}</div>
                          <div className="text-xs text-purple-600">Estoque: {selectedProduct.stock} unidades</div>
                          <div className="text-xs text-purple-600 mt-1">Quantidade: {transferQuantity} unidades</div>
                        </div>
                        <button
                          onClick={removeSelectedProduct}
                          className="text-purple-400 hover:text-purple-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setShowProductSelectionModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm"
                >
                  {selectedProduct ? '+ Alterar Produto' : '+ Selecionar Produto'}
                </button>
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
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  max={selectedProduct?.stock || 999}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1"
                />
                {selectedProduct && transferQuantity > selectedProduct.stock && (
                  <p className="text-xs text-red-600 mt-1">Quantidade não pode ser maior que o estoque ({selectedProduct.stock})</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddTransferModal(false);
                    removeSelectedProduct();
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (!selectedProduct) {
                      console.log("Action performed");
                      // toast({
                      //   title: "Erro",
                      //   description: "Por favor, selecione um produto válido.",
                      //   variant: "destructive"
                      // });
                      return;
                    }
                    if (transferQuantity > selectedProduct.stock) {
                      console.log("Action performed");
                      // toast({
                      //   title: "Erro",
                      //   description: "Quantidade não pode ser maior que o estoque disponível.",
                      //   variant: "destructive"
                      // });
                      return;
                    }
                    console.log("Action performed");
                    // toast({
                    //   title: "Transferência Criada",
                    //   description: `Transferência de ${transferQuantity} unidades de "${selectedProduct.name}" criada e pendente de aprovação!`,
                    //   variant: "default"
                    // });
                    setShowAddTransferModal(false);
                    removeSelectedProduct();
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
              console.log("Action performed");
              // toast({
              //   title: 'Produto Atualizado',
              //   description: `O produto "${updatedProduct.name}" foi atualizado com sucesso.`
              // });
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

      {/* Modal de Controle de Estoque */}
      {showStockControlModal && stockControlProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Controle de Estoque
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800">{stockControlProduct.name}</h4>
                  <p className="text-sm text-gray-600">Estoque atual: {stockControlProduct.stock} unidades</p>
                  <p className="text-sm text-gray-600">Estoque mínimo: {stockControlProduct.minStock || 0} unidades</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade a Ajustar
                  </label>
                  <input
                    type="number"
                    value={stockAdjustment}
                    onChange={(e) => setStockAdjustment(Number(e.target.value))}
                    placeholder="Ex: +10 para adicionar, -5 para remover"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use números positivos para adicionar (+) ou negativos para remover (-)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo do Ajuste (Opcional)
                  </label>
                  <textarea
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="Ex: Recebimento de mercadoria, correção de inventário..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {stockAdjustment !== 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Novo estoque:</strong> {stockControlProduct.stock + stockAdjustment} unidades
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowStockControlModal(false);
                    setStockControlProduct(null);
                    setStockAdjustment(0);
                    setAdjustmentReason('');
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStockAdjustment}
                  disabled={stockAdjustment === 0 || isUpdating}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Atualizando...' : 'Atualizar Estoque'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Produtos */}
      {showProductSelectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Selecionar Produtos</h3>
              <button 
                onClick={() => {
                  setShowProductSelectionModal(false);
                  setProductSearchTerm('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Campo de pesquisa */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            {/* Lista de produtos */}
            <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
              {products
                .filter((product: any) => 
                  product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                  product.description?.toLowerCase().includes(productSearchTerm.toLowerCase())
                )
                .map((product: any) => (
                  <ProductTransferCard 
                    key={product.id}
                    product={product}
                    onSelect={selectProductForTransfer}
                  />
                ))}
            </div>
            
            {products
              .filter((product: any) => 
                product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(productSearchTerm.toLowerCase())
              ).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum produto encontrado</p>
                <p className="text-sm mt-1">Tente pesquisar por outro termo</p>
              </div>
            )}
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowProductSelectionModal(false);
                  setProductSearchTerm('');
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    );
  };

// Componente para card de produto na transferência
const ProductTransferCard = ({ product, onSelect }: { product: any; onSelect: (product: any, quantity: number) => void }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);

  const handleSelect = () => {
    setShowQuantityInput(true);
  };

  const handleConfirmQuantity = () => {
    if (quantity > 0 && quantity <= product.stock) {
      onSelect(product, quantity);
      setShowQuantityInput(false);
    }
  };

  return (
    <div className="border rounded-lg p-3 transition-all border-gray-200 hover:border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelect}
              disabled={product.stock === 0}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                product.stock === 0
                  ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
            </button>
            <div>
              <h4 className="font-medium text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600">Estoque: {product.stock} unidades</p>
            </div>
          </div>
          
          {showQuantityInput && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                max={product.stock}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1"
              />
              <select
                value="unidades"
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="unidades">unidades</option>
              </select>
              <button
                onClick={handleConfirmQuantity}
                disabled={quantity > product.stock || quantity <= 0}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstoqueSection;