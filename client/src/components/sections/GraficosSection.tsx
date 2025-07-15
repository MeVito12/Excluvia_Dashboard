import { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import DatabaseChart from '@/components/DatabaseChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Target,
  Activity,
  Clock,
  Zap,
  Star
} from 'lucide-react';

const GraficosSection = () => {
  const { selectedCategory } = useCategory();
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();

  // Dados específicos por categoria
  const getMetricsData = () => {
    if (selectedCategory === 'alimenticio') {
      return {
        today: { sales: 'R$ 2.450', growth: '+18%', orders: 47, avgTicket: 'R$ 52,13' },
        week: { sales: 'R$ 15.800', growth: '+12%', orders: 312, avgTicket: 'R$ 50,64' },
        month: { sales: 'R$ 68.500', growth: '+22%', orders: 1284, avgTicket: 'R$ 53,35' },
        customers: { total: 856, new: 42, retention: '78%', satisfaction: '4.8' }
      };
    } else if (selectedCategory === 'vendas') {
      return {
        today: { sales: 'R$ 8.950', growth: '+15%', orders: 12, avgTicket: 'R$ 745,83' },
        week: { sales: 'R$ 52.300', growth: '+8%', orders: 68, avgTicket: 'R$ 769,12' },
        month: { sales: 'R$ 186.700', growth: '+25%', orders: 247, avgTicket: 'R$ 755,87' },
        customers: { total: 324, new: 18, retention: '85%', satisfaction: '4.6' }
      };
    } else if (selectedCategory === 'pet') {
      return {
        today: { sales: 'R$ 1.820', growth: '+20%', orders: 23, avgTicket: 'R$ 79,13' },
        week: { sales: 'R$ 11.400', growth: '+16%', orders: 142, avgTicket: 'R$ 80,28' },
        month: { sales: 'R$ 45.600', growth: '+18%', orders: 578, avgTicket: 'R$ 78,89' },
        customers: { total: 445, new: 28, retention: '82%', satisfaction: '4.9' }
      };
    } else if (selectedCategory === 'medico') {
      return {
        today: { sales: 'R$ 3.680', growth: '+12%', orders: 34, avgTicket: 'R$ 108,24' },
        week: { sales: 'R$ 23.500', growth: '+9%', orders: 218, avgTicket: 'R$ 107,80' },
        month: { sales: 'R$ 98.200', growth: '+14%', orders: 896, avgTicket: 'R$ 109,60' },
        customers: { total: 672, new: 35, retention: '88%', satisfaction: '4.7' }
      };
    } else if (selectedCategory === 'design') {
      return {
        today: { sales: 'R$ 18.500', growth: '+28%', orders: 12, avgTicket: 'R$ 1.541,67' },
        week: { sales: 'R$ 98.200', growth: '+22%', orders: 64, avgTicket: 'R$ 1.534,38' },
        month: { sales: 'R$ 387.600', growth: '+31%', orders: 254, avgTicket: 'R$ 1.525,98' },
        customers: { total: 89, new: 8, retention: '92%', satisfaction: '4.9' }
      };
    } else if (selectedCategory === 'sites') {
      return {
        today: { sales: 'R$ 25.800', growth: '+35%', orders: 6, avgTicket: 'R$ 4.300,00' },
        week: { sales: 'R$ 142.400', growth: '+28%', orders: 32, avgTicket: 'R$ 4.450,00' },
        month: { sales: 'R$ 589.200', growth: '+42%', orders: 134, avgTicket: 'R$ 4.397,01' },
        customers: { total: 47, new: 5, retention: '95%', satisfaction: '4.8' }
      };
    } else if (selectedCategory === 'farmacia') {
      return {
        today: { sales: 'R$ 3.240', growth: '+22%', orders: 68, avgTicket: 'R$ 47,65' },
        week: { sales: 'R$ 19.800', growth: '+18%', orders: 412, avgTicket: 'R$ 48,06' },
        month: { sales: 'R$ 84.300', growth: '+24%', orders: 1756, avgTicket: 'R$ 48,01' },
        customers: { total: 1234, new: 58, retention: '85%', satisfaction: '4.8' }
      };
    } else {
      return {
        today: { sales: 'R$ 2.180', growth: '+14%', orders: 36, avgTicket: 'R$ 60,56' },
        week: { sales: 'R$ 14.200', growth: '+13%', orders: 234, avgTicket: 'R$ 60,68' },
        month: { sales: 'R$ 58.900', growth: '+19%', orders: 968, avgTicket: 'R$ 60,85' },
        customers: { total: 687, new: 31, retention: '83%', satisfaction: '4.8' }
      };
    }
    return {
      today: { sales: 'R$ 5.250', growth: '+15%', orders: 25, avgTicket: 'R$ 210,00' },
      week: { sales: 'R$ 32.600', growth: '+12%', orders: 156, avgTicket: 'R$ 208,97' },
      month: { sales: 'R$ 128.400', growth: '+18%', orders: 612, avgTicket: 'R$ 209,80' },
      customers: { total: 456, new: 24, retention: '81%', satisfaction: '4.7' }
    };
  };

  const metrics = getMetricsData();

  return (
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Relatórios e Gráficos</h1>
        <p className="section-subtitle">Relatórios de vendas, análises e visualizações detalhadas</p>
      </div>

      {/* Filtros de Data */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Período</h3>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Data inicial:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateFrom || ''}
              onChange={(e) => setDateFrom(e.target.value || undefined)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Data final:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateTo || ''}
              onChange={(e) => setDateTo(e.target.value || undefined)}
            />
          </div>

          <Button 
            onClick={() => {
              setDateFrom(undefined);
              setDateTo(undefined);
            }}
            variant="outline"
            className="bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          >
            Limpar Filtros
          </Button>

          <Button 
            onClick={() => {
              const period = dateFrom && dateTo ? `${dateFrom} até ${dateTo}` : 'período atual';
              alert(`📊 Filtros aplicados!\n\nGráficos atualizados para o período: ${period}`);
            }}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>

      {/* Métricas de Vendas */}
      <div className="metrics-grid">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Vendas Hoje</p>
              <p className="metric-card-value">{metrics.today.sales}</p>
              <p className="metric-card-description text-green-600">{metrics.today.growth} vs ontem</p>
            </div>
            <div className="metric-card-icon bg-green-100">
              <Calendar className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Vendas Esta Semana</p>
              <p className="metric-card-value">{metrics.week.sales}</p>
              <p className="metric-card-description text-blue-600">{metrics.week.growth} vs sem. anterior</p>
            </div>
            <div className="metric-card-icon bg-blue-100">
              <BarChart3 className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Vendas Este Mês</p>
              <p className="metric-card-value">{metrics.month.sales}</p>
              <p className="metric-card-description text-purple-600">{metrics.month.growth} vs mês anterior</p>
            </div>
            <div className="metric-card-icon bg-purple-100">
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Ticket Médio</p>
              <p className="metric-card-value">{metrics.month.avgTicket}</p>
              <p className="metric-card-description text-orange-600">Média mensal</p>
            </div>
            <div className="metric-card-icon bg-orange-100">
              <PieChart className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Métricas de Performance */}
      <div className="metrics-grid">
        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Total Clientes</p>
              <p className="metric-card-value">{metrics.customers.total}</p>
              <p className="metric-card-description text-blue-600">+{metrics.customers.new} novos</p>
            </div>
            <div className="metric-card-icon bg-cyan-100">
              <Users className="h-4 w-4 md:h-6 md:w-6 text-cyan-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Taxa Retenção</p>
              <p className="metric-card-value">{metrics.customers.retention}</p>
              <p className="metric-card-description text-green-600">Últimos 90 dias</p>
            </div>
            <div className="metric-card-icon bg-emerald-100">
              <Target className="h-4 w-4 md:h-6 md:w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Meta Mensal</p>
              <p className="metric-card-value">
                {selectedCategory === 'alimenticio' ? '85%' : selectedCategory === 'vendas' ? '92%' : selectedCategory === 'pet' ? '78%' : '88%'}
              </p>
              <p className="metric-card-description text-green-600">Do objetivo alcançado</p>
            </div>
            <div className="metric-card-icon bg-purple-100">
              <Activity className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card-standard">
          <div className="flex items-center justify-between">
            <div className="metric-card-content">
              <p className="metric-card-label">Conversão</p>
              <p className="metric-card-value">
                {selectedCategory === 'alimenticio' ? '24%' : selectedCategory === 'vendas' ? '18%' : selectedCategory === 'pet' ? '31%' : '26%'}
              </p>
              <p className="metric-card-description text-orange-600">Taxa de conversão</p>
            </div>
            <div className="metric-card-icon bg-orange-100">
              <Zap className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Relatórios */}
      <Card className="main-card">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Download className="h-5 w-5 text-purple-600" />
            Relatórios de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-primary justify-start">
              <Download className="h-4 w-4 mr-2" />
              Relatório Diário
            </Button>
            <Button className="btn-secondary justify-start">
              <Download className="h-4 w-4 mr-2" />
              Relatório Semanal
            </Button>
            <Button className="btn-outline justify-start">
              <Download className="h-4 w-4 mr-2" />
              Relatório Mensal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Detalhados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Vendas por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DatabaseChart type="bar" title="Vendas Mensais" />
          </CardContent>
        </Card>

        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DatabaseChart type="pie" title="Top Produtos" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Tendência de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DatabaseChart type="line" title="Crescimento Mensal" />
          </CardContent>
        </Card>

        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-600" />
              Análise de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DatabaseChart type="area" title="Aquisição de Clientes" />
          </CardContent>
        </Card>
      </div>

      {/* Top Produtos */}
      <Card className="main-card">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Top 10 Produtos por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: selectedCategory === 'alimenticio' ? 'Pizza Margherita' : selectedCategory === 'pet' ? 'Ração Premium Golden' : selectedCategory === 'medico' ? 'Dipirona 500mg' : 'Produto Top 1', sales: 847, revenue: 'R$ 12.450', growth: '+25%' },
              { name: selectedCategory === 'alimenticio' ? 'Hambúrguer Bacon' : selectedCategory === 'pet' ? 'Vacina V10' : selectedCategory === 'medico' ? 'Soro Fisiológico' : 'Produto Top 2', sales: 723, revenue: 'R$ 9.820', growth: '+18%' },
              { name: selectedCategory === 'alimenticio' ? 'Refrigerante 2L' : selectedCategory === 'pet' ? 'Shampoo Cães' : selectedCategory === 'medico' ? 'Termômetro Digital' : 'Produto Top 3', sales: 612, revenue: 'R$ 7.650', growth: '+12%' },
              { name: selectedCategory === 'alimenticio' ? 'Batata Frita' : selectedCategory === 'pet' ? 'Brinquedo Kong' : selectedCategory === 'medico' ? 'Máscara Cirúrgica' : 'Produto Top 4', sales: 589, revenue: 'R$ 6.890', growth: '+8%' },
              { name: selectedCategory === 'alimenticio' ? 'Pizza Calabresa' : selectedCategory === 'pet' ? 'Coleira Antipulgas' : selectedCategory === 'medico' ? 'Antibiótico' : 'Produto Top 5', sales: 456, revenue: 'R$ 5.670', growth: '+15%' }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} vendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue}</p>
                  <p className="text-sm text-green-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botões de Exportação */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Exportar Dados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => {
              const csvContent = `"Métrica","Valor"\n"Vendas Hoje","${metrics.today.sales}"\n"Crescimento","${metrics.today.growth}"\n"Pedidos","${metrics.today.orders}"\n"Ticket Médio","${metrics.today.avgTicket}"`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `metricas_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
              alert('📊 Métricas exportadas!\n\nArquivo CSV baixado com os dados atuais.');
            }}
            className="btn btn-primary"
          >
            <Download className="w-4 h-4" />
            Exportar Métricas
          </Button>
          
          <Button 
            onClick={() => {
              const csvContent = `"Produto","Vendas","Receita","Crescimento"\n"Produto 1","847","R$ 12.450","+25%"\n"Produto 2","723","R$ 9.820","+18%"\n"Produto 3","612","R$ 7.650","+12%"`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `top_produtos_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
              alert('🏆 Top produtos exportados!\n\nArquivo CSV baixado com ranking de produtos.');
            }}
            className="btn btn-secondary"
          >
            <Star className="w-4 h-4" />
            Exportar Top Produtos
          </Button>
          
          <Button 
            onClick={() => {
              const csvContent = `"Período","Vendas Semanais","Vendas Mensais","Crescimento"\n"Atual","${metrics.week.sales}","${metrics.month.sales}","${metrics.month.growth}"`;
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `relatorio_completo_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
              alert('📋 Relatório completo exportado!\n\nArquivo CSV baixado com análise detalhada.');
            }}
            className="btn btn-outline"
          >
            <BarChart3 className="w-4 h-4" />
            Relatório Completo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GraficosSection;