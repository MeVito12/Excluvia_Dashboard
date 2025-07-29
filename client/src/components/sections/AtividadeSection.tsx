import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Activity as ActivityIcon, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { useCategory } from '@/contexts/CategoryContext';
import { useSales } from '@/hooks/useSales';
import { useClients } from '@/hooks/useClients';

const AtividadeSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('vendas');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { sales } = useSales();
  const { clients } = useClients();

  const filterByDate = (data: any[], dateField: string) => {
    if (!dateFrom && !dateTo) return data;
    return data.filter((item: any) => {
      const itemDate = new Date(item[dateField]);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  const filteredSales = filterByDate(sales, 'date').filter((sale: any) =>
    sale.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
  };

  const renderSales = () => (
    <div className="space-y-2">
      {filteredSales.map((sale: any) => (
        <div key={sale.id} className="list-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium">Venda #{sale.id}</h3>
                <p className="text-sm text-gray-600">{sale.client}</p>
                <p className="text-sm text-gray-500">{sale.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">R$ {sale.total.toFixed(2)}</p>
              <Badge className="badge-success">{sale.paymentMethod}</Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderClients = () => (
    <div className="space-y-2">
      {filteredClients.map((client: any) => (
        <div key={client.id} className="list-card">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium">{client.name}</h3>
              <p className="text-sm text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-500">{client.phone}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderReports = () => (
    <div className="main-card">
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
        <p className="text-gray-600 mb-4">Gere relatórios personalizados das suas atividades</p>
        <Button className="btn btn-primary">
          <Download className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
      </div>
    </div>
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ActivityIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Atividade</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Input
              type="date"
              placeholder="Data inicial"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="Data final"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <Button variant="outline" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Navegação por abas */}
      <div className="tab-navigation">
        <button
          onClick={() => setActiveTab('vendas')}
          className={`tab-button ${activeTab === 'vendas' ? 'active' : ''}`}
        >
          <ShoppingCart className="h-4 w-4" />
          Vendas
        </button>
        <button
          onClick={() => setActiveTab('clientes')}
          className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`}
        >
          <Users className="h-4 w-4" />
          Clientes
        </button>
        <button
          onClick={() => setActiveTab('relatorios')}
          className={`tab-button ${activeTab === 'relatorios' ? 'active' : ''}`}
        >
          <Download className="h-4 w-4" />
          Relatórios
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="main-card">
        {activeTab === 'vendas' && renderSales()}
        {activeTab === 'clientes' && renderClients()}
        {activeTab === 'relatorios' && renderReports()}
      </div>
    </div>
  );
};

export default AtividadeSection;