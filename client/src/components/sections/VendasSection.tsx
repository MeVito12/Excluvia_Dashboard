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
    clientType: 'individual' as 'individual' | 'company',
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
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: item.unitPrice * (item.quantity + 1) }
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        barcode: product.barcode
      }];
    });
    setSearchTerm("");
    setBarcodeInput("");
    setShowProductSearch(false);
  };

  // Remover item do carrinho
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Atualizar quantidade no carrinho
  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
        : item
    ));
  };

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
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
        clientId: selectedClient || undefined,
        items: cart,
        paymentMethod: paymentMethod as "pix" | "cartao_credito" | "dinheiro" | "cartao_debito" | "boleto",
        discount: totalDiscount,
        totalAmount: totalAmount,
        sellers: selectedSellers,
        couponCode: appliedCoupon?.code || undefined
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
      clientType: 'individual',
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

  // Renderizar aba de vendas com design original
  const renderVendasTab = () => (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna da Esquerda */}
        <div className="space-y-6">
          {/* Card Adicionar Produtos */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Adicionar Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Código de Barras (Bip) */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Código de Barras (Bip)
                </Label>
                <Input
                  placeholder="Digite ou escaneie o código de barras..."
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                    setShowProductSearch(e.target.value.length > 0);
                  }}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Digite o código e pressione Enter, ou use um leitor de código de barras
                </p>
              </div>

              {/* Busca Manual */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Busca Manual
                </Label>
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar Produtos"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowProductSearch(e.target.value.length > 0);
                    }}
                    className="w-full pr-10"
                  />
                </div>
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
                            <p className="text-sm font-semibold text-green-600">R$ {product.price.toFixed(2)}</p>
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

          {/* Carrinho de Compras */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Carrinho de Compras</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Carrinho vazio</p>
                  <p className="text-sm">Adicione produtos usando o código de barras ou busca manual</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          R$ {item.unitPrice.toFixed(2)} cada
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <p className="font-semibold text-gray-800">
                          R$ {item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita - Finalizar Venda */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Finalizar Venda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vendedores */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Vendedores *
                </Label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-500"
                  onClick={() => {
                    console.log('Vendedores button clicked');
                    setShowSellersModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {selectedSellers.length > 0
                    ? `${selectedSellers.length} vendedor${selectedSellers.length > 1 ? 'es' : ''} selecionado${selectedSellers.length > 1 ? 's' : ''}`
                    : "Selecionar Vendedores"
                  }
                </Button>
              </div>

              {/* Cliente */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cliente (Opcional)
                </Label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-500"
                  onClick={() => {
                    console.log('Clientes button clicked');
                    setShowClientModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {selectedClient 
                    ? clients.find(c => c.id === selectedClient)?.name || "Cliente selecionado"
                    : "Selecionar Cliente"
                  }
                </Button>
              </div>

              {/* Método de Pagamento */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Método de Pagamento *
                </Label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-500"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {paymentMethod 
                    ? getPaymentMethodLabel(paymentMethod)
                    : "Selecionar Método"
                  }
                </Button>
              </div>

              {/* Cupom de Desconto */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cupom de Desconto
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="CÓDIGO DO CUPOM"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 uppercase"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => {/* Lógica do cupom */}}
                    disabled={!couponCode.trim() || validatingCoupon}
                    className="px-6"
                  >
                    {validatingCoupon ? "..." : "Aplicar"}
                  </Button>
                </div>
              </div>
              
              {/* Desconto Manual */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Desconto Manual (%)
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0"
                />
              </div>

              {/* Totais */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <Button 
                className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700"
                onClick={handleProcessSale}
                disabled={cart.length === 0 || processSaleMutation.isPending}
              >
                {processSaleMutation.isPending ? (
                  "Processando..."
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Enviar para Caixa - R$ {totalAmount.toFixed(2)}
                  </>
                )}
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
                  <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t">
                    <span>Total:</span>
                    <span>R$ {sale.total_amount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Processar Pagamento
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Navegação de Abas */}
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
              <div 
                className="border rounded-lg p-3 hover:bg-blue-500 cursor-pointer transition-all duration-200"
                onClick={() => {
                  setSelectedClient(null);
                  setShowClientModal(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.color = 'white';
                  const texts = e.currentTarget.querySelectorAll('p');
                  texts.forEach(text => text.style.color = 'white');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                  e.currentTarget.style.color = '';
                  const texts = e.currentTarget.querySelectorAll('p');
                  texts.forEach((text, index) => {
                    text.style.color = index === 0 ? '#1f2937' : '#6b7280';
                  });
                }}
              >
                <p className="font-medium text-gray-800">Venda sem cliente</p>
                <p className="text-sm text-gray-600">Continuar sem identificar cliente</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {/* Busca de cliente */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar cliente por nome..."
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Lista de clientes */}
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {clients
                .filter(client => 
                  client.name.toLowerCase().includes(clientSearchTerm.toLowerCase())
                )
                .map(client => (
                  <div
                    key={client.id}
                    className="p-3 border rounded-lg cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setSelectedClient(client.id);
                      setShowClientModal(false);
                      setClientSearchTerm("");
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.color = 'white';
                      const texts = e.currentTarget.querySelectorAll('p');
                      texts.forEach(text => text.style.color = 'white');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                      const texts = e.currentTarget.querySelectorAll('p');
                      texts.forEach((text, index) => {
                        text.style.color = index === 0 ? '#1f2937' : '#6b7280';
                      });
                    }}
                  >
                    <p className="font-medium text-gray-800">{client.name}</p>
                    {client.email && <p className="text-sm text-gray-600">{client.email}</p>}
                    {client.phone && <p className="text-sm text-gray-600">{client.phone}</p>}
                  </div>
                ))}
            </div>
            
            {/* Botão para adicionar novo cliente */}
            <Button 
              className="w-full"
              onClick={() => {
                setShowClientModal(false);
                setShowAddClientModal(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Novo Cliente
            </Button>
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
            
            <div className="space-y-3">
              {[
                { value: 'dinheiro', label: '💵 Dinheiro' },
                { value: 'pix', label: '📱 PIX' },
                { value: 'cartao_credito', label: '💳 Cartão de Crédito' },
                { value: 'cartao_debito', label: '💳 Cartão de Débito' },
                { value: 'boleto', label: '📄 Boleto' }
              ].map((method) => (
                <button
                  key={method.value}
                  className="w-full p-3 text-left border rounded-lg transition-all duration-200 text-gray-800"
                  onClick={() => {
                    setPaymentMethod(method.value);
                    setShowPaymentModal(false);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '#1f2937';
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vendedores */}
      {showSellersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Selecionar Vendedores</h3>
              <button 
                onClick={() => setShowSellersModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {companyProfiles.map((profile) => (
                <label
                  key={profile.id}
                  className="flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                    e.currentTarget.style.color = 'white';
                    const texts = e.currentTarget.querySelectorAll('p');
                    texts.forEach(text => text.style.color = 'white');
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                    const texts = e.currentTarget.querySelectorAll('p');
                    texts.forEach((text, index) => {
                      text.style.color = index === 0 ? '#1f2937' : '#6b7280';
                    });
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSellers.includes(profile.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSellers(prev => [...prev, profile.id]);
                      } else {
                        setSelectedSellers(prev => prev.filter(id => id !== profile.id));
                      }
                    }}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{profile.name}</p>
                    <p className="text-sm text-gray-600">{profile.email}</p>
                  </div>
                </label>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowSellersModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setShowSellersModal(false)}
                disabled={selectedSellers.length === 0}
              >
                Confirmar ({selectedSellers.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Cliente */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cadastrar Cliente</h3>
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
              <div>
                <Label htmlFor="client-name">Nome *</Label>
                <Input
                  id="client-name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div>
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="client-phone">Telefone</Label>
                <Input
                  id="client-phone"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="client-document">Documento</Label>
                <Input
                  id="client-document"
                  value={clientForm.document}
                  onChange={(e) => setClientForm(prev => ({ ...prev, document: e.target.value }))}
                  placeholder="CPF/CNPJ"
                />
              </div>
              
              <div>
                <Label htmlFor="client-address">Endereço</Label>
                <Textarea
                  id="client-address"
                  value={clientForm.address}
                  onChange={(e) => setClientForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Endereço completo"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowAddClientModal(false);
                  resetClientForm();
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleClientSubmit}
                disabled={!clientForm.name.trim()}
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendasSection;