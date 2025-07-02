import { useState } from 'react';
import { Database, Users, TrendingUp, Server, Activity, AlertTriangle, Zap, Calendar, Clock, Bell } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import SearchAndFilters from '@/components/SearchAndFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/contexts/CategoryContext';
import ModernIcon from '@/components/ui/modern-icon';

const DashboardSection = () => {
  const { selectedCategory } = useCategory();
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dados de métricas específicos por categoria
  const getCategoryMetrics = () => {
    const categoryData = {
      'pet': {
        totalRecords: '15 Animais',
        activeUsers: '8 Veterinários',
        transactions: '12 Consultas',
        appointments: '5 Agendamentos Hoje',
        performance: '97.3%',
        activeAlerts: '2 Vacinas Pendentes',
        totalRevenue: 'R$ 1.850,00',
        avgResponseTime: '15min',
        mainMetric: 'Atendimentos',
        secondaryMetric: 'Emergências',
        alertType: 'Vacinas'
      },
      'saude': {
        totalRecords: '24 Pacientes',
        activeUsers: '6 Médicos',
        transactions: '18 Consultas',
        appointments: '4 Agendamentos Hoje',
        performance: '98.1%',
        activeAlerts: '1 Exame Atrasado',
        totalRevenue: 'R$ 2.340,00',
        avgResponseTime: '22min',
        mainMetric: 'Consultas',
        secondaryMetric: 'Exames',
        alertType: 'Exames'
      },
      'alimenticio': {
        totalRecords: '45 Pratos',
        activeUsers: '12 Funcionários',
        transactions: '89 Pedidos',
        appointments: '4 Reservas Hoje',
        performance: '94.8%',
        activeAlerts: '3 Ingredientes Acabando',
        totalRevenue: 'R$ 3.420,50',
        avgResponseTime: '25min',
        mainMetric: 'Pedidos',
        secondaryMetric: 'Reservas',
        alertType: 'Estoque'
      },
      'vendas': {
        totalRecords: '21 Produtos',
        activeUsers: '5 Vendedores',
        transactions: '19 Vendas',
        appointments: '5 Reuniões Hoje',
        performance: '96.7%',
        activeAlerts: '2 Produtos em Falta',
        totalRevenue: 'R$ 18.450,00',
        avgResponseTime: '8min',
        mainMetric: 'Vendas',
        secondaryMetric: 'Reuniões',
        alertType: 'Estoque'
      },
      'design': {
        totalRecords: '8 Projetos',
        activeUsers: '4 Designers',
        transactions: '12 Entregas',
        appointments: '3 Briefings Hoje',
        performance: '99.2%',
        activeAlerts: '1 Prazo Apertado',
        totalRevenue: 'R$ 4.200,00',
        avgResponseTime: '2h',
        mainMetric: 'Projetos',
        secondaryMetric: 'Briefings',
        alertType: 'Prazos'
      },
      'sites': {
        totalRecords: '6 Sites',
        activeUsers: '3 Desenvolvedores',
        transactions: '9 Entregas',
        appointments: '3 Reuniões Hoje',
        performance: '98.5%',
        activeAlerts: '1 Deploy Pendente',
        totalRevenue: 'R$ 7.800,00',
        avgResponseTime: '24h',
        mainMetric: 'Desenvolvimentos',
        secondaryMetric: 'Reuniões',
        alertType: 'Deploys'
      }
    };

    return categoryData[selectedCategory as keyof typeof categoryData] || categoryData.pet;
  };

  const currentMetrics = getCategoryMetrics();

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
          title={currentMetrics.mainMetric}
          value={currentMetrics.totalRecords}
          change="+12% este mês"
          changeType="positive"
          icon={Database}
          gradient={true}
        />
        <MetricCard
          title="Equipe Ativa"
          value={currentMetrics.activeUsers}
          change="+8% esta semana"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title={currentMetrics.secondaryMetric}
          value={currentMetrics.transactions}
          change="+23% hoje"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Agendamentos Hoje"
          value={currentMetrics.appointments}
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
          title={currentMetrics.alertType}
          value={currentMetrics.activeAlerts}
          change="Requer atenção"
          changeType={currentMetrics.activeAlerts.includes('0') ? 'positive' : 'negative'}
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
          title="Tempo Médio"
          value={currentMetrics.avgResponseTime}
          change="Otimizado"
          changeType="positive"
          icon={Zap}
        />
      </div>

      {/* Lembretes de Agenda e Compromissos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-border/50 modern-card-hover modern-glow">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <ModernIcon 
                icon={Calendar}
                variant="primary"
                size="md"
                animated={true}
              />
              Próximos Compromissos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const categoryAppointments = {
                  'pet': [
                    { title: 'Consulta Veterinária - Rex', time: 'Hoje às 15:00', status: 'Em 2h', color: 'blue' },
                    { title: 'Vacinação V10 - Thor', time: 'Amanhã às 09:30', status: 'Amanhã', color: 'orange' },
                    { title: 'Emergência - Luna', time: '05/07 às 20:00', status: 'Agendado', color: 'green' }
                  ],
                  'saude': [
                    { title: 'Consulta Cardiologia', time: 'Hoje às 15:00', status: 'Em 2h', color: 'blue' },
                    { title: 'Fisioterapia - Reabilitação', time: '07/07 às 14:00', status: 'Próxima semana', color: 'orange' },
                    { title: 'Consulta Oftalmológica', time: '08/07 às 10:30', status: 'Agendado', color: 'green' }
                  ],
                  'alimenticio': [
                    { title: 'Reserva Mesa VIP', time: 'Hoje às 20:00', status: 'Em 7h', color: 'blue' },
                    { title: 'Evento Corporativo', time: '05/07 às 19:00', status: 'Esta semana', color: 'orange' },
                    { title: 'Degustação de Vinhos', time: '07/07 às 18:30', status: 'Agendado', color: 'green' }
                  ],
                  'vendas': [
                    { title: 'Reunião MacBook Air M3', time: 'Hoje às 14:00', status: 'Em 1h', color: 'blue' },
                    { title: 'Demo Samsung Galaxy S24', time: 'Hoje às 09:00', status: 'Concluído', color: 'green' },
                    { title: 'Entrega iPads - Escola', time: '04/07 às 14:00', status: 'Amanhã', color: 'orange' }
                  ],
                  'design': [
                    { title: 'Briefing Logo Startup', time: 'Hoje às 10:00', status: 'Concluído', color: 'green' },
                    { title: 'Apresentação Branding', time: '05/07 às 15:00', status: 'Esta semana', color: 'orange' },
                    { title: 'Revisão Material Gráfico', time: '06/07 às 14:00', status: 'Agendado', color: 'blue' }
                  ],
                  'sites': [
                    { title: 'Kickoff E-commerce', time: 'Hoje às 09:00', status: 'Concluído', color: 'green' },
                    { title: 'Entrega Landing Page', time: '06/07 às 14:00', status: 'Esta semana', color: 'orange' },
                    { title: 'Reunião Sistema Interno', time: '08/07 às 10:00', status: 'Agendado', color: 'blue' }
                  ]
                };
                
                const appointments = categoryAppointments[selectedCategory as keyof typeof categoryAppointments] || categoryAppointments.pet;
                
                return appointments.map((apt, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 bg-${apt.color}-50 rounded-lg`}>
                    <div className="flex items-center gap-3">
                      <Clock className={`h-4 w-4 text-${apt.color}-600`} />
                      <div>
                        <p className="font-medium text-gray-900">{apt.title}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                    <Badge className={`bg-${apt.color}-500 text-white`}>{apt.status}</Badge>
                  </div>
                ));
              })()}
            </div>
            
            <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
              Ver Todos os Compromissos
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border/50 modern-card-hover modern-glow modern-glass">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <ModernIcon 
                icon={Bell}
                variant="accent"
                size="md"
                animated={true}
              />
              Notificações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const categoryNotifications = {
                  'pet': [
                    { icon: AlertTriangle, title: 'Vacinas Pendentes', desc: '2 animais precisam de vacinação', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Consulta Atrasada', desc: 'Reagendar consulta do Rex', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Nova Consulta', desc: 'Agendamento feito há 10 minutos', color: 'green', badge: 'Novo' }
                  ],
                  'saude': [
                    { icon: AlertTriangle, title: 'Exames Atrasados', desc: '1 exame precisa ser realizado', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Medicamentos', desc: 'Verificar receitas vencidas', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Nova Consulta', desc: 'Paciente agendado para amanhã', color: 'green', badge: 'Novo' }
                  ],
                  'alimenticio': [
                    { icon: AlertTriangle, title: 'Ingredientes Acabando', desc: '3 ingredientes abaixo do mínimo', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Produtos Vencendo', desc: '2 produtos vencem hoje', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Novo Pedido', desc: 'Pedido #245 há 5 minutos', color: 'green', badge: 'Novo' }
                  ],
                  'vendas': [
                    { icon: AlertTriangle, title: 'Estoque Baixo', desc: '2 produtos em falta', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Follow-up Pendente', desc: 'Contatar cliente PlayStation 5', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Nova Venda', desc: 'MacBook vendido há 30 minutos', color: 'green', badge: 'Novo' }
                  ],
                  'design': [
                    { icon: AlertTriangle, title: 'Prazo Apertado', desc: '1 projeto entrega amanhã', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Aprovação Pendente', desc: 'Cliente precisa aprovar logo', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Novo Projeto', desc: 'Briefing recebido há 1 hora', color: 'green', badge: 'Novo' }
                  ],
                  'sites': [
                    { icon: AlertTriangle, title: 'Deploy Pendente', desc: '1 site aguardando deploy', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Teste em Andamento', desc: 'E-commerce sendo testado', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Novo Projeto', desc: 'Sistema interno contratado', color: 'green', badge: 'Novo' }
                  ]
                };
                
                const notifications = categoryNotifications[selectedCategory as keyof typeof categoryNotifications] || categoryNotifications.pet;
                
                return notifications.map((notif, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 bg-${notif.color}-50 rounded-lg`}>
                    <notif.icon className={`h-4 w-4 text-${notif.color}-600 mt-0.5`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.desc}</p>
                    </div>
                    <Badge className={`bg-${notif.color}-500 text-white`}>{notif.badge}</Badge>
                  </div>
                ));
              })()}
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