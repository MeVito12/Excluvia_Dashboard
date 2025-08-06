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
    if (!product.current_stock || product.current_stock <= 0) {
      toast({
        title: "Produto sem estoque",
        description: `"${product.name}" não possui estoque disponível`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.current_stock) {
        toast({
          title: "Estoque insuficiente",
          description: `Só há ${product.current_stock} unidades disponíveis`,
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
    if (product && newQuantity > product.current_stock) {
      toast({
        title: "Estoque insuficiente",
        description: `Só há ${product.current_stock} unidades disponíveis`,
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
        email: clientForm.email || null,
        phone: clientForm.phone || null,
        address: clientForm.address || null,
        client_type: clientForm.client_type,
        document: clientForm.document || null,
        notes: clientForm.notes || null
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
                                R$ {Number(product.price || 0).toFixed(2)} • Estoque: {product.current_stock || 0}
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
                        const seller = companyProfiles.find(p => p.id === sellerId);
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

  return (
    <div className="space-y-6">
      {/* Navegação por Abas */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('vendas')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'vendas'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          🛒 Vendas
        </button>
        <button
          onClick={() => setActiveTab('caixa')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'caixa'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          💰 Caixa
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === 'vendas' ? renderVendasTab() : renderCaixaTab()}

      {/* Modais básicos (implementar os modais específicos depois) */}
      {showSellersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <p>Modal de vendedores em desenvolvimento</p>
            <Button onClick={() => setShowSellersModal(false)}>Fechar</Button>
          </div>
        </div>
      )}

      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <p>Modal de clientes em desenvolvimento</p>
            <Button onClick={() => setShowClientModal(false)}>Fechar</Button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <p>Modal de pagamento em desenvolvimento</p>
            <Button onClick={() => setShowPaymentModal(false)}>Fechar</Button>
          </div>
        </div>
      )}
    </div>
  );
}