
import React, { useState } from 'react';
import { Database, Users, TrendingUp, Server, Activity, AlertTriangle } from 'lucide-react';
import Logo from '@/components/Logo';
import MetricCard from '@/components/MetricCard';
import DatabaseChart from '@/components/DatabaseChart';
import CompanySelector from '@/components/CompanySelector';

const Index = () => {
  const [selectedCompany, setSelectedCompany] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--dashboard-darker))] to-[hsl(var(--dashboard-dark))] text-white">
      {/* Header */}
      <header className="p-6 border-b border-border/20 backdrop-blur-sm bg-card/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="small" />
          <div className="flex items-center space-x-6">
            <CompanySelector value={selectedCompany} onValueChange={setSelectedCompany} />
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Última atualização</p>
              <p className="text-sm font-medium">Agora há pouco</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center py-12">
            <Logo size="large" />
            <h1 className="text-4xl font-bold mt-8 mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard de Controle de Dados
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitore e gerencie bancos de dados de múltiplas empresas com precisão e clareza
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total de Registros"
              value="2.4M"
              change="+12% este mês"
              changeType="positive"
              icon={Database}
              gradient={true}
            />
            <MetricCard
              title="Usuários Ativos"
              value="18.2K"
              change="+8% esta semana"
              changeType="positive"
              icon={Users}
            />
            <MetricCard
              title="Transações/Min"
              value="1,247"
              change="+23% hoje"
              changeType="positive"
              icon={TrendingUp}
            />
            <MetricCard
              title="Servidores Online"
              value="28/30"
              change="2 em manutenção"
              changeType="neutral"
              icon={Server}
            />
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Performance Geral"
              value="98.7%"
              change="Excelente"
              changeType="positive"
              icon={Activity}
            />
            <MetricCard
              title="Alertas Ativos"
              value="3"
              change="Atenção necessária"
              changeType="negative"
              icon={AlertTriangle}
            />
            <MetricCard
              title="Backup Status"
              value="100%"
              change="Último: 2h atrás"
              changeType="positive"
              icon={Database}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DatabaseChart
              type="bar"
              title="Usuários e Transações por Empresa"
            />
            <DatabaseChart
              type="line"
              title="Receita Mensal por Empresa"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DatabaseChart
              type="pie"
              title="Status dos Servidores"
            />
            <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                {[
                  { action: 'Backup completo realizado', company: 'Empresa A', time: '2 min atrás', status: 'success' },
                  { action: 'Novo usuário registrado', company: 'Empresa C', time: '5 min atrás', status: 'info' },
                  { action: 'Alerta de performance', company: 'Empresa B', time: '12 min atrás', status: 'warning' },
                  { action: 'Manutenção programada', company: 'Empresa D', time: '1h atrás', status: 'neutral' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
