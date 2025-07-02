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
    <div className="app-section">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Visão geral das métricas do sistema</p>
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
        <div className="metric-card gradient-brand text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">{currentMetrics.mainMetric}</p>
              <p className="text-2xl font-bold mt-1 text-white">{currentMetrics.totalRecords}</p>
              <p className="text-xs mt-1 text-white/70">+12% este mês</p>
            </div>
            <div className="p-3 rounded-full bg-white/20">
              <Database className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Equipe Ativa</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.activeUsers}</p>
              <p className="text-xs mt-1 text-green-600">+8% esta semana</p>
            </div>
            <ModernIcon 
              icon={Users}
              size="lg"
              background={true}
              contextual={true}
              animated={true}
              glow={true}
            />
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{currentMetrics.secondaryMetric}</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.transactions}</p>
              <p className="text-xs mt-1 text-green-600">+23% hoje</p>
            </div>
            <ModernIcon 
              icon={TrendingUp}
              size="lg"
              background={true}
              contextual={true}
              animated={true}
              glow={true}
            />
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.appointments}</p>
              <p className="text-xs mt-1 text-blue-600">Próximos</p>
            </div>
            <ModernIcon 
              icon={Calendar}
              size="lg"
              background={true}
              contextual={true}
              animated={true}
              glow={true}
            />
          </div>
        </div>
      </div>

      {/* Cards com informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <ModernIcon 
                icon={Calendar}
                size="md"
                background={true}
                contextual={true}
                animated={true}
                glow={true}
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
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <ModernIcon 
                        icon={Clock}
                        size="sm"
                        background={true}
                        contextual={true}
                        animated={true}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{apt.title}</p>
                        <p className="text-sm text-gray-600">{apt.time}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-500 text-white">{apt.status}</Badge>
                  </div>
                ));
              })()}
            </div>
            
            <Button className="btn-primary w-full mt-4">
              Ver Todos os Compromissos
            </Button>
          </CardContent>
        </Card>

        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <ModernIcon 
                icon={Bell}
                size="md"
                background={true}
                contextual={true}
                animated={true}
                glow={true}
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
                    { icon: AlertTriangle, title: 'Stock Baixo', desc: '5 produtos abaixo do mínimo', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Pagamento Pendente', desc: 'Fatura vence hoje', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Nova Venda', desc: 'MacBook vendido há 15 minutos', color: 'green', badge: 'Novo' }
                  ],
                  'design': [
                    { icon: AlertTriangle, title: 'Projeto Atrasado', desc: 'Logo entrega hoje', color: 'red', badge: 'Urgente' },
                    { icon: Clock, title: 'Aprovação Pendente', desc: 'Cliente precisa aprovar arte', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Novo Projeto', desc: 'Briefing recebido há 30 minutos', color: 'green', badge: 'Novo' }
                  ],
                  'sites': [
                    { icon: AlertTriangle, title: 'Site Fora do Ar', desc: 'Domínio cliente.com', color: 'red', badge: 'Crítico' },
                    { icon: Clock, title: 'Backup Pendente', desc: 'Backup automático atrasado', color: 'orange', badge: 'Atenção' },
                    { icon: TrendingUp, title: 'Novo Lead', desc: 'Orçamento solicitado há 20 minutos', color: 'green', badge: 'Novo' }
                  ]
                };
                
                const notifications = categoryNotifications[selectedCategory as keyof typeof categoryNotifications] || categoryNotifications.pet;
                
                return notifications.map((notif, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <ModernIcon 
                      icon={notif.icon}
                      size="sm"
                      background={true}
                      contextual={true}
                      animated={true}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{notif.title}</p>
                        <Badge className={`${
                          notif.color === 'red' ? 'bg-red-500' :
                          notif.color === 'orange' ? 'bg-orange-500' :
                          'bg-green-500'
                        } text-white`}>
                          {notif.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notif.desc}</p>
                    </div>
                  </div>
                ));
              })()}
            </div>
            
            <Button className="btn-secondary w-full mt-4">
              Ver Todas as Notificações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;