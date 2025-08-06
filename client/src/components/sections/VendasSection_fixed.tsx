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
        <button
          onClick={() => setActiveTab('vendas')}
          className={`tab-button ${activeTab === 'vendas' ? 'active' : ''}`}
        >
          <ShoppingCart className="w-4 h-4" />
          Vendas
        </button>
        <button
          onClick={() => setActiveTab('caixa')}
          className={`tab-button ${activeTab === 'caixa' ? 'active' : ''}`}
        >
          <CreditCard className="w-4 h-4" />
          Caixa
        </button>
      </div>

      {/* Conteúdo da aba vendas */}
      {activeTab === 'vendas' && (
        <div className="tab-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Painel de Produtos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Produtos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Busca de produtos */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowProductSearch(!showProductSearch)}
                    className="flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {showProductSearch ? 'Ocultar' : 'Buscar'}
                  </Button>
                </div>

                {/* Interface de busca */}
                {showProductSearch && (
                  <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
                    <Input
                      placeholder="Buscar produto..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Input
                      placeholder="Código de barras"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                    />
                  </div>
                )}

                {/* Lista de produtos */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {products.filter((product: Product) => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (product.barcode && product.barcode.includes(barcodeInput))
                  ).slice(0, 20).map((product) => (
                    <div
                      key={product.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        const existingItem = cart.find(item => item.productId === product.id);
                        if (existingItem) {
                          setCart(cart.map(item => 
                            item.productId === product.id 
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                          ));
                        } else {
                          setCart([...cart, {
                            productId: product.id,
                            productName: product.name,
                            quantity: 1,
                            unitPrice: product.price || 0,
                            totalPrice: product.price || 0
                          }]);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <p className="text-lg font-bold text-green-600">
                            R$ {(product.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Painel do Carrinho */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Carrinho ({cart.length})
                  </span>
                  {cart.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCart([])}
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Carrinho vazio</p>
                    <p className="text-sm">Adicione produtos para começar</p>
                  </div>
                ) : (
                  <>
                    {/* Itens do carrinho */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {cart.map((item) => (
                        <div key={item.productId} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-gray-600">
                                R$ {item.unitPrice.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    setCart(cart.map(cartItem => 
                                      cartItem.productId === item.productId 
                                        ? { ...cartItem, quantity: cartItem.quantity - 1, totalPrice: cartItem.unitPrice * (cartItem.quantity - 1) }
                                        : cartItem
                                    ));
                                  } else {
                                    setCart(cart.filter(cartItem => cartItem.productId !== item.productId));
                                  }
                                }}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setCart(cart.map(cartItem => 
                                    cartItem.productId === item.productId 
                                      ? { ...cartItem, quantity: cartItem.quantity + 1, totalPrice: cartItem.unitPrice * (cartItem.quantity + 1) }
                                      : cartItem
                                  ));
                                }}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">R$ {(item.unitPrice * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumo e Ações */}
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>R$ {cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0).toFixed(2)}</span>
                      </div>

                      {/* Botões de ação */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowSellersModal(true)}
                          className="flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Vendedores
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowClientModal(true)}
                          className="flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Cliente
                        </Button>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setShowPaymentModal(true)}
                        disabled={cart.length === 0}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Finalizar Venda
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de Vendedores - MODAL SIMPLES SEM DIALOG */}
      {showSellersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSellersModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Selecionar Vendedores</h2>
                  <p className="text-sm text-gray-600">Escolha os vendedores responsáveis por esta venda</p>
                </div>
                <button 
                  onClick={() => setShowSellersModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
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
              
              <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => setShowSellersModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowSellersModal(false)}>
                  Confirmar Seleção
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Clientes - MODAL SIMPLES SEM DIALOG */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowClientModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Selecionar Cliente</h2>
                  <p className="text-sm text-gray-600">Escolha um cliente existente ou cadastre um novo</p>
                </div>
                <button 
                  onClick={() => setShowClientModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Busca de clientes */}
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

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
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setShowClientModal(false);
                    setShowAddClientModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Novo Cliente
                </Button>
              </div>
              
              <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => setShowClientModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={() => setShowClientModal(false)}
                  disabled={!selectedClient}
                >
                  Selecionar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pagamento - MODAL SIMPLES SEM DIALOG */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPaymentModal(false)}></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Método de Pagamento</h2>
                  <p className="text-sm text-gray-600">Selecione como o cliente irá pagar</p>
                </div>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Método de Pagamento</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">💵 Dinheiro</SelectItem>
                      <SelectItem value="pix">📱 PIX</SelectItem>
                      <SelectItem value="cartao_credito">💳 Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">💳 Cartão de Débito</SelectItem>
                      <SelectItem value="boleto">📄 Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(paymentMethod === 'cartao_credito' || paymentMethod === 'boleto') && (
                  <div>
                    <Label>Número de Parcelas</Label>
                    <Select value={installments.toString()} onValueChange={(value) => setInstallments(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 10, 12].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}x {num === 1 ? 'à vista' : `de R$ ${(cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0) / num).toFixed(2)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>R$ {cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  {paymentMethod && (
                    <p className="text-sm text-gray-600 mt-1">
                      {getPaymentMethodLabel(paymentMethod)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={async () => {
                    if (!paymentMethod) {
                      toast({
                        title: "Erro",
                        description: "Selecione um método de pagamento",
                        variant: "destructive"
                      });
                      return;
                    }

                    try {
                      const saleData = {
                        clientId: selectedClient,
                        cart: cart,
                        paymentMethod: paymentMethod,
                        installments: installments,
                        sellers: selectedSellers,
                        couponCode: couponCode,
                        couponDiscount: couponDiscount
                      };

                      await processSaleMutation.mutateAsync(saleData);
                      
                      toast({
                        title: "Sucesso!",
                        description: "Venda processada com sucesso",
                      });

                      // Limpar formulário
                      setCart([]);
                      setSelectedClient(null);
                      setPaymentMethod("");
                      setInstallments(1);
                      setSelectedSellers([]);
                      setShowPaymentModal(false);

                    } catch (error) {
                      toast({
                        title: "Erro",
                        description: "Falha ao processar venda",
                        variant: "destructive"
                      });
                    }
                  }}
                  disabled={!paymentMethod || processSaleMutation.isPending}
                >
                  {processSaleMutation.isPending ? "Processando..." : "Finalizar Venda"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}