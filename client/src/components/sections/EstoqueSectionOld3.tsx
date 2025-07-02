import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategory } from '@/contexts/CategoryContext';
import ModernIcon from '@/components/ui/modern-icon';
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
  category: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  lastPurchase: string;
  totalSpent: number;
  status: 'Ativo' | 'Inativo';
}

const EstoqueSectionNew = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for products
  const products: Product[] = [
    { id: 1, name: 'Smartphone Samsung Galaxy S24', category: 'eletrônicos', stock: 15, minStock: 5, price: 2899.99, supplier: 'Tech Distribuidor', lastRestock: '2024-12-15', status: 'Em Estoque' },
    { id: 2, name: 'Notebook Dell Inspiron 15', category: 'eletrônicos', stock: 8, minStock: 3, price: 2499.99, supplier: 'Dell Brasil', lastRestock: '2024-12-10', status: 'Em Estoque' },
    { id: 3, name: 'Camiseta Polo Ralph Lauren', category: 'vestuário', stock: 25, minStock: 10, price: 189.99, supplier: 'Fashion Store', lastRestock: '2024-12-20', status: 'Em Estoque' },
    { id: 4, name: 'Tênis Nike Air Max', category: 'vestuário', stock: 12, minStock: 8, price: 399.99, supplier: 'Sports Direct', lastRestock: '2024-12-18', status: 'Em Estoque' },
    { id: 5, name: 'Livro "Sapiens"', category: 'livros', stock: 2, minStock: 5, price: 49.99, supplier: 'Editora Companhia das Letras', lastRestock: '2024-12-05', status: 'Estoque Baixo' }
  ];

  // Mock data for sales
  const sales: Sale[] = [
    { id: 1, date: '2024-12-25', clientName: 'João Silva', products: ['Smartphone Samsung Galaxy S24'], total: 2899.99, status: 'Concluída', category: 'eletrônicos' },
    { id: 2, date: '2024-12-24', clientName: 'Maria Santos', products: ['Camiseta Polo Ralph Lauren', 'Tênis Nike Air Max'], total: 589.98, status: 'Concluída', category: 'vestuário' },
    { id: 3, date: '2024-12-23', clientName: 'Carlos Oliveira', products: ['Notebook Dell Inspiron 15'], total: 2499.99, status: 'Pendente', category: 'eletrônicos' },
    { id: 4, date: '2024-12-22', clientName: 'Ana Costa', products: ['Livro "Sapiens"'], total: 49.99, status: 'Concluída', category: 'livros' }
  ];

  // Mock data for clients
  const clients: Client[] = [
    { id: 1, name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-9999', category: 'eletrônicos', lastPurchase: '2024-12-25', totalSpent: 5799.98, status: 'Ativo' },
    { id: 2, name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 88888-8888', category: 'vestuário', lastPurchase: '2024-12-24', totalSpent: 1179.96, status: 'Ativo' },
    { id: 3, name: 'Carlos Oliveira', email: 'carlos@email.com', phone: '(11) 77777-7777', category: 'eletrônicos', lastPurchase: '2024-12-23', totalSpent: 2499.99, status: 'Ativo' },
    { id: 4, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 66666-6666', category: 'livros', lastPurchase: '2024-12-22', totalSpent: 149.97, status: 'Ativo' }
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
                    className="standard-input"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="vestuário">Vestuário</SelectItem>
                    <SelectItem value="livros">Livros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">Categoria: {product.category}</p>
                      <p className="text-sm text-gray-600">Estoque: {product.stock} unidades</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-gray-900">R$ {product.price.toFixed(2)}</p>
                      <Badge className={product.status === 'Em Estoque' ? 'badge-success' : product.status === 'Estoque Baixo' ? 'badge-warning' : 'badge-error'}>
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

              <div className="space-y-3">
                {sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Venda #{sale.id}</h4>
                      <p className="text-sm text-gray-600">Cliente: {sale.clientName}</p>
                      <p className="text-sm text-gray-600">Data: {sale.date}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-gray-900">R$ {sale.total.toFixed(2)}</p>
                      <Badge className={sale.status === 'Concluída' ? 'badge-success' : sale.status === 'Pendente' ? 'badge-warning' : 'badge-error'}>
                        {sale.status}
                      </Badge>
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

              <div className="space-y-3">
                {clients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{client.name}</h4>
                      <p className="text-sm text-gray-600">Email: {client.email}</p>
                      <p className="text-sm text-gray-600">Última compra: {client.lastPurchase}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-gray-900">R$ {client.totalSpent.toFixed(2)}</p>
                      <Badge className={client.status === 'Ativo' ? 'badge-success' : 'badge-error'}>
                        {client.status}
                      </Badge>
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
            <ModernIcon icon={Package} size="lg" contextual={true} />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">R$ 6.499</p>
            </div>
            <ModernIcon icon={DollarSign} size="lg" contextual={true} />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Clientes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
            </div>
            <ModernIcon icon={Users} size="lg" contextual={true} />
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Estoque Baixo</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">7</p>
            </div>
            <ModernIcon icon={AlertTriangle} size="lg" contextual={true} />
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

export default EstoqueSectionNew;