import { useState } from 'react';
import { Database, Users, TrendingUp, Server, Activity, AlertTriangle, Zap, Calendar, Clock, Bell } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import SearchAndFilters from '@/components/SearchAndFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DashboardSection = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dados de métricas baseados na empresa/categoria selecionada
  const getMetricsForCompany = (companyId: string) => {
    const metrics = {
      all: {
        totalRecords: '12',
        activeUsers: '9',
        transactionsPerMin: '8 vendas',
        onlineServers: '7 agendamentos',
        performance: '98.7%',
        activeAlerts: '2',
        totalRevenue: 'R$ 12.317',
        avgResponseTime: '127ms'
      },
      'empresa-a': {
        totalRecords: '3',
        activeUsers: '2',
        transactionsPerMin: '2 vendas',
        onlineServers: '2 agendamentos',
        performance: '98.7%',
        activeAlerts: '0',
        totalRevenue: 'R$ 404,80',
        avgResponseTime: '98ms'
      },
      'empresa-b': {
        totalRecords: '3',
        activeUsers: '2',
        transactionsPerMin: '2 vendas',
        onlineServers: '2 agendamentos',
        performance: '94.2%',
        activeAlerts: '1',
        totalRevenue: 'R$ 522,70',
        avgResponseTime: '156ms'
      },
      'empresa-c': {
        totalRecords: '2',
        activeUsers: '2',
        transactionsPerMin: '2 vendas',
        onlineServers: '1 agendamento',
        performance: '96.5%',
        activeAlerts: '0',
        totalRevenue: 'R$ 140,00',
        avgResponseTime: '145ms'
      },
      'empresa-d': {
        totalRecords: '2',
        activeUsers: '2',
        transactionsPerMin: '2 vendas',
        onlineServers: '2 agendamentos',
        performance: '99.1%',
        activeAlerts: '1',
        totalRevenue: 'R$ 11.249',
        avgResponseTime: '89ms'
      }
    };
    return metrics[companyId as keyof typeof metrics] || metrics.all;
  };

  const currentMetrics = getMetricsForCompany(selectedCompany);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300">Visão geral das métricas do sistema</p>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCompany={selectedCompany}
        onCompanyChange={setSelectedCompany}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Produtos"
          value={currentMetrics.totalRecords}
          change="+12% este mês"
          changeType="positive"
          icon={Database}
          gradient={true}
        />
        <MetricCard
          title="Clientes Ativos"
          value={currentMetrics.activeUsers}
          change="+8% esta semana"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Vendas Recentes"
          value={currentMetrics.transactionsPerMin}
          change="+23% hoje"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Agendamentos"
          value={currentMetrics.onlineServers}
          change="2 pendentes"
          changeType="neutral"
          icon={Calendar}
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Performance Geral"
          value={currentMetrics.performance}
          change="Excelente"
          changeType="positive"
          icon={Activity}
        />
        <MetricCard
          title="Estoque Baixo"
          value={currentMetrics.activeAlerts}
          change="Produtos precisam reposição"
          changeType={currentMetrics.activeAlerts === '0' ? 'positive' : 'negative'}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Receita Total"
          value={currentMetrics.totalRevenue}
          change="+15% no período"
          changeType="positive"
          icon={TrendingUp}
          gradient={true}
        />
        <MetricCard
          title="Tempo de Resposta"
          value={currentMetrics.avgResponseTime}
          change="Otimizado"
          changeType="positive"
          icon={Zap}
        />
      </div>

      {/* Lembretes de Agenda e Compromissos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-border/50">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Compromissos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Reunião com Cliente A</p>
                    <p className="text-sm text-gray-600">Hoje às 15:00</p>
                  </div>
                </div>
                <Badge className="bg-blue-500 text-white">Em 2h</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">Revisão de Estoque</p>
                    <p className="text-sm text-gray-600">Amanhã às 09:00</p>
                  </div>
                </div>
                <Badge className="bg-orange-500 text-white">Amanhã</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Entrega Produto XYZ</p>
                    <p className="text-sm text-gray-600">30/06/2024 às 14:00</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Agendado</Badge>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Ver Todos os Compromissos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Estoque Baixo</p>
                  <p className="text-sm text-gray-600">3 produtos abaixo do estoque mínimo</p>
                </div>
                <Badge className="bg-red-500 text-white">Urgente</Badge>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Produtos Vencendo</p>
                  <p className="text-sm text-gray-600">2 produtos vencem em 30 dias</p>
                </div>
                <Badge className="bg-orange-500 text-white">Atenção</Badge>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Nova Venda</p>
                  <p className="text-sm text-gray-600">Venda registrada há 15 minutos</p>
                </div>
                <Badge className="bg-green-500 text-white">Novo</Badge>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Ver Todas as Notificações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-black">Painel de Desempenho por Categoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-green-700">Produtos Pet Shop</div>
            <div className="text-xs text-green-500 mt-1">R$ 404,80 em vendas</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-blue-700">Produtos Médicos</div>
            <div className="text-xs text-blue-500 mt-1">R$ 522,70 em vendas</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-orange-700">Produtos Alimentícios</div>
            <div className="text-xs text-orange-500 mt-1">R$ 140,00 em vendas</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-purple-700">Produtos Tecnologia</div>
            <div className="text-xs text-purple-500 mt-1">R$ 11.249 em vendas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;