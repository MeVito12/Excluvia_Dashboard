import { useState, useMemo } from 'react';
import { 
  Database, 
  Users, 
  TrendingUp, 
  Calendar,
  ShoppingCart,
  Activity,
  Package,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { useCategory } from '@/contexts/CategoryContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/hooks/useProducts';
import { useSales } from '@/hooks/useSales';
import { useClients } from '@/hooks/useClients';
import { useAppointments } from '@/hooks/useAppointments';

const DashboardSection = () => {
  const { selectedCategory } = useCategory();
  const { user } = useAuth();
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const { products } = useProducts();
  const { sales } = useSales();
  const { clients } = useClients();
  const { appointments } = useAppointments();

  const filterByDateRange = (data: any[], dateField: string) => {
    if (!dateFrom && !dateTo) return data;
    return data.filter((item: any) => {
      const itemDate = new Date(item[dateField]);
      const fromDate = dateFrom ? new Date(dateFrom) : new Date('1900-01-01');
      const toDate = dateTo ? new Date(dateTo) : new Date('2100-12-31');
      return itemDate >= fromDate && itemDate <= toDate;
    });
  };

  const filteredSales = filterByDateRange(sales, 'date');
  const filteredAppointments = filterByDateRange(appointments, 'date');

  const totalRevenue = filteredSales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0);
  const averageTicket = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  const clearFilters = () => {
    setDateFrom('');
    setDateTo('');
  };

  const applyFilters = () => {
    // Filtros já aplicados automaticamente pelos hooks
    alert('Filtros aplicados');
  };

  const navigateToSection = (sectionName: string) => {
    alert(`Navegando para ${sectionName}`);
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Database className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filtrar por Período</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Data inicial</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="dd/mm/aaaa"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Data final</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="dd/mm/aaaa"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={clearFilters}
              className="btn btn-outline"
            >
              Limpar Filtros
            </button>
            <button
              onClick={applyFilters}
              className="btn btn-primary"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-green-600">R$ {(totalRevenue || 0).toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-blue-600">{filteredSales.length}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-purple-600">R$ {(averageTicket || 0).toFixed(2)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-orange-600">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Seções de Dados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas Recentes */}
        <div className="main-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Vendas Recentes</h3>
            <button
              onClick={() => navigateToSection('Gráficos')}
              className="btn btn-outline flex items-center gap-2"
            >
              Ver Todas
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {filteredSales.slice(0, 5).map((sale: any) => (
              <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{sale.client}</p>
                  <p className="text-sm text-gray-600">{sale.date}</p>
                </div>
                <p className="font-semibold text-green-600">R$ {(sale.total || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Compromissos */}
        <div className="main-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Próximos Compromissos</h3>
            <button
              onClick={() => navigateToSection('Agendamentos')}
              className="btn btn-outline flex items-center gap-2"
            >
              Ver Todos
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {filteredAppointments.slice(0, 5).map((appointment: any) => (
              <div key={appointment.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{appointment.title}</p>
                  <p className="text-sm text-gray-600">{appointment.client}</p>
                  <p className="text-sm text-gray-500">{appointment.date} às {appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtos com Baixo Estoque */}
        <div className="main-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Estoque Baixo</h3>
            <button
              onClick={() => navigateToSection('Estoque')}
              className="btn btn-outline flex items-center gap-2"
            >
              Ver Estoque
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {products.filter((product: any) => product.quantity < 10).slice(0, 5).map((product: any) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">Estoque: {product.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="main-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Atividades Recentes</h3>
            <button
              onClick={() => navigateToSection('Atividade')}
              className="btn btn-outline flex items-center gap-2"
            >
              Ver Todas
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Sistema atualizado</p>
                <p className="text-sm text-gray-600">Dados sincronizados com sucesso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;