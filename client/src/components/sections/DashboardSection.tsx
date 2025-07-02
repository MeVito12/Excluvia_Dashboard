import { useState } from 'react';
import { Database, Users, TrendingUp, Calendar, Clock, Bell, AlertTriangle } from 'lucide-react';
import SearchAndFilters from '@/components/SearchAndFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCategory } from '@/contexts/CategoryContext';

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
        appointments: '5 Agendamentos Hoje'
      },
      'saude': {
        totalRecords: '24 Pacientes',
        activeUsers: '6 Médicos',
        transactions: '18 Consultas',
        appointments: '4 Agendamentos Hoje'
      },
      'alimenticio': {
        totalRecords: '45 Pratos',
        activeUsers: '12 Funcionários',
        transactions: '89 Pedidos',
        appointments: '3 Reservas Hoje'
      },
      'vendas': {
        totalRecords: '128 Produtos',
        activeUsers: '15 Vendedores',
        transactions: '47 Vendas',
        appointments: '8 Reuniões Hoje'
      },
      'design': {
        totalRecords: '32 Projetos',
        activeUsers: '5 Designers',
        transactions: '14 Entregas',
        appointments: '6 Briefings Hoje'
      },
      'sites': {
        totalRecords: '18 Sites',
        activeUsers: '4 Desenvolvedores',
        transactions: '9 Deploys',
        appointments: '3 Reuniões Hoje'
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
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.totalRecords}</p>
              <p className="text-xs mt-1 text-green-600">+12% este mês</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <Database className="h-6 w-6 text-gray-600" />
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
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transações</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.transactions}</p>
              <p className="text-xs mt-1 text-green-600">+23% hoje</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.appointments}</p>
              <p className="text-xs mt-1 text-blue-600">Próximos</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards com informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="main-card">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Próximos Compromissos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const categoryAppointments = {
                  'pet': [
                    { title: 'Consulta Veterinária - Rex', time: 'Hoje às 15:00', status: 'Em 2h' },
                    { title: 'Vacinação V10 - Thor', time: 'Amanhã às 09:30', status: 'Amanhã' },
                    { title: 'Emergência - Luna', time: '05/07 às 20:00', status: 'Agendado' }
                  ],
                  'saude': [
                    { title: 'Consulta Cardiologia', time: 'Hoje às 15:00', status: 'Em 2h' },
                    { title: 'Fisioterapia - Reabilitação', time: '07/07 às 14:00', status: 'Próxima semana' },
                    { title: 'Consulta Oftalmológica', time: '08/07 às 10:30', status: 'Agendado' }
                  ],
                  'alimenticio': [
                    { title: 'Reserva Mesa VIP', time: 'Hoje às 20:00', status: 'Em 7h' },
                    { title: 'Evento Corporativo', time: '05/07 às 19:00', status: 'Esta semana' },
                    { title: 'Degustação de Vinhos', time: '07/07 às 18:30', status: 'Agendado' }
                  ],
                  'vendas': [
                    { title: 'Reunião MacBook Air M3', time: 'Hoje às 14:00', status: 'Em 1h' },
                    { title: 'Demo Samsung Galaxy S24', time: 'Hoje às 09:00', status: 'Concluído' },
                    { title: 'Entrega iPads - Escola', time: '04/07 às 14:00', status: 'Amanhã' }
                  ],
                  'design': [
                    { title: 'Briefing Logo Startup', time: 'Hoje às 10:00', status: 'Concluído' },
                    { title: 'Apresentação Branding', time: '05/07 às 15:00', status: 'Esta semana' },
                    { title: 'Revisão Material Gráfico', time: '06/07 às 14:00', status: 'Agendado' }
                  ],
                  'sites': [
                    { title: 'Kickoff E-commerce', time: 'Hoje às 09:00', status: 'Concluído' },
                    { title: 'Entrega Landing Page', time: '06/07 às 14:00', status: 'Esta semana' },
                    { title: 'Reunião Sistema Interno', time: '08/07 às 10:00', status: 'Agendado' }
                  ]
                };
                
                const appointments = categoryAppointments[selectedCategory as keyof typeof categoryAppointments] || categoryAppointments.pet;
                
                return appointments.map((apt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-600" />
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
              <Bell className="h-5 w-5 text-orange-600" />
              Notificações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const categoryNotifications = {
                  'pet': [
                    { icon: AlertTriangle, title: 'Vacinas Pendentes', desc: '2 animais precisam de vacinação', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Consulta Atrasada', desc: 'Reagendar consulta do Rex', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Consulta', desc: 'Agendamento feito há 10 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'saude': [
                    { icon: AlertTriangle, title: 'Exames Atrasados', desc: '1 exame precisa ser realizado', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Medicamentos', desc: 'Verificar receitas vencidas', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Consulta', desc: 'Paciente agendado para amanhã', badge: 'Novo', color: 'green' }
                  ],
                  'alimenticio': [
                    { icon: AlertTriangle, title: 'Ingredientes Acabando', desc: '3 ingredientes abaixo do mínimo', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Produtos Vencendo', desc: '2 produtos vencem hoje', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Novo Pedido', desc: 'Pedido #245 há 5 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'vendas': [
                    { icon: AlertTriangle, title: 'Stock Baixo', desc: '5 produtos abaixo do mínimo', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Pagamento Pendente', desc: 'Fatura vence hoje', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Venda', desc: 'MacBook vendido há 15 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'design': [
                    { icon: AlertTriangle, title: 'Projeto Atrasado', desc: 'Logo entrega hoje', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Aprovação Pendente', desc: 'Cliente precisa aprovar arte', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Novo Projeto', desc: 'Briefing recebido há 30 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'sites': [
                    { icon: AlertTriangle, title: 'Site Fora do Ar', desc: 'Domínio cliente.com', badge: 'Crítico', color: 'red' },
                    { icon: Clock, title: 'Backup Pendente', desc: 'Backup automático atrasado', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Novo Lead', desc: 'Orçamento solicitado há 20 minutos', badge: 'Novo', color: 'green' }
                  ]
                };
                
                const notifications = categoryNotifications[selectedCategory as keyof typeof categoryNotifications] || categoryNotifications.pet;
                
                return notifications.map((notif, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <notif.icon className="h-4 w-4 text-gray-600 mt-0.5" />
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