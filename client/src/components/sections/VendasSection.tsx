import { useProducts, useSales, useClients, useAppointments, useFinancial, useTransfers, useMoneyTransfers, useBranches, useCreateProduct, useCreateSale, useCreateClient, useCreateAppointment, useCreateFinancial, useCreateTransfer, useCreateMoneyTransfer, useCreateBranch, useCreateCartSale } from "@/hooks/useData";
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
import ThermalPrint from "@/components/ThermalPrint";
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
  
  // Estados para impressão térmica
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [lastSaleData, setLastSaleData] = useState<any>(null);
  const [includeClientInPrint, setIncludeClientInPrint] = useState<boolean>(false);

  // Buscar produtos
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!user,
  });

  // Buscar clientes
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: !!user,
  });

  // Filtrar produtos por busca ou código de barras
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.includes(barcodeInput) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Processar venda do carrinho
  const processSaleMutation = useMutation({
    mutationFn: async (saleData: SaleCart) => {
      const response = await fetch('/api/sales/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id.toString() || '18',
        },
        body: JSON.stringify(saleData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar venda');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sucesso!",
        description: "Venda processada com sucesso!",
      });
      
      // Preparar dados para impressão térmica
      const saleForPrint = {
        id: data.sale.id,
        products: cart.map(item => ({
          name: item.productName,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.totalPrice
        })),
        total: calculateCartTotal() - discount,
        paymentMethod: getPaymentMethodLabel(paymentMethod),
        saleDate: new Date().toISOString(),
        client: foundClient
      };
      
      setLastSaleData(saleForPrint);
      setShowPrintModal(true);
      
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || 'Erro ao processar venda',
        variant: "destructive",
      });
    },
  });

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

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
    setSelectedClient(null);
    setPaymentMethod("");
    setDiscount(0);
  };

  // Calcular totais
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = (subtotal * discount) / 100;
  const totalAmount = subtotal - discountAmount;

  // Processar venda
  const handleProcessSale = () => {
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

    const saleData: SaleCart = {
      items: cart,
      clientId: selectedClient || undefined,
      clientName: selectedClient ? clients.find(c => c.id === selectedClient)?.name : undefined,
      subtotal,
      discount,
      totalAmount,
      paymentMethod: paymentMethod as any,
    };

    processSaleMutation.mutate(saleData);
  };

  // Processar código de barras (simular "bip")
  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
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

              {/* Desconto */}
              <div>
                <Label htmlFor="discount">Desconto (%)</Label>
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
                    <span>Desconto ({discount}%):</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
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
    </div>
  );
}