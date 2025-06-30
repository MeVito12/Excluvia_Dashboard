import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('produtos');

  // Categories available
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'Pet Shop', label: 'Pet Shop' },
    { value: 'Pet Shop - Veterinário', label: 'Pet Shop - Veterinário' },
    { value: 'Medicamentos', label: 'Medicamentos' },
    { value: 'Material Hospitalar', label: 'Material Hospitalar' },
    { value: 'Equipamentos Médicos', label: 'Equipamentos Médicos' },
    { value: 'Laticínios', label: 'Laticínios' },
    { value: 'Panificados', label: 'Panificados' },
    { value: 'Massas', label: 'Massas' },
    { value: 'Smartphones', label: 'Smartphones' },
    { value: 'Notebooks', label: 'Notebooks' },
    { value: 'Componentes', label: 'Componentes' }
  ];

  // Segments for clients
  const segments = [
    { value: 'all', label: 'Todos os Segmentos' },
    { value: 'Pet Shop', label: 'Pet Shop' },
    { value: 'Pet Shop - Veterinário', label: 'Pet Shop - Veterinário' },
    { value: 'Saúde', label: 'Saúde' },
    { value: 'Varejo Alimentício', label: 'Varejo Alimentício' },
    { value: 'Alimentício', label: 'Alimentício' },
    { value: 'Tecnologia', label: 'Tecnologia' }
  ];



  // Mock data para produtos diversificados
  const products = [
    // Pet Shop
    {
      id: 1,
      name: 'Ração Premium Golden para Cães',
      sku: 'PET001',
      category: 'Pet Shop',
      currentStock: 12,
      minimumStock: 5,
      price: 89.90,
      supplier: 'Premier Pet',
      expirationDate: new Date('2024-10-15'),
      status: 'normal'
    },
    {
      id: 2,
      name: 'Vacina V10 Canina',
      sku: 'PET002',
      category: 'Pet Shop - Veterinário',
      currentStock: 3,
      minimumStock: 8,
      price: 45.00,
      supplier: 'Zoetis',
      expirationDate: new Date('2024-08-30'),
      status: 'low_stock'
    },
    {
      id: 3,
      name: 'Brinquedo Kong Classic',
      sku: 'PET003',
      category: 'Pet Shop',
      currentStock: 25,
      minimumStock: 10,
      price: 35.50,
      supplier: 'Kong Company',
      expirationDate: null,
      status: 'normal'
    },
    // Médicos
    {
      id: 4,
      name: 'Dipirona 500mg',
      sku: 'MED001',
      category: 'Medicamentos',
      currentStock: 150,
      minimumStock: 50,
      price: 8.90,
      supplier: 'EMS',
      expirationDate: new Date('2025-03-20'),
      status: 'normal'
    },
    {
      id: 5,
      name: 'Seringa Descartável 5ml',
      sku: 'MED002',
      category: 'Material Hospitalar',
      currentStock: 20,
      minimumStock: 100,
      price: 0.85,
      supplier: 'BD',
      expirationDate: new Date('2026-12-31'),
      status: 'low_stock'
    },
    {
      id: 6,
      name: 'Termômetro Digital',
      sku: 'MED003',
      category: 'Equipamentos Médicos',
      currentStock: 8,
      minimumStock: 5,
      price: 25.90,
      supplier: 'G-Tech',
      expirationDate: null,
      status: 'normal'
    },
    // Alimentícios
    {
      id: 7,
      name: 'Leite Integral 1L',
      sku: 'ALI001',
      category: 'Laticínios',
      currentStock: 45,
      minimumStock: 20,
      price: 4.50,
      supplier: 'Nestlé',
      expirationDate: new Date('2024-07-15'),
      status: 'expiring_soon'
    },
    {
      id: 8,
      name: 'Pão de Forma Integral',
      sku: 'ALI002',
      category: 'Panificados',
      currentStock: 8,
      minimumStock: 15,
      price: 6.90,
      supplier: 'Wickbold',
      expirationDate: new Date('2024-07-05'),
      status: 'low_stock'
    },
    {
      id: 9,
      name: 'Macarrão Espaguete 500g',
      sku: 'ALI003',
      category: 'Massas',
      currentStock: 35,
      minimumStock: 10,
      price: 3.20,
      supplier: 'Barilla',
      expirationDate: new Date('2025-12-31'),
      status: 'normal'
    },
    // Tecnologia
    {
      id: 10,
      name: 'iPhone 15 Pro',
      sku: 'TEC001',
      category: 'Smartphones',
      currentStock: 3,
      minimumStock: 5,
      price: 8999.00,
      supplier: 'Apple',
      expirationDate: null,
      status: 'low_stock'
    },
    {
      id: 11,
      name: 'MacBook Air M2',
      sku: 'TEC002',
      category: 'Notebooks',
      currentStock: 7,
      minimumStock: 3,
      price: 12500.00,
      supplier: 'Apple',
      expirationDate: null,
      status: 'normal'
    },
    {
      id: 12,
      name: 'SSD Samsung 1TB',
      sku: 'TEC003',
      category: 'Componentes',
      currentStock: 15,
      minimumStock: 8,
      price: 450.00,
      supplier: 'Samsung',
      expirationDate: null,
      status: 'normal'
    }
  ];

  // Mock data para vendas diversificadas
  const sales = [
    // Pet Shop
    {
      id: 1,
      productName: 'Ração Premium Golden para Cães',
      category: 'Pet Shop',
      clientName: 'Ana Maria Oliveira',
      clientType: 'Particular',
      quantity: 2,
      unitPrice: 89.90,
      totalPrice: 179.80,
      saleDate: new Date('2024-06-30'),
      status: 'delivered'
    },
    {
      id: 2,
      productName: 'Vacina V10 Canina',
      category: 'Pet Shop - Veterinário',
      clientName: 'Clínica Veterinária Bichos & Cia',
      clientType: 'Empresa',
      quantity: 5,
      unitPrice: 45.00,
      totalPrice: 225.00,
      saleDate: new Date('2024-06-29'),
      status: 'confirmed'
    },
    // Médicos
    {
      id: 3,
      productName: 'Dipirona 500mg',
      category: 'Medicamentos',
      clientName: 'Hospital São Lucas',
      clientType: 'Empresa',
      quantity: 50,
      unitPrice: 8.90,
      totalPrice: 445.00,
      saleDate: new Date('2024-06-30'),
      status: 'preparing'
    },
    {
      id: 4,
      productName: 'Termômetro Digital',
      category: 'Equipamentos Médicos',
      clientName: 'Dr. Carlos Mendes',
      clientType: 'Profissional',
      quantity: 3,
      unitPrice: 25.90,
      totalPrice: 77.70,
      saleDate: new Date('2024-06-28'),
      status: 'delivered'
    },
    // Alimentícios
    {
      id: 5,
      productName: 'Leite Integral 1L',
      category: 'Laticínios',
      clientName: 'Supermercado Central',
      clientType: 'Empresa',
      quantity: 24,
      unitPrice: 4.50,
      totalPrice: 108.00,
      saleDate: new Date('2024-06-30'),
      status: 'shipped'
    },
    {
      id: 6,
      productName: 'Macarrão Espaguete 500g',
      category: 'Massas',
      clientName: 'Restaurante Bella Vista',
      clientType: 'Empresa',
      quantity: 10,
      unitPrice: 3.20,
      totalPrice: 32.00,
      saleDate: new Date('2024-06-29'),
      status: 'delivered'
    },
    // Tecnologia
    {
      id: 7,
      productName: 'iPhone 15 Pro',
      category: 'Smartphones',
      clientName: 'Pedro Santos Silva',
      clientType: 'Particular',
      quantity: 1,
      unitPrice: 8999.00,
      totalPrice: 8999.00,
      saleDate: new Date('2024-06-30'),
      status: 'confirmed'
    },
    {
      id: 8,
      productName: 'SSD Samsung 1TB',
      category: 'Componentes',
      clientName: 'TechFix Informática',
      clientType: 'Empresa',
      quantity: 5,
      unitPrice: 450.00,
      totalPrice: 2250.00,
      saleDate: new Date('2024-06-28'),
      status: 'delivered'
    }
  ];

  // Mock data para clientes diversificados
  const clients = [
    // Pet Shop
    {
      id: 1,
      name: 'Ana Maria Oliveira',
      email: 'ana.oliveira@email.com',
      type: 'Particular',
      segment: 'Pet Shop',
      totalPurchases: 8,
      totalSpent: 1450.25,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 2,
      name: 'Clínica Veterinária Bichos & Cia',
      email: 'contato@bichosecia.com.br',
      type: 'Empresa',
      segment: 'Pet Shop - Veterinário',
      totalPurchases: 25,
      totalSpent: 12500.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Rio de Janeiro'
    },
    // Médicos
    {
      id: 3,
      name: 'Hospital São Lucas',
      email: 'compras@saolucas.com.br',
      type: 'Empresa',
      segment: 'Saúde',
      totalPurchases: 45,
      totalSpent: 35000.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'Belo Horizonte'
    },
    {
      id: 4,
      name: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@clinica.com',
      type: 'Profissional',
      segment: 'Saúde',
      totalPurchases: 12,
      totalSpent: 2800.50,
      lastPurchaseDate: new Date('2024-06-28'),
      status: 'active',
      city: 'São Paulo'
    },
    // Alimentícios
    {
      id: 5,
      name: 'Supermercado Central',
      email: 'compras@central.com.br',
      type: 'Empresa',
      segment: 'Varejo Alimentício',
      totalPurchases: 156,
      totalSpent: 45600.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'Salvador'
    },
    {
      id: 6,
      name: 'Restaurante Bella Vista',
      email: 'pedidos@bellavista.com.br',
      type: 'Empresa',
      segment: 'Alimentício',
      totalPurchases: 89,
      totalSpent: 18950.00,
      lastPurchaseDate: new Date('2024-06-29'),
      status: 'active',
      city: 'Florianópolis'
    },
    // Tecnologia
    {
      id: 7,
      name: 'Pedro Santos Silva',
      email: 'pedro.santos@email.com',
      type: 'Particular',
      segment: 'Tecnologia',
      totalPurchases: 3,
      totalSpent: 15500.00,
      lastPurchaseDate: new Date('2024-06-30'),
      status: 'active',
      city: 'São Paulo'
    },
    {
      id: 8,
      name: 'TechFix Informática',
      email: 'vendas@techfix.com.br',
      type: 'Empresa',
      segment: 'Tecnologia',
      totalPurchases: 67,
      totalSpent: 89500.00,
      lastPurchaseDate: new Date('2024-06-28'),
      status: 'active',
      city: 'Porto Alegre'
    },
    // Cliente inativo
    {
      id: 9,
      name: 'Farmácia Popular',
      email: 'contato@popular.com.br',
      type: 'Empresa',
      segment: 'Saúde',
      totalPurchases: 28,
      totalSpent: 12500.00,
      lastPurchaseDate: new Date('2024-03-15'),
      status: 'inactive',
      city: 'Recife'
    }
  ];

  // Filter functions
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sale.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || client.segment === selectedSegment;
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    return matchesSearch && matchesSegment && matchesStatus;
  });

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white text-gray-900"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="text-gray-900 hover:bg-gray-50">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="bg-white text-gray-900">
                  <Filter className="w-4 h-4 mr-2" />
                  Mais Filtros
                </Button>
              </div>

              {/* Lista de produtos */}
              <div className="space-y-4">
                {filteredProducts.map((product) => {
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
              {/* Filtros para vendas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar vendas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white text-gray-900"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="text-gray-900 hover:bg-gray-50">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="bg-white text-gray-900">
                  <Calendar className="w-4 h-4 mr-2" />
                  Período
                </Button>
              </div>

              <div className="space-y-4">
                {filteredSales.map((sale) => (
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
                          <span><strong>Categoria:</strong> {sale.category}</span>
                          <span><strong>Tipo:</strong> {sale.clientType}</span>
                          <span><strong>Quantidade:</strong> {sale.quantity}</span>
                          <span><strong>Preço Unit.:</strong> R$ {sale.unitPrice.toFixed(2)}</span>
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
              {/* Filtros para clientes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar clientes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white text-gray-900"
                  />
                </div>
                
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Segmento" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {segments.map((segment) => (
                      <SelectItem key={segment.value} value={segment.value} className="text-gray-900 hover:bg-gray-50">
                        {segment.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white text-gray-900">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">Todos</SelectItem>
                    <SelectItem value="active" className="text-gray-900 hover:bg-gray-50">Ativos</SelectItem>
                    <SelectItem value="inactive" className="text-gray-900 hover:bg-gray-50">Inativos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="bg-white text-gray-900">
                  <Users className="w-4 h-4 mr-2" />
                  Relatório
                </Button>
              </div>

              <div className="space-y-4">
                {filteredClients.map((client) => (
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
                          <span><strong>Tipo:</strong> {client.type}</span>
                          <span><strong>Segmento:</strong> {client.segment}</span>
                          <span><strong>Cidade:</strong> {client.city}</span>
                          <span><strong>Compras:</strong> {client.totalPurchases}</span>
                          <span><strong>Total Gasto:</strong> R$ {client.totalSpent.toFixed(2)}</span>
                          <span><strong>Ticket Médio:</strong> R$ {(client.totalSpent / client.totalPurchases).toFixed(2)}</span>
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