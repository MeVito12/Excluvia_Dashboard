import { useProducts, useSales, useClients, useCreateCartSale, useCoupons, useValidateCoupon, useApplyCoupon, useCreateClient } from "@/hooks/useData";
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

const VendasSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Estados principais
  const [activeTab, setActiveTab] = useState<'vendas' | 'caixa'>('vendas');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
  
  // Estados de busca e modais
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [showProductSearch, setShowProductSearch] = useState<boolean>(false);
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showSellersModal, setShowSellersModal] = useState<boolean>(false);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  
  // Estados para cliente
  const [clientSearchTerm, setClientSearchTerm] = useState<string>("");
  const [foundClient, setFoundClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    client_type: 'individual' as 'individual' | 'company',
    document: '',
    notes: ''
  });
  
  // Estados para cupons
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [validatingCoupon, setValidatingCoupon] = useState<boolean>(false);
  
  // Estados para última venda e impressão
  const [lastSaleData, setLastSaleData] = useState<any>(null);
  const [includeClientInPrint, setIncludeClientInPrint] = useState<boolean>(false);

  // Hooks de dados
  const { data: products = [] } = useProducts();
  const { data: clients = [] } = useClients();
  const { data: sales = [] } = useSales();
  const { data: coupons = [] } = useCoupons();
  
  // Hooks de mutações
  const processSaleMutation = useCreateCartSale();
  const { mutateAsync: createClient } = useCreateClient();
  const validateCouponMutation = useValidateCoupon();
  const applyCouponMutation = useApplyCoupon();

  // Debug para modais
  console.log('Modal states:', { showClientModal, showPaymentModal, showSellersModal });

  // Função para obter label do método de pagamento
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
  const filteredProducts = products.filter((product: Product) => {
    if (barcodeInput && product.barcode?.includes(barcodeInput)) {
      return true;
    }
    
    if (!searchTerm.trim()) {
      return false;
    }
    
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const productName = product.name.toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    const productText = `${productName} ${productDescription}`;
    
    return searchWords.some(word => 
      productText.includes(word) || 
      productText.split(/\s+/).some(productWord => 
        productWord.startsWith(word) && word.length >= 2
      )
    );
  });

  // Adicionar produto ao carrinho
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        total_price: product.price
      }];
    });
    setSearchTerm("");
    setBarcodeInput("");
    setShowProductSearch(false);
  };

  // Remover item do carrinho
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  // Atualizar quantidade no carrinho
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.product_id === productId
        ? { ...item, quantity, total_price: item.unit_price * quantity }
        : item
    ));
  };

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
  const totalDiscount = discount + couponDiscount;
  const totalAmount = subtotal - totalDiscount;

  // Processar venda
  const handleProcessSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de processar a venda",
        variant: "destructive"
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Método de pagamento obrigatório",
        description: "Selecione um método de pagamento",
        variant: "destructive"
      });
      return;
    }

    if (selectedSellers.length === 0) {
      toast({
        title: "Vendedor obrigatório",
        description: "Selecione pelo menos um vendedor",
        variant: "destructive"
      });
      return;
    }

    try {
      const saleData: SaleCart = {
        client_id: selectedClient,
        items: cart,
        payment_method: paymentMethod,
        installments: installments,
        discount: totalDiscount,
        total_amount: totalAmount,
        sellers: selectedSellers,
        coupon_code: appliedCoupon?.code || null
      };

      await processSaleMutation.mutateAsync(saleData);

      // Limpar formulário
      setCart([]);
      setSelectedClient(null);
      setPaymentMethod("");
      setInstallments(1);
      setDiscount(0);
      setSelectedSellers([]);
      setCouponCode("");
      setAppliedCoupon(null);
      setCouponDiscount(0);
      
      // Mostrar modal de impressão
      setLastSaleData(saleData);
      setShowPrintModal(true);

      toast({
        title: "Venda processada!",
        description: "A venda foi enviada para o caixa com sucesso"
      });
    } catch (error) {
      console.error('Erro ao processar venda:', error);
      toast({
        title: "Erro ao processar venda",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  // Reset do formulário de cliente
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

  // Submissão do formulário de cliente
  const handleClientSubmit = async () => {
    if (!clientForm.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome do cliente é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      await createClient(clientForm);
      
      toast({
        title: "Cliente cadastrado!",
        description: "Cliente foi cadastrado com sucesso"
      });
      
      setShowAddClientModal(false);
      resetClientForm();
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  // Dados mock para vendas pendentes (demonstração)
  const mockPendingSales = [
    {
      id: 1,
      client_name: "João Silva",
      total_amount: 125.50,
      payment_method: "pix",
      sellers: ["Maria Santos"],
      created_at: "2025-01-05 14:30:00",
      status: "aguardando_pagamento",
      items: [
        { product_name: "Produto A", quantity: 2, unit_price: 45.00 },
        { product_name: "Produto B", quantity: 1, unit_price: 35.50 }
      ]
    },
    {
      id: 2,
      client_name: "Ana Costa",
      total_amount: 89.90,
      payment_method: "cartao_credito",
      sellers: ["Pedro Lima"],
      created_at: "2025-01-05 13:15:00",
      status: "aguardando_pagamento",
      items: [
        { product_name: "Produto C", quantity: 3, unit_price: 29.97 }
      ]
    }
  ];

  // Dados mock para perfis de vendedores
  const companyProfiles = [
    { id: 1, name: "Maria Santos", email: "maria@empresa.com" },
    { id: 2, name: "Pedro Lima", email: "pedro@empresa.com" },
    { id: 3, name: "Ana Costa", email: "ana@empresa.com" }
  ];

  // Renderizar aba de vendas
  const renderVendasTab = () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna da Esquerda - Busca de Produtos */}
        <div className="space-y-6">
          {/* Card de Busca de Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Buscar Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campo de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowProductSearch(e.target.value.length > 0);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Campo código de barras */}
              <div className="relative">
                <Scan className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Código de barras"
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                    setShowProductSearch(e.target.value.length > 0);
                  }}
                  className="pl-10"
                />
              </div>

              {/* Lista de produtos filtrados */}
              {showProductSearch && (
                <div className="max-h-64 overflow-y-auto border rounded-md">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 10).map((product: Product) => (
                      <div
                        key={product.id}
                        className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => addToCart(product)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-sm text-green-600 font-semibold">
                              R$ {product.price.toFixed(2)}
                            </p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum produto encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card do Carrinho */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Carrinho ({cart.length} {cart.length === 1 ? 'item' : 'itens'})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Carrinho vazio</p>
                  <p className="text-sm mt-1">Adicione produtos para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          R$ {item.unit_price.toFixed(2)} cada
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.product_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <p className="font-semibold text-gray-800">
                          R$ {item.total_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita - Checkout */}
        <div className="space-y-6">
          {/* Seleção de Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  console.log('Clientes button clicked');
                  setShowClientModal(true);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                {selectedClient 
                  ? clients.find(c => c.id === selectedClient)?.name || "Cliente selecionado"
                  : "Selecionar Cliente"
                }
              </Button>
            </CardContent>
          </Card>

          {/* Seleção de Vendedores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Vendedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  console.log('Vendedores button clicked');
                  setShowSellersModal(true);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                {selectedSellers.length > 0
                  ? `${selectedSellers.length} vendedor${selectedSellers.length > 1 ? 'es' : ''} selecionado${selectedSellers.length > 1 ? 's' : ''}`
                  : "Selecionar Vendedores"
                }
              </Button>
            </CardContent>
          </Card>

          {/* Método de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPaymentModal(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {paymentMethod 
                  ? getPaymentMethodLabel(paymentMethod)
                  : "Selecionar Método"
                }
              </Button>
            </CardContent>
          </Card>

          {/* Resumo da Venda */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Total de Descontos:</span>
                  <span>- R$ {totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>R$ {totalAmount.toFixed(2)}</span>
              </div>

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

  // Renderizar aba do caixa
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
        <div className="space-y-4">
          {mockPendingSales.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold mb-2">Nenhuma venda pendente</p>
              <p>Todas as vendas foram processadas</p>
            </div>
          ) : (
            mockPendingSales.map((sale) => (
              <div key={sale.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      Pendente
                    </Badge>
                    <span className="text-sm text-gray-500">#{sale.id}</span>
                  </div>
                  <span className="text-sm text-gray-500">{sale.created_at}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cliente</p>
                    <p className="font-semibold text-gray-800">{sale.client_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pagamento</p>
                    <p className="font-semibold text-gray-800">{getPaymentMethodLabel(sale.payment_method)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Vendedor(es)</p>
                    <p className="font-semibold text-gray-800">{sale.sellers.join(", ")}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600 mb-2">Itens:</p>
                  <div className="space-y-1">
                    {sale.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span>R$ {(item.quantity * item.unit_price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Printer className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">R$ {sale.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Sistema de Vendas</h1>
        <p className="section-subtitle">Gerenciamento completo de vendas e caixa</p>
      </div>

      {/* Navegação por Abas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('vendas')}
          className={`tab-button ${activeTab === 'vendas' ? 'active' : ''}`}
        >
          <ShoppingCart className="w-4 h-4" />
          Nova Venda
        </button>
        <button
          onClick={() => setActiveTab('caixa')}
          className={`tab-button ${activeTab === 'caixa' ? 'active' : ''}`}
        >
          <CreditCard className="w-4 h-4" />
          Caixa
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'vendas' ? renderVendasTab() : renderCaixaTab()}

      {/* Modal de Seleção de Cliente */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Selecionar Cliente</h3>
              <button 
                onClick={() => {
                  setShowClientModal(false);
                  setClientSearchTerm("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Opção venda sem cliente */}
            <div className="mb-4">
              <div className="border rounded-lg p-3 hover:border-gray-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedClient(null);
                          setShowClientModal(false);
                          setClientSearchTerm("");
                          setFoundClient(null);
                        }}
                        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-purple-400"
                      >
                        {selectedClient === null && <div className="w-3 h-3 bg-purple-600 rounded"></div>}
                      </button>
                      <div>
                        <h4 className="font-medium text-gray-800">Venda sem cliente</h4>
                        <p className="text-sm text-gray-600">Venda avulsa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lista de clientes */}
            <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
              {clients.length > 0 ? (
                clients.slice(0, 10).map((client) => (
                  <div key={client.id} className="border rounded-lg p-3 hover:border-gray-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedClient(client.id);
                              setShowClientModal(false);
                            }}
                            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-purple-400"
                          >
                            {selectedClient === client.id && (
                              <div className="w-3 h-3 bg-purple-600 rounded"></div>
                            )}
                          </button>
                          <div>
                            <h4 className="font-medium text-gray-800">{client.name}</h4>
                            <p className="text-sm text-gray-600">{client.email || 'Sem email'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum cliente cadastrado</p>
                  <Button 
                    onClick={() => {
                      setShowClientModal(false);
                      setShowAddClientModal(true);
                    }}
                    className="mt-2"
                  >
                    Cadastrar Novo Cliente
                  </Button>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowClientModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              <Button
                onClick={() => {
                  setShowClientModal(false);
                  setShowAddClientModal(true);
                }}
                className="flex-1"
              >
                Novo Cliente
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Vendedores */}
      {showSellersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Selecionar Vendedores</h3>
              <button 
                onClick={() => setShowSellersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Lista de vendedores */}
            <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
              {companyProfiles.length > 0 ? (
                companyProfiles.map((seller) => (
                  <div key={seller.id} className="border rounded-lg p-3 hover:border-gray-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (selectedSellers.includes(seller.id)) {
                                setSelectedSellers(selectedSellers.filter(id => id !== seller.id));
                              } else {
                                setSelectedSellers([...selectedSellers, seller.id]);
                              }
                            }}
                            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-purple-400"
                          >
                            {selectedSellers.includes(seller.id) && (
                              <div className="w-3 h-3 bg-purple-600 rounded"></div>
                            )}
                          </button>
                          <div>
                            <h4 className="font-medium text-gray-800">{seller.name}</h4>
                            <p className="text-sm text-gray-600">{seller.email || 'Vendedor'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Nenhum vendedor cadastrado</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowSellersModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              {selectedSellers.length > 0 && (
                <button
                  onClick={() => setShowSellersModal(false)}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Confirmar ({selectedSellers.length} selecionado{selectedSellers.length > 1 ? 's' : ''})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Método de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Método de Pagamento</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {[
                { value: 'dinheiro', label: '💵 Dinheiro' },
                { value: 'pix', label: '📱 PIX' },
                { value: 'cartao_credito', label: '💳 Cartão de Crédito' },
                { value: 'cartao_debito', label: '💳 Cartão de Débito' },
                { value: 'boleto', label: '📄 Boleto' }
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`w-full p-3 text-left border rounded-lg transition-colors ${
                    paymentMethod === method.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
            
            {(paymentMethod === 'cartao_credito' || paymentMethod === 'boleto') && (
              <div className="mb-4">
                <Label htmlFor="installments">Número de Parcelas</Label>
                <Select value={installments.toString()} onValueChange={(value) => setInstallments(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar parcelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x de R$ {(totalAmount / num).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  {paymentMethod === 'cartao_credito' 
                    ? 'Selecione o número de parcelas para o cartão de crédito'
                    : 'Selecione o número de parcelas para o boleto bancário'
                  }
                </p>
              </div>
            )}
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentMethod("");
                  setInstallments(1);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <Button
                onClick={() => setShowPaymentModal(false)}
                disabled={!paymentMethod}
                className="flex-1"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro de Novo Cliente */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cadastrar Novo Cliente</h3>
              <button 
                onClick={() => {
                  setShowAddClientModal(false);
                  resetClientForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <Label htmlFor="client-name">Nome *</Label>
                <Input
                  id="client-name"
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                  placeholder="Nome completo ou razão social"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="client-email">E-mail</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>

              {/* Telefone */}
              <div>
                <Label htmlFor="client-phone">Telefone</Label>
                <Input
                  id="client-phone"
                  type="tel"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>

              {/* Documento */}
              <div>
                <Label htmlFor="client-document">CPF/CNPJ</Label>
                <Input
                  id="client-document"
                  type="text"
                  value={clientForm.document}
                  onChange={(e) => setClientForm({...clientForm, document: e.target.value})}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </div>

              {/* Endereço */}
              <div>
                <Label htmlFor="client-address">Endereço</Label>
                <Input
                  id="client-address"
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="client-notes">Observações</Label>
                <Textarea
                  id="client-notes"
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({...clientForm, notes: e.target.value})}
                  placeholder="Informações adicionais sobre o cliente"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t mt-6">
              <button
                onClick={() => {
                  setShowAddClientModal(false);
                  resetClientForm();
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClientSubmit}
                disabled={!clientForm.name.trim()}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Cadastrar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Impressão */}
      {showPrintModal && lastSaleData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Venda Processada!</h3>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Venda processada com sucesso! Deseja imprimir o comprovante?</p>
              
              <div className="border rounded-lg p-3 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Funcionalidade de impressão será implementada em breve.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t mt-4">
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendasSection;