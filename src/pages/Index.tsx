
import React, { useState } from 'react';
import { Database, Users, TrendingUp, Server, Activity, AlertTriangle, Cpu, HardDrive, Zap } from 'lucide-react';
import Logo from '@/components/Logo';
import MetricCard from '@/components/MetricCard';
import DatabaseChart from '@/components/DatabaseChart';
import CompanySelector from '@/components/CompanySelector';
import SearchAndFilters from '@/components/SearchAndFilters';

const Index = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dados expandidos para métricas baseados na empresa selecionada
  const getMetricsForCompany = (companyId: string) => {
    const metrics = {
      all: {
        totalRecords: '2.4M',
        activeUsers: '18.2K',
        transactionsPerMin: '1,247',
        onlineServers: '28/30',
        performance: '98.7%',
        activeAlerts: '3',
        backupStatus: '100%',
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
        backupStatus: '100%',
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
        backupStatus: '100%',
        totalRevenue: '38K',
        avgResponseTime: '156ms'
      }
    };
    return metrics[companyId as keyof typeof metrics] || metrics.all;
  };

  const currentMetrics = getMetricsForCompany(selectedCompany);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--dashboard-darker))] to-[hsl(var(--dashboard-dark))] text-black">
      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <Logo size="large" />
            <h1 className="text-4xl font-bold mt-8 mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard de Controle de Dados
            </h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              title="Backup Status"
              value={currentMetrics.backupStatus}
              change="Último: 2h atrás"
              changeType="positive"
              icon={Database}
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

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DatabaseChart
              type="bar"
              title="Usuários e Transações por Empresa"
              selectedCompany={selectedCompany}
            />
            <DatabaseChart
              type="line"
              title="Receita e Crescimento Mensal"
              selectedCompany={selectedCompany}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DatabaseChart
              type="pie"
              title="Status dos Servidores"
            />
            <DatabaseChart
              type="area"
              title="Satisfação do Cliente"
              selectedCompany={selectedCompany}
            />
            <DatabaseChart
              type="performance"
              title="Performance e Recursos"
            />
          </div>

          {/* Expanded Activity Log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Atividade Recente</h3>
              <div className="space-y-4">
                {[
                  { action: 'Backup completo realizado', company: 'Empresa A', time: '2 min atrás', status: 'success', details: 'Todos os dados salvos com sucesso' },
                  { action: 'Novo usuário registrado', company: 'Empresa C', time: '5 min atrás', status: 'info', details: 'Usuário premium adicionado' },
                  { action: 'Alerta de performance', company: 'Empresa B', time: '12 min atrás', status: 'warning', details: 'CPU acima de 80%' },
                  { action: 'Manutenção programada', company: 'Empresa D', time: '1h atrás', status: 'neutral', details: 'Servidor 3 em manutenção' },
                  { action: 'Transação de alto valor', company: 'Empresa F', time: '2h atrás', status: 'success', details: 'R$ 15.000 processados' },
                  { action: 'Falha de conexão', company: 'Empresa G', time: '3h atrás', status: 'warning', details: 'Conexão restaurada' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-background/20 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-black">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.company}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">{activity.time}</p>
                      <div className={`w-2 h-2 rounded-full mt-1 ml-auto ${
                        activity.status === 'success' ? 'bg-accent' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        activity.status === 'info' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health Monitor */}
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Monitor de Sistema</h3>
              <div className="space-y-4">
                {[
                  { metric: 'CPU', value: '45%', status: 'good', icon: Cpu },
                  { metric: 'Memória', value: '72%', status: 'warning', icon: HardDrive },
                  { metric: 'Disco', value: '38%', status: 'good', icon: Database },
                  { metric: 'Rede', value: '156 Mbps', status: 'good', icon: Activity },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-5 w-5 ${
                        item.status === 'good' ? 'text-accent' :
                        item.status === 'warning' ? 'text-yellow-500' : 'text-destructive'
                      }`} />
                      <span className="font-medium text-black">{item.metric}</span>
                    </div>
                    <span className={`font-bold ${
                      item.status === 'good' ? 'text-accent' :
                      item.status === 'warning' ? 'text-yellow-500' : 'text-destructive'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
