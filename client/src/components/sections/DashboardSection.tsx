import { useState } from 'react';
import { Database, Users, TrendingUp, Server, Activity, AlertTriangle, Zap } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import SearchAndFilters from '@/components/SearchAndFilters';

const DashboardSection = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dados de métricas baseados na empresa selecionada
  const getMetricsForCompany = (companyId: string) => {
    const metrics = {
      all: {
        totalRecords: '2.4M',
        activeUsers: '18.2K',
        transactionsPerMin: '1,247',
        onlineServers: '28/30',
        performance: '98.7%',
        activeAlerts: '3',
        totalRevenue: '263.5K',
        avgResponseTime: '127ms'
      },
      'empresa-a': {
        totalRecords: '540K',
        activeUsers: '1.24K',
        transactionsPerMin: '89',
        onlineServers: '4/4',
        performance: '98.7%',
        activeAlerts: '0',
        totalRevenue: '45K',
        avgResponseTime: '98ms'
      },
      'empresa-b': {
        totalRecords: '380K',
        activeUsers: '980',
        transactionsPerMin: '120',
        onlineServers: '3/4',
        performance: '94.2%',
        activeAlerts: '1',
        totalRevenue: '38K',
        avgResponseTime: '156ms'
      }
    };
    return metrics[companyId as keyof typeof metrics] || metrics.all;
  };

  const currentMetrics = getMetricsForCompany(selectedCompany);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Visão geral das métricas do sistema</p>
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
          title="Total de Registros"
          value={currentMetrics.totalRecords}
          change="+12% este mês"
          changeType="positive"
          icon={Database}
          gradient={true}
        />
        <MetricCard
          title="Usuários Ativos"
          value={currentMetrics.activeUsers}
          change="+8% esta semana"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Transações/Min"
          value={currentMetrics.transactionsPerMin}
          change="+23% hoje"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Servidores Online"
          value={currentMetrics.onlineServers}
          change="2 em manutenção"
          changeType="neutral"
          icon={Server}
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
          title="Alertas Ativos"
          value={currentMetrics.activeAlerts}
          change="Atenção necessária"
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

      {/* Recent Activity Summary */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-black">Resumo de Atividades</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">127</div>
            <div className="text-sm text-green-700">Operações concluídas</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-blue-700">Tarefas em andamento</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-orange-700">Pendências</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;