import { useState, useMemo } from 'react';
import { TrendingUp, BarChart3, DollarSign, ShoppingCart, Users, Calendar, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSales } from '@/hooks/useSales';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';

const GraficosSection = () => {
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { sales } = useSales();
  const { clients } = useClients();
  const { products } = useProducts();

  const calculateMetrics = useMemo(() => {
    const filteredSales = sales.filter((sale: any) => {
      if (!dateFrom && !dateTo) return true;
      const saleDate = new Date(sale.date);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
      return saleDate >= fromDate && saleDate <= toDate;
    });

    const totalSales = filteredSales.reduce((sum: number, sale: any) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const averageTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
    const activeClients = clients.length;

    return {
      totalSales,
      totalOrders,
      averageTicket,
      activeClients,
      period: dateFrom && dateTo ? `${dateFrom} a ${dateTo}` : 'Todos os períodos',
      growth: '+12,5%'
    };
  }, [sales, clients, dateFrom, dateTo]);

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  const applyFilters = () => {
    alert('Filtros aplicados com sucesso!');
  };

  const exportData = (type: string) => {
    alert(`Exportando ${type}...`);
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Gráficos</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por Período</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Data inicial:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="dd/mm/aaaa"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Data final:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="dd/mm/aaaa"
            />
          </div>

          <Button 
            onClick={clearFilters}
            variant="outline"
            className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          >
            Limpar Filtros
          </Button>

          <Button 
            onClick={applyFilters}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {calculateMetrics.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-green-600">{calculateMetrics.growth} vs período anterior</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-blue-600">{calculateMetrics.totalOrders}</p>
              <p className="text-sm text-blue-600">Transações realizadas</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {calculateMetrics.averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-purple-600">Por transação</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-orange-600">{calculateMetrics.activeClients}</p>
              <p className="text-sm text-orange-600">Base de clientes</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Gráficos e Exportações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="main-card">
          <h3 className="text-lg font-semibold mb-4">Análise de Vendas</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Gráfico de vendas por período</p>
              <p className="text-sm text-gray-500">{calculateMetrics.period}</p>
            </div>
          </div>
        </div>

        <div className="main-card">
          <h3 className="text-lg font-semibold mb-4">Top Produtos</h3>
          <div className="space-y-3">
            {products.slice(0, 5).map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">Estoque: {product.quantity}</p>
                  </div>
                </div>
                <Badge className="badge-success">Ativo</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Exportações */}
      <div className="main-card mt-6">
        <h3 className="text-lg font-semibold mb-4">Exportar Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => exportData('Métricas')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Métricas
          </Button>
          
          <Button 
            onClick={() => exportData('Relatório Semanal')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Relatório Semanal
          </Button>
          
          <Button 
            onClick={() => exportData('Análise Completa')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Análise Completa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GraficosSection;