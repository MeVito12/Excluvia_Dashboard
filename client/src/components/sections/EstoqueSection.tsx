import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Users,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';

const EstoqueSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('produtos');

  // Mock data para produtos
  const products = [
    {
      id: 1,
      name: 'Smartphone XYZ',
      sku: 'SKU001',
      category: 'Eletrônicos',
      currentStock: 5,
      minimumStock: 10,
      price: 899.99,
      expirationDate: new Date('2024-12-31'),
      status: 'low_stock'
    },
    {
      id: 2,
      name: 'Notebook ABC',
      sku: 'SKU002',
      category: 'Eletrônicos',
      currentStock: 15,
      minimumStock: 5,
      price: 2499.99,
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 3,
      name: 'Medicamento XYZ',
      sku: 'MED001',
      category: 'Farmácia',
      currentStock: 8,
      minimumStock: 20,
      price: 45.50,
      expirationDate: new Date('2024-08-15'),
      status: 'expiring_soon'
    }
  ];

  // Mock data para vendas
  const sales = [
    {
      id: 1,
      productName: 'Smartphone XYZ',
      clientName: 'João Silva',
      quantity: 2,
      totalPrice: 1799.98,
      saleDate: new Date('2024-06-28'),
      status: 'confirmed'
    },
    {
      id: 2,
      productName: 'Notebook ABC',
      clientName: 'Maria Santos',
      quantity: 1,
      totalPrice: 2499.99,
      saleDate: new Date('2024-06-29'),
      status: 'delivered'
    }
  ];

  // Mock data para clientes
  const clients = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      totalPurchases: 5,
      totalSpent: 8999.95,
      lastPurchaseDate: new Date('2024-06-28'),
      status: 'active'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      totalPurchases: 12,
      totalSpent: 15000.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      totalPurchases: 2,
      totalSpent: 899.98,
      lastPurchaseDate: new Date('2024-04-15'),
      status: 'inactive'
    }
  ];

  const getStockStatus = (product: any) => {
    if (product.currentStock <= product.minimumStock) {
      return { label: 'Estoque Baixo', color: 'bg-red-500' };
    }
    return { label: 'Normal', color: 'bg-green-500' };
  };

  const getExpirationStatus = (expirationDate: Date | null) => {
    if (!expirationDate) return null;
    
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration <= 30) {
      return { label: 'Vence em breve', color: 'bg-orange-500', days: daysUntilExpiration };
    }
    return null;
  };

  const getSaleStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getClientStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Controle de Estoque</h2>
        <p className="text-gray-300">Gerencie produtos, vendas e clientes em um só lugar</p>
      </div>

      {/* Alertas de Estoque */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos em Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Vencendo</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Hoje</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Faturamento Hoje</p>
                <p className="text-2xl font-bold text-blue-600">R$ 8.999</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white">
          <TabsTrigger value="produtos" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="vendas" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="clientes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="relatorios" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        {/* Tab de Produtos */}
        <TabsContent value="produtos" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-black">Produtos</CardTitle>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white text-gray-900"
                  />
                </div>
                <Button variant="outline" className="bg-white text-gray-900">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>

              {/* Lista de produtos */}
              <div className="space-y-4">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  const expirationStatus = getExpirationStatus(product.expirationDate);
                  
                  return (
                    <div key={product.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <Badge className={`${stockStatus.color} text-white`}>
                              {stockStatus.label}
                            </Badge>
                            {expirationStatus && (
                              <Badge className={`${expirationStatus.color} text-white`}>
                                {expirationStatus.label} ({expirationStatus.days} dias)
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <span><strong>SKU:</strong> {product.sku}</span>
                            <span><strong>Categoria:</strong> {product.category}</span>
                            <span><strong>Estoque:</strong> {product.currentStock} / {product.minimumStock} min</span>
                            <span><strong>Preço:</strong> R$ {product.price.toFixed(2)}</span>
                          </div>
                          
                          {/* Barra de progresso do estoque */}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Nível de Estoque</span>
                              <span>{Math.round((product.currentStock / (product.minimumStock * 2)) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(product.currentStock / (product.minimumStock * 2)) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" className="bg-white text-gray-900">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="bg-white text-gray-900">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Vendas */}
        <TabsContent value="vendas" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-black">Vendas</CardTitle>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Venda
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.map((sale) => (
                  <div key={sale.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{sale.productName}</h4>
                          <Badge className={`${getSaleStatusColor(sale.status)} text-white`}>
                            {sale.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <span><strong>Cliente:</strong> {sale.clientName}</span>
                          <span><strong>Quantidade:</strong> {sale.quantity}</span>
                          <span><strong>Total:</strong> R$ {sale.totalPrice.toFixed(2)}</span>
                          <span><strong>Data:</strong> {sale.saleDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Clientes */}
        <TabsContent value="clientes" className="space-y-4">
          <Card className="bg-white border border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-black">Clientes</CardTitle>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div key={client.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{client.name}</h4>
                          <Badge className={`${getClientStatusColor(client.status)} text-white`}>
                            {client.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <span><strong>Email:</strong> {client.email}</span>
                          <span><strong>Compras:</strong> {client.totalPurchases}</span>
                          <span><strong>Total Gasto:</strong> R$ {client.totalSpent.toFixed(2)}</span>
                          <span><strong>Última Compra:</strong> {client.lastPurchaseDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Relatórios */}
        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black">Relatórios de Vendas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Diário de Vendas
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Semanal de Vendas
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Relatório Mensal de Vendas
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border/50">
              <CardHeader>
                <CardTitle className="text-black">Relatórios de Clientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Clientes Novos (30 dias)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Clientes Inativos
                </Button>
                <Button variant="outline" className="w-full justify-start bg-white text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Top Clientes por Compras
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Notificações */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-gray-700">
              <strong>Notificações Instantâneas:</strong> Você receberá alertas automáticos para:
              estoque baixo, produtos vencendo, novas vendas e clientes inativos.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstoqueSection;