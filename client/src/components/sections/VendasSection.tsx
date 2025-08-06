import { useProducts, useSales, useClients, useAppointments, useFinancial, useTransfers, useMoneyTransfers, useBranches, useCreateProduct, useCreateSale, useCreateClient, useCreateAppointment, useCreateFinancial, useCreateTransfer, useCreateMoneyTransfer, useCreateBranch, useCreateCartSale, useCoupons, useValidateCoupon, useApplyCoupon } from "@/hooks/useData";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Minus, ShoppingCart, Scan, Search, Trash2, CreditCard, DollarSign, User, Package, X, Eye, Edit, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import type { Product, Client, CartItem, SaleCart } from "@shared/schema";

export default function VendasSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados do carrinho e vendas
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
  
  // Estados das abas
  const [activeTab, setActiveTab] = useState<'vendas' | 'caixa'>('vendas');
  
  // Estados de busca de produtos
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [showProductSearch, setShowProductSearch] = useState<boolean>(false);
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showSellersModal, setShowSellersModal] = useState<boolean>(false);
  
  // Estados para cupons
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  
  // Estados para formulário de novo cliente
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    client_type: 'individual' as 'individual' | 'company',
    document: '',
    notes: ''
  });
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [lastSaleData, setLastSaleData] = useState<any>(null);
  const [includeClientInPrint, setIncludeClientInPrint] = useState<boolean>(false);

  // Hooks de dados
  const { data: products = [] } = useProducts();
  const { data: clients = [] } = useClients();
  const { data: companyProfiles = [] } = useBranches();
  const processSaleMutation = useCreateCartSale();
  const createClientMutation = useCreateClient();

  // Função para obter o label do método de pagamento
  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      dinheiro: "💵 Dinheiro",
      pix: "📱 PIX",
      cartao_credito: "💳 Cartão de Crédito",
      cartao_debito: "💳 Cartão de Débito",
      boleto: "📄 Boleto"
    };
    return methods[method as keyof typeof methods] || method;
  };

  // Filtrar produtos por busca
  const filteredProducts = products.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    const currentStock = (product as any).current_stock || 0;
    
    if (!currentStock || currentStock <= 0) {
      toast({
        title: "Produto sem estoque",
        description: `"${product.name}" não possui estoque disponível`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= currentStock) {
        toast({
          title: "Estoque insuficiente",
          description: `Só há ${currentStock} unidades disponíveis`,
          variant: "destructive",
        });
        return;
      }
      
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price || 0,
        totalPrice: product.price || 0
      };
      setCart([...cart, newItem]);
    }
    
    toast({
      title: "Produto adicionado!",
      description: `"${product.name}" foi adicionado ao carrinho`,
    });
  };

  // Função para atualizar quantidade
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p: Product) => p.id === productId);
    const currentStock = (product as any)?.current_stock || 0;
    
    if (product && newQuantity > currentStock) {
      toast({
        title: "Estoque insuficiente",
        description: `Só há ${currentStock} unidades disponíveis`,
        variant: "destructive",
      });
      return;
    }

    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, totalPrice: item.unitPrice * newQuantity }
        : item
    ));
  };

  // Função para remover do carrinho
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Função para limpar carrinho
  const clearCart = () => {
    setCart([]);
  };

  // Cálculos de total
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalAmount = subtotal - couponDiscount;

  // Função para processar código de barras
  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find((p: Product) => p.barcode === barcode);
    if (product) {
      addToCart(product);
      toast({
        title: "Produto adicionado!",
        description: `"${product.name}" foi adicionado ao carrinho`,
      });
    } else {
      toast({
        title: "Produto não encontrado",
        description: "Código de barras não encontrado no sistema",
        variant: "destructive",
      });
    }
  };

  // Listener para "Enter" no campo de código de barras
  const handleBarcodeKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      handleBarcodeScanned(barcodeInput.trim());
      setBarcodeInput("");
    }
  };

  // Função para processar venda
  const handleProcessSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de processar a venda",
        variant: "destructive",
      });
      return;
    }

    if (selectedSellers.length === 0) {
      toast({
        title: "Vendedor obrigatório",
        description: "Selecione pelo menos um vendedor",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Método de pagamento obrigatório",
        description: "Selecione um método de pagamento",
        variant: "destructive",
      });
      return;
    }

    try {
      const saleData = {
        items: cart.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice
        })),
        client_id: selectedClient,
        payment_method: paymentMethod,
        installments: installments,
        sellers: selectedSellers,
        total_amount: totalAmount,
        discount: couponDiscount,
        coupon_code: appliedCoupon?.code || null
      };

      await processSaleMutation.mutateAsync(saleData);
      
      // Limpar carrinho e seleções
      clearCart();
      setSelectedClient(null);
      setPaymentMethod("");
      setInstallments(1);
      setSelectedSellers([]);
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponCode("");
      
      toast({
        title: "Venda processada!",
        description: "A venda foi enviada para o caixa com sucesso",
      });
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast({
        title: "Erro ao processar venda",
        description: "Tente novamente ou verifique os dados",
        variant: "destructive",
      });
    }
  };

  // Função para cadastrar novo cliente
  const handleClientSubmit = async () => {
    if (!clientForm.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome do cliente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const clientData = {
        name: clientForm.name,
        email: clientForm.email || undefined,
        phone: clientForm.phone || undefined,
        address: clientForm.address || undefined,
        clientType: clientForm.client_type,
        document: clientForm.document || undefined
      };

      const newClient = await createClientMutation.mutateAsync(clientData);
      
      setSelectedClient(newClient.id);
      setShowAddClientModal(false);
      resetClientForm();
      
      toast({
        title: "Cliente cadastrado!",
        description: `"${clientForm.name}" foi cadastrado com sucesso`,
      });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Tente novamente ou verifique os dados",
        variant: "destructive",
      });
    }
  };

  // Função para resetar formulário de cliente
  const resetClientForm = () => {
    setClientForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      client_type: 'individual',
      document: '',
      notes: ''
    });
  };

  // Renderizar aba de vendas
  const renderVendasTab = () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de Adição de Produtos */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scan className="h-5 w-5" />
                <span>Adicionar Produtos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Código de Barras */}
              <div>
                <Label htmlFor="barcode">Código de Barras (Bip)</Label>
                <Input
                  id="barcode"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={handleBarcodeKeyPress}
                  placeholder="Digite ou escaneie o código de barras..."
                  className="font-mono"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Digite o código e pressione Enter, ou use um leitor de código de barras
                </p>
              </div>

              <Separator />

              {/* Busca Manual */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="search">Busca Manual</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProductSearch(!showProductSearch)}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {showProductSearch ? 'Ocultar' : 'Buscar Produtos'}
                  </Button>
                </div>
                
                {showProductSearch && (
                  <div className="mt-3 space-y-3">
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Digite o nome do produto..."
                    />
                    
                    {searchTerm && (
                      <div className="max-h-60 overflow-y-auto border rounded-md">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between"
                            onClick={() => addToCart(product)}
                          >
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                R$ {Number(product.price || 0).toFixed(2)} • Estoque: {(product as any).current_stock || 0}
                              </p>
                            </div>
                            <Plus className="h-4 w-4 text-emerald-600" />
                          </div>
                        ))}
                        
                        {filteredProducts.length === 0 && (
                          <p className="p-3 text-center text-gray-500">
                            Nenhum produto encontrado
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Carrinho de Compras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Carrinho de Compras</span>
                {cart.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Carrinho vazio</p>
                  <p className="text-sm">Adicione produtos usando o código de barras ou busca manual</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          R$ {Number(item.unitPrice || 0).toFixed(2)} cada
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <div className="w-20 text-right font-medium">
                          R$ {Number(item.totalPrice || 0).toFixed(2)}
                        </div>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel de Finalização */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Finalizar Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vendedores */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendedores *</label>
                <button
                  type="button"
                  onClick={() => setShowSellersModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm text-left"
                >
                  {selectedSellers.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedSellers.map(sellerId => {
                        const seller = companyProfiles.find(p => Number(p.id) === Number(sellerId));
                        return seller ? (
                          <span key={sellerId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {seller.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : "+ Selecionar Vendedores"}
                </button>
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (Opcional)</label>
                <button
                  type="button"
                  onClick={() => setShowClientModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm text-left"
                >
                  {selectedClient 
                    ? clients.find(c => c.id === selectedClient)?.name || "Cliente selecionado"
                    : "+ Selecionar Cliente"
                  }
                </button>
              </div>

              {/* Método de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento *</label>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors text-sm text-left"
                >
                  {paymentMethod ? (
                    <>
                      {getPaymentMethodLabel(paymentMethod)}
                      {(paymentMethod === 'cartao_credito' || paymentMethod === 'boleto') && installments > 1 && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({installments}x de R$ {(totalAmount / installments).toFixed(2)})
                        </span>
                      )}
                    </>
                  ) : "+ Selecionar Método"}
                </button>
              </div>

              {/* Resumo do Total */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto ({appliedCoupon?.code}):</span>
                    <span>-R$ {couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Botão de Enviar para Caixa */}
              <Button
                onClick={handleProcessSale}
                disabled={cart.length === 0 || !paymentMethod || selectedSellers.length === 0}
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Enviar para Caixa - R$ {totalAmount.toFixed(2)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCaixaTab = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Caixa - Vendas Pendentes</h3>
              <p className="text-sm text-gray-600">Vendas aguardando pagamento</p>
            </div>
          </div>
        </div>

        {/* Lista de Vendas Pendentes */}
        <div className="standard-list-container">
          <div className="standard-list-content">
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhuma venda pendente</h3>
              <p className="text-sm text-gray-600">
                Todas as vendas foram finalizadas ou não há vendas aguardando pagamento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Definição das abas
  const tabs = [
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'caixa', label: 'Caixa', icon: CreditCard }
  ];

  // Função para renderizar o conteúdo da aba selecionada
  const renderTabContent = () => {
    switch (activeTab) {
      case 'vendas':
        return renderVendasTab();
      case 'caixa':
        return renderCaixaTab();
      default:
        return renderVendasTab();
    }
  };

  return (
    <div className="app-section">
      {/* Header Padrão */}
      <div className="section-header">
        <h1 className="section-title">Vendas</h1>
        <p className="section-subtitle">
          Gerencie vendas, carrinho de compras e processamento no caixa
        </p>
      </div>

      {/* Navegação por Abas - Padrão do Sistema */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'vendas' | 'caixa')}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba selecionada */}
      {renderTabContent()}

      {/* Modal de Vendedores */}
      {showSellersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Selecionar Vendedores</h3>
                  <p className="text-sm text-gray-500">Escolha os vendedores responsáveis por esta venda</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSellersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
        <div className="space-y-4">
          {companyProfiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum vendedor cadastrado</p>
              <p className="text-sm">Cadastre vendedores na seção Controle primeiro</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              {companyProfiles.map((seller) => (
                <div
                  key={seller.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedSellers.includes(Number(seller.id))
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (selectedSellers.includes(Number(seller.id))) {
                      setSelectedSellers(selectedSellers.filter(id => id !== Number(seller.id)));
                    } else {
                      setSelectedSellers([...selectedSellers, Number(seller.id)]);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-sm text-gray-500">{seller.email}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedSellers.includes(Number(seller.id))
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedSellers.includes(Number(seller.id)) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setShowSellersModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => setShowSellersModal(false)} 
                disabled={selectedSellers.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                Confirmar ({selectedSellers.length} selecionado{selectedSellers.length !== 1 ? 's' : ''})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Clientes */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Selecionar Cliente</h3>
                  <p className="text-sm text-gray-500">Escolha um cliente existente ou cadastre um novo</p>
                </div>
              </div>
              <button 
                onClick={() => setShowClientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
        <div className="space-y-4">
          {/* Busca de clientes */}
          <div>
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-3"
            />
          </div>

          {/* Lista de clientes */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {clients.filter((client: Client) => 
              client.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((client) => (
              <div
                key={client.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedClient === client.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedClient(client.id);
                  setShowClientModal(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    {client.email && <p className="text-sm text-gray-500">{client.email}</p>}
                    {client.phone && <p className="text-sm text-gray-500">{client.phone}</p>}
                  </div>
                </div>
              </div>
            ))}
            
            {clients.filter((client: Client) => 
              client.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum cliente encontrado</p>
              </div>
            )}
          </div>

            {/* Botão para novo cliente */}
            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  setShowClientModal(false);
                  setShowAddClientModal(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Cadastrar Novo Cliente
              </button>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setShowClientModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setSelectedClient(null);
                  setShowClientModal(false);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Venda Avulsa (Sem Cliente)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Método de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Método de Pagamento</h3>
                  <p className="text-sm text-gray-500">Selecione como o cliente irá pagar</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { value: "dinheiro", label: "💵 Dinheiro", description: "Pagamento em espécie" },
                { value: "pix", label: "📱 PIX", description: "Transferência instantânea" },
                { value: "cartao_credito", label: "💳 Cartão de Crédito", description: "Parcelamento disponível" },
                { value: "cartao_debito", label: "💳 Cartão de Débito", description: "Débito em conta" },
                { value: "boleto", label: "📄 Boleto", description: "Boleto bancário" }
              ].map((method) => (
                <div
                  key={method.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === method.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setPaymentMethod(method.value);
                    if (method.value !== 'cartao_credito' && method.value !== 'boleto') {
                      setInstallments(1);
                      setShowPaymentModal(false);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      paymentMethod === method.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === method.value && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Opções de parcelamento */}
              {(paymentMethod === 'cartao_credito' || paymentMethod === 'boleto') && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Parcelamento</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((parcela) => (
                      <button
                        key={parcela}
                        onClick={() => {
                          setInstallments(parcela);
                          setShowPaymentModal(false);
                        }}
                        className={`p-2 border rounded text-sm transition-all ${
                          installments === parcela 
                            ? 'border-purple-500 bg-purple-50 text-purple-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">
                          {parcela === 1 ? 'À vista' : `${parcela}x`}
                        </div>
                        <div className="text-xs text-gray-600">
                          R$ {(totalAmount / parcela).toFixed(2)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Cliente */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Cadastrar Novo Cliente</h3>
                  <p className="text-sm text-gray-500">Preencha os dados do cliente</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddClientModal(false);
                  resetClientForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="client-name">Nome *</Label>
            <Input
              id="client-name"
              value={clientForm.name}
              onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
              placeholder="Nome completo ou razão social"
            />
          </div>

          <div>
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              value={clientForm.email}
              onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="client-phone">Telefone</Label>
            <Input
              id="client-phone"
              value={clientForm.phone}
              onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="client-type">Tipo</Label>
            <Select 
              value={clientForm.client_type} 
              onValueChange={(value: 'individual' | 'company') => 
                setClientForm({...clientForm, client_type: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Pessoa Física</SelectItem>
                <SelectItem value="company">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
            
        <div className="flex gap-3 justify-end mt-6">
          <button 
            onClick={() => {
              setShowAddClientModal(false);
              resetClientForm();
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleClientSubmit}
            disabled={!clientForm.name.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            Cadastrar
          </button>
        </div>
        </div>
      </div>
      )}
    </div>
  );
}