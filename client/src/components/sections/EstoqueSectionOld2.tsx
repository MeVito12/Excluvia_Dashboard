import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategory } from '@/contexts/CategoryContext';
import { UnifiedIcon, UnifiedCard } from '@/components/ui/unified-system';
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

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
  lastRestock: string;
  expiration?: string;
  status: 'Em Estoque' | 'Estoque Baixo' | 'Esgotado';
}

interface Sale {
  id: number;
  date: string;
  clientName: string;
  products: string[];
  total: number;
  status: 'Concluída' | 'Pendente' | 'Cancelada';
  paymentMethod: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  lastPurchase: string;
  status: 'Ativo' | 'Inativo';
  segment: string;
}

const EstoqueSectionNew = () => {
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { selectedCategory } = useCategory();

  // Mock data - In production, this would come from an API
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Smartphone Samsung Galaxy S24",
      category: "eletrônicos",
      stock: 15,
      minStock: 5,
      price: 2899.99,
      supplier: "TechSupply Ltda",
      lastRestock: "2024-12-15",
      status: "Em Estoque"
    },
    {
      id: 2,
      name: "Camiseta Polo Ralph Lauren",
      category: "vestuário",
      stock: 3,
      minStock: 10,
      price: 299.99,
      supplier: "Fashion Center",
      lastRestock: "2024-12-10",
      status: "Estoque Baixo"
    },
    {
      id: 3,
      name: "Notebook Dell Inspiron 15",
      category: "eletrônicos",
      stock: 8,
      minStock: 3,
      price: 3299.99,
      supplier: "Dell Brasil",
      lastRestock: "2024-12-18",
      status: "Em Estoque"
    }
  ];

  const mockSales: Sale[] = [
    {
      id: 1,
      date: "2024-12-20",
      clientName: "TechCorp Solutions",
      products: ["Smartphone Samsung Galaxy S24", "Notebook Dell Inspiron 15"],
      total: 6199.98,
      status: "Concluída",
      paymentMethod: "Cartão de Crédito"
    },
    {
      id: 2,
      date: "2024-12-19",
      clientName: "Empresa ABC",
      products: ["Camiseta Polo Ralph Lauren"],
      total: 299.99,
      status: "Pendente",
      paymentMethod: "PIX"
    }
  ];

  const mockClients: Client[] = [
    {
      id: 1,
      name: "TechCorp Solutions",
      email: "contato@techcorp.com.br",
      phone: "(11) 98765-4321",
      totalPurchases: 15699.95,
      lastPurchase: "2024-12-20",
      status: "Ativo",
      segment: "corporativo"
    },
    {
      id: 2,
      name: "Empresa ABC",
      email: "vendas@empresaabc.com",
      phone: "(11) 91234-5678",
      totalPurchases: 2299.97,
      lastPurchase: "2024-12-19",
      status: "Ativo",
      segment: "corporativo"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'produtos':
        return (
          <div className="space-y-4">
            <div className="standard-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Produtos</h3>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
              
              <div className="flex gap-4 mb-4">
                <div className="flex-1 flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="vestuário">Vestuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {mockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <UnifiedIcon icon={Package} forceColor="inventory" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Categoria: {product.category}</p>
                        <p className="text-sm text-gray-600">Fornecedor: {product.supplier}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">R$ {product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Estoque: {product.stock} unidades</p>
                        <Badge variant={product.status === 'Em Estoque' ? 'default' : 'destructive'}>
                          {product.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'vendas':
        return (
          <div className="space-y-4">
            <div className="standard-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Vendas</h3>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Venda
                </Button>
              </div>

              <div className="grid gap-4">
                {mockSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <UnifiedIcon icon={ShoppingCart} forceColor="financial" />
                      <div>
                        <p className="font-medium text-gray-900">{sale.clientName}</p>
                        <p className="text-sm text-gray-600">Data: {sale.date}</p>
                        <p className="text-sm text-gray-600">Produtos: {sale.products.join(', ')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">R$ {sale.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{sale.paymentMethod}</p>
                        <Badge variant={sale.status === 'Concluída' ? 'default' : 'secondary'}>
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'clientes':
        return (
          <div className="space-y-4">
            <div className="standard-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cliente
                </Button>
              </div>

              <div className="grid gap-4">
                {mockClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <UnifiedIcon icon={Users} forceColor="users" />
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-sm text-gray-600">{client.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">R$ {client.totalPurchases.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Última compra: {client.lastPurchase}</p>
                        <Badge variant={client.status === 'Ativo' ? 'default' : 'secondary'}>
                          {client.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'relatorios':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="standard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios de Vendas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vendas Hoje</span>
                    <span className="font-medium text-gray-900">R$ 6.499,97</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vendas Esta Semana</span>
                    <span className="font-medium text-gray-900">R$ 15.299,95</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Meta Mensal</span>
                    <span className="font-medium text-gray-900">R$ 50.000,00</span>
                  </div>
                  <Progress value={30} className="w-full" />
                </div>
              </div>

              <div className="standard-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Smartphone Samsung Galaxy S24</span>
                    <span className="font-medium text-gray-900">15 unidades</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Notebook Dell Inspiron 15</span>
                    <span className="font-medium text-gray-900">8 unidades</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Camiseta Polo Ralph Lauren</span>
                    <span className="font-medium text-gray-900">5 unidades</span>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-gray-700">
                <strong>Notificações Instantâneas:</strong> Você receberá alertas automáticos para:
                estoque baixo, produtos vencendo, novas vendas e clientes inativos.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="section-container">
      {/* Cabeçalho */}
      <div className="section-header">
        <div>
          <h1 className="section-title">Gestão de Estoque</h1>
          <p className="section-description">Controle total dos seus produtos, vendas e clientes</p>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">126</p>
            </div>
            <UnifiedIcon icon={Package} forceColor="inventory" size="lg" />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ 6.499</p>
            </div>
            <UnifiedIcon icon={DollarSign} forceColor="financial" size="lg" />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
            </div>
            <UnifiedIcon icon={Users} forceColor="users" size="lg" />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
            </div>
            <UnifiedIcon icon={AlertTriangle} forceColor="alerts" size="lg" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="standard-tabs">
        <button
          onClick={() => setActiveTab('produtos')}
          className={`standard-tab ${activeTab === 'produtos' ? 'active' : ''}`}
        >
          <Package className="w-4 h-4" />
          Produtos
        </button>
        <button
          onClick={() => setActiveTab('vendas')}
          className={`standard-tab ${activeTab === 'vendas' ? 'active' : ''}`}
        >
          <ShoppingCart className="w-4 h-4" />
          Vendas
        </button>
        <button
          onClick={() => setActiveTab('clientes')}
          className={`standard-tab ${activeTab === 'clientes' ? 'active' : ''}`}
        >
          <Users className="w-4 h-4" />
          Clientes
        </button>
        <button
          onClick={() => setActiveTab('relatorios')}
          className={`standard-tab ${activeTab === 'relatorios' ? 'active' : ''}`}
        >
          <BarChart3 className="w-4 h-4" />
          Relatórios
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export { default } from './EstoqueSectionNew';