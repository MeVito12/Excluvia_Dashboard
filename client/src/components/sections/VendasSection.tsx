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
import { Plus, Minus, ShoppingCart, Scan, Search, Trash2, CreditCard, DollarSign, User, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
// import ThermalPrint from "@/components/ThermalPrint"; // Comentado temporariamente
import type { Product, Client, CartItem, SaleCart } from "@shared/schema";

export default function VendasSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  // Usando toast para notificações
  const queryClient = useQueryClient();

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
  
  // Estados do carrinho
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  
  // Estados de busca de produtos
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [showProductSearch, setShowProductSearch] = useState<boolean>(false);
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [clientSearchTerm, setClientSearchTerm] = useState<string>("");
  const [foundClient, setFoundClient] = useState<Client | null>(null);
  const [showAddClientModal, setShowAddClientModal] = useState<boolean>(false);
  
  // Estados para cupons
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [validatingCoupon, setValidatingCoupon] = useState<boolean>(false);
  
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
  
  // Estados para impressão térmica
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [lastSaleData, setLastSaleData] = useState<any>(null);
  const [includeClientInPrint, setIncludeClientInPrint] = useState<boolean>(false);
  
  // Estados para filtros de data
  const getDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    return {
      from: thirtyDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [dateFrom, setDateFrom] = useState(defaultDates.from);
  const [dateTo, setDateTo] = useState(defaultDates.to);

  // Buscar produtos e clientes usando hooks consolidados
  const companyId = (user as any)?.companyId;
  
  const { data: products = [] } = useProducts(undefined, companyId);
  const { data: clients = [] } = useClients(undefined, companyId);
  const { data: sales = [] } = useSales(undefined, companyId);
  const { data: financialEntries = [] } = useFinancial(undefined, companyId);
  const { data: coupons = [] } = useCoupons(companyId);

  // Filtrar produtos por busca ou código de barras com palavras-chave
  const filteredProducts = products.filter((product: Product) => {
    if (barcodeInput && product.barcode?.includes(barcodeInput)) {
      return true;
    }
    
    if (!searchTerm.trim()) {
      return false;
    }
    
    // Dividir termo de busca em palavras individuais
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
    const productName = product.name.toLowerCase();
    const productCategory = product.category.toLowerCase();
    const productDescription = (product.description || '').toLowerCase();
    const productText = `${productName} ${productCategory} ${productDescription}`;
    
    // Produto deve conter PELO MENOS UMA das palavras buscadas (busca mais flexível)
    return searchWords.some(word => 
      productText.includes(word) || 
      // Busca parcial por início da palavra
      productText.split(/\s+/).some(productWord => 
        productWord.startsWith(word) && word.length >= 2
      )
    );
  });

  // Processar venda do carrinho usando hook consolidado
  const processSaleMutation = useCreateCartSale();
  const { mutateAsync: createClient } = useCreateClient();
  const validateCouponMutation = useValidateCoupon();
  const applyCouponMutation = useApplyCoupon();

  // Funções auxiliares para filtros
  const filterByDateRange = (data: any[], dateField: string) => {
    if (!data || !Array.isArray(data)) return [];
    if (!dateFrom && !dateTo) return data;
    
    return data.filter(item => {
      const itemValue = item[dateField];
      if (!itemValue) return false;
      
      const itemDate = new Date(itemValue);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : new Date('2100-12-31');
      
      if (isNaN(itemDate.getTime())) {
        return false;
      }
      
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  // Dados filtrados por período
  const filteredSales = filterByDateRange(sales || [], 'sale_date');
  const filteredFinancialEntries = filterByDateRange(financialEntries?.filter(entry => 
    entry.type === 'income' && entry.description?.includes('Venda manual')
  ) || [], 'created_at');

  // Calcular totais (vendas automáticas + vendas manuais)
  const totalSalesAmount = filteredSales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
  const totalManualSales = filteredFinancialEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const totalRevenue = totalSalesAmount + totalManualSales;

  const calculateCartTotal = () => cart.reduce((sum, item) => sum + item.totalPrice, 0);
  
  const clearCart = () => {
    setCart([]);
    // Reset cupom
    setCouponCode("");
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  // Função para validar cupom
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Erro",
        description: "Digite um código de cupom",
        variant: "destructive"
      });
      return;
    }

    setValidatingCoupon(true);
    try {
      const coupon = await validateCouponMutation.mutateAsync(couponCode.trim().toUpperCase());
      
      if (coupon && coupon.is_active) {
        setAppliedCoupon(coupon);
        calculateCouponDiscount(coupon);
        toast({
          title: "Cupom aplicado!",
          description: `${coupon.name} - ${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : 'R$ ' + coupon.discount_value} de desconto`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Cupom inválido",
        description: error.message || "Código não encontrado ou expirado",
        variant: "destructive"
      });
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Função para calcular desconto do cupom
  const calculateCouponDiscount = (coupon: any) => {
    const subtotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    
    if (subtotal < coupon.min_purchase_amount) {
      toast({
        title: "Valor mínimo não atingido",
        description: `Compra mínima de R$ ${coupon.min_purchase_amount.toFixed(2)} para usar este cupom`,
        variant: "destructive"
      });
      setAppliedCoupon(null);
      setCouponDiscount(0);
      return;
    }

    let discountAmount = 0;

    // Aplicar desconto baseado no tipo de campanha
    if (coupon.campaign_type === 'total_purchase') {
      // Desconto no total da compra
      if (coupon.discount_type === 'percentage') {
        discountAmount = (subtotal * coupon.discount_value) / 100;
      } else {
        discountAmount = coupon.discount_value;
      }
    } else if (coupon.campaign_type === 'category_discount' && coupon.target_categories) {
      // Desconto apenas em produtos de categorias específicas
      const eligibleItemsTotal = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        if (product && coupon.target_categories.includes(product.category_id)) {
          return total + item.totalPrice;
        }
        return total;
      }, 0);

      if (eligibleItemsTotal === 0) {
        toast({
          title: "Produtos não elegíveis",
          description: "Este cupom só se aplica a produtos de categorias específicas",
          variant: "destructive"
        });
        setAppliedCoupon(null);
        setCouponDiscount(0);
        return;
      }

      if (coupon.discount_type === 'percentage') {
        discountAmount = (eligibleItemsTotal * coupon.discount_value) / 100;
      } else {
        discountAmount = Math.min(coupon.discount_value, eligibleItemsTotal);
      }
    } else if (coupon.campaign_type === 'seasonal_promotion' && coupon.target_categories) {
      // Promoção sazonal em categorias específicas
      const eligibleItemsTotal = cart.reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        if (product && coupon.target_categories.includes(product.category_id)) {
          return total + item.totalPrice;
        }
        return total;
      }, 0);

      if (coupon.discount_type === 'percentage') {
        discountAmount = (eligibleItemsTotal * coupon.discount_value) / 100;
      } else {
        discountAmount = Math.min(coupon.discount_value, eligibleItemsTotal);
      }
    } else {
      // Outros tipos de campanha aplicam no total
      if (coupon.discount_type === 'percentage') {
        discountAmount = (subtotal * coupon.discount_value) / 100;
      } else {
        discountAmount = coupon.discount_value;
      }
    }

    // Garantir que o desconto não seja maior que o subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    setCouponDiscount(discountAmount);
  };

  // Função para remover cupom
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast({
      title: "Cupom removido",
      description: "O desconto foi removido da venda",
    });
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

  // Função para lidar com criação de novo cliente
  const handleClientSubmit = async () => {
    try {
      const clientData = {
        ...clientForm,
        user_id: (user as any)?.id,
        company_id: (user as any)?.companyId
      };

      const newClient = await createClient(clientData);
      
      // Selecionar o cliente recém-criado
      setSelectedClient(newClient.id);
      
      // Fechar modais e resetar formulários
      setShowAddClientModal(false);
      setShowClientModal(false);
      resetClientForm();
      setClientSearchTerm("");
      setFoundClient(null);
      
      toast({
        title: "Cliente cadastrado com sucesso!",
        description: `${clientData.name} foi adicionado à sua lista de clientes.`,
      });
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: "Tente novamente ou verifique os dados informados.",
        variant: "destructive"
      });
    }
  };

  // Adicionar produto ao carrinho
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: CartItem = {
        productId: product.id!,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
        barcode: product.barcode,
      };
      setCart([...cart, newItem]);
    }
    
    setSearchTerm("");
    setBarcodeInput("");
    setShowProductSearch(false);
  };

  // Remover produto do carrinho
  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Atualizar quantidade no carrinho
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
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
        description: "Adicione produtos antes de finalizar a venda",
        variant: "destructive",
      });
      return;
    }
    
    if (!paymentMethod) {
      toast({
        title: "Método de pagamento",
        description: "Selecione um método de pagamento para continuar",
        variant: "destructive",
      });
      return;
    }

    try {
      // Se há cupom aplicado, registrar o uso
      if (appliedCoupon) {
        await applyCouponMutation.mutateAsync({
          couponId: appliedCoupon.id,
          saleAmount: subtotal
        });
      }

      const saleData: SaleCart = {
        items: cart,
        clientId: selectedClient || undefined,
        clientName: selectedClient ? clients.find((c: Client) => c.id === selectedClient)?.name : undefined,
        subtotal,
        discount: totalDiscount, // Incluindo cupom no desconto total
        totalAmount,
        paymentMethod: paymentMethod as any,
        couponId: appliedCoupon?.id,
        couponDiscount: couponDiscount
      };

      processSaleMutation.mutate(saleData);
    } catch (error: any) {
      toast({
        title: "Erro ao aplicar cupom",
        description: error.message || "Não foi possível processar o cupom",
        variant: "destructive",
      });
    }
  };

  // Processar código de barras (simular "bip")
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Sistema de Vendas</h1>
        <p className="text-gray-300">Gerenciamento de vendas e carrinho</p>
      </div>

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
                                R$ {Number(product.price || 0).toFixed(2)} • Estoque: {product.stock}
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
                  {paymentMethod ? getPaymentMethodLabel(paymentMethod) : "+ Selecionar Método"}
                </button>
              </div>

              {/* Cupom de Desconto */}
              <div>
                <Label htmlFor="coupon">Cupom de Desconto</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="CÓDIGO DO CUPOM"
                    disabled={!!appliedCoupon}
                    className="uppercase"
                  />
                  {appliedCoupon ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleRemoveCoupon}
                      className="shrink-0"
                    >
                      Remover
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleValidateCoupon}
                      disabled={!couponCode.trim() || validatingCoupon}
                      className="shrink-0"
                    >
                      {validatingCoupon ? "..." : "Aplicar"}
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800 font-medium">{appliedCoupon.name}</p>
                    <p className="text-xs text-green-600 mb-1">
                      {appliedCoupon.discount_type === 'percentage' 
                        ? `${appliedCoupon.discount_value}% de desconto` 
                        : `R$ ${appliedCoupon.discount_value} de desconto`}
                    </p>
                    <p className="text-xs text-gray-600">
                      {appliedCoupon.campaign_type === 'category_discount' && '📂 Desconto por categoria'}
                      {appliedCoupon.campaign_type === 'seasonal_promotion' && '🌟 Promoção sazonal'}
                      {appliedCoupon.campaign_type === 'client_reactivation' && '🔄 Reativação de cliente'}
                      {appliedCoupon.campaign_type === 'total_purchase' && '🛒 Desconto no total'}
                    </p>
                    {appliedCoupon.campaign_type !== 'total_purchase' && (
                      <p className="text-xs text-blue-600 mt-1">
                        ✓ Aplicado apenas aos produtos elegíveis
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Desconto Manual */}
              <div>
                <Label htmlFor="discount">Desconto Manual (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  onFocus={(e) => {
                    if (discount === 0) {
                      e.target.select();
                    }
                  }}
                  placeholder="0"
                />
              </div>

              <Separator />

              {/* Resumo da Venda */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Desconto Manual ({discount}%):</span>
                    <span>- R$ {(subtotal * discount / 100).toFixed(2)}</span>
                  </div>
                )}
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Cupom ({appliedCoupon?.name}):</span>
                    <span>- R$ {couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
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
              </div>

              {/* Botão de Finalizar */}
              <Button
                onClick={handleProcessSale}
                disabled={cart.length === 0 || !paymentMethod || processSaleMutation.isPending}
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {processSaleMutation.isPending ? 'Processando...' : 'Finalizar Venda'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
                ✕
              </button>
            </div>
            
            {/* Campo de pesquisa por CPF/CNPJ */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite o CPF ou CNPJ do cliente
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  value={clientSearchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setClientSearchTerm(value);
                    
                    // Limpar números apenas
                    const cleanValue = value.replace(/\D/g, '');
                    
                    // Buscar cliente por CPF/CNPJ
                    if (cleanValue.length >= 11) {
                      const client = clients.find(c => c.document && c.document.replace(/\D/g, '') === cleanValue);
                      setFoundClient(client || null);
                    } else {
                      setFoundClient(null);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Opção venda sem cliente */}
            <div className="mb-4">
              <div className="border rounded-lg p-3 transition-all border-gray-200 hover:border-gray-300">
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
            
            {/* Cliente encontrado */}
            {foundClient && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cliente encontrado:</h4>
                <div className="border rounded-lg p-3 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedClient(foundClient.id!);
                            setShowClientModal(false);
                            setClientSearchTerm("");
                            setFoundClient(null);
                          }}
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-green-400 hover:border-green-500"
                        >
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-800">{foundClient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {foundClient.document && `${foundClient.document.length === 11 ? 'CPF' : 'CNPJ'}: ${foundClient.document}`}
                            {foundClient.email && ` • ${foundClient.email}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-green-600 mt-2">Clique no cliente para confirmar a seleção</p>
              </div>
            )}

            {/* Mensagem quando não encontra cliente */}
            {clientSearchTerm && clientSearchTerm.replace(/\D/g, '').length >= 11 && !foundClient && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Cliente não encontrado</p>
                <p className="text-sm mt-1">Verifique o CPF/CNPJ digitado</p>
                <button
                  onClick={() => {
                    // Pre-preencher o documento no formulário
                    const cleanDocument = clientSearchTerm.replace(/\D/g, '');
                    setClientForm({
                      ...clientForm,
                      document: cleanDocument,
                      client_type: cleanDocument.length === 11 ? 'individual' : 'company'
                    });
                    setShowAddClientModal(true);
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  + Cadastrar Novo Cliente
                </button>
              </div>
            )}
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowClientModal(false);
                  setClientSearchTerm("");
                  setFoundClient(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Método de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Método de Pagamento</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Lista de métodos */}
            <div className="max-h-96 overflow-y-auto mb-4 space-y-2">
              {[
                { value: "dinheiro", label: "💵 Dinheiro", description: "Pagamento em espécie" },
                { value: "pix", label: "📱 PIX", description: "Transferência instantânea" },
                { value: "cartao_credito", label: "💳 Cartão de Crédito", description: "Parcelamento disponível" },
                { value: "cartao_debito", label: "💳 Cartão de Débito", description: "Débito em conta" },
                { value: "boleto", label: "📄 Boleto", description: "Boleto bancário" }
              ].map((method) => (
                <div key={method.value} className="border rounded-lg p-3 transition-all border-gray-200 hover:border-gray-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setPaymentMethod(method.value);
                            setShowPaymentModal(false);
                          }}
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-gray-300 hover:border-purple-400"
                        >
                        </button>
                        <div>
                          <h4 className="font-medium text-gray-800">{method.label}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Impressão Térmica */}
      {showPrintModal && lastSaleData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Impressão Térmica</h3>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Venda processada com sucesso! Deseja imprimir o comprovante?</p>
              
              {lastSaleData.client && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeClient"
                    checked={includeClientInPrint}
                    onChange={(e) => setIncludeClientInPrint(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="includeClient" className="text-sm text-gray-700">
                    Incluir dados do cliente no comprovante
                  </label>
                </div>
              )}
              
              <div className="border rounded-lg p-3 bg-gray-50">
                <ThermalPrint
                  sale={lastSaleData}
                  company={{
                    name: "Demo Restaurante Bella Vista",
                    cnpj: "12.345.678/0001-90",
                    address: "Rua das Flores, 123 - Centro",
                    phone: "(11) 99999-9999"
                  }}
                  branch={{
                    name: "Filial Centro",
                    address: "Rua das Flores, 123 - Centro",
                    phone: "(11) 99999-9999"
                  }}
                  includeClient={includeClientInPrint}
                />
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
                ✕
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

              {/* Tipo de Cliente */}
              <div>
                <Label htmlFor="client-type">Tipo de Cliente</Label>
                <Select 
                  value={clientForm.client_type} 
                  onValueChange={(value: 'individual' | 'company') => 
                    setClientForm({...clientForm, client_type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Pessoa Física</SelectItem>
                    <SelectItem value="company">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Documento */}
              <div>
                <Label htmlFor="client-document">
                  {clientForm.client_type === 'individual' ? 'CPF' : 'CNPJ'}
                </Label>
                <Input
                  id="client-document"
                  type="text"
                  value={clientForm.document}
                  onChange={(e) => setClientForm({...clientForm, document: e.target.value})}
                  placeholder={clientForm.client_type === 'individual' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
              </div>

              {/* Email */}
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

              {/* Endereço */}
              <div>
                <Label htmlFor="client-address">Endereço</Label>
                <Textarea
                  id="client-address"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({...clientForm, address: e.target.value})}
                  placeholder="Rua, número, bairro, cidade, CEP"
                  rows={2}
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
    </div>
  );
}