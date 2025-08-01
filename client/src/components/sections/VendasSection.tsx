import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Minus, ShoppingCart, Scan, Search, Trash2, CreditCard, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  const [notes, setNotes] = useState<string>("");
  
  // Estados de busca de produtos
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [barcodeInput, setBarcodeInput] = useState<string>("");
  const [showProductSearch, setShowProductSearch] = useState<boolean>(false);
  const [showClientModal, setShowClientModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

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
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Venda processada com sucesso!",
      });
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
    setNotes("");
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
      notes: notes || undefined,
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
                />
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre a venda..."
                  rows={3}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Selecionar Cliente</h3>
              <button 
                onClick={() => setShowClientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedClient(null);
                  setShowClientModal(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 border border-gray-200"
              >
                Venda sem cliente
              </button>
              
              {clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client.id!);
                    setShowClientModal(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 border border-gray-200"
                >
                  {client.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Seleção de Método de Pagamento */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Método de Pagamento</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              {[
                { value: "dinheiro", label: "💵 Dinheiro" },
                { value: "pix", label: "📱 PIX" },
                { value: "cartao_credito", label: "💳 Cartão de Crédito" },
                { value: "cartao_debito", label: "💳 Cartão de Débito" },
                { value: "boleto", label: "📄 Boleto" }
              ].map((method) => (
                <button
                  key={method.value}
                  onClick={() => {
                    setPaymentMethod(method.value);
                    setShowPaymentModal(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 border border-gray-200"
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}