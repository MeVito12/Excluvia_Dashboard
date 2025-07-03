import { useState } from 'react';
import { Database, Users, TrendingUp, Calendar, Clock, Bell, AlertTriangle, ShoppingCart } from 'lucide-react';
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
        totalRecords: '445 Pets',
        activeUsers: '12 Veterinários',
        transactions: '23 Atendimentos',
        appointments: '8 Agendamentos Hoje',
        revenue: 'R$ 1.820',
        growth: '+20%',
        satisfaction: '4.9'
      },
      'medico': {
        totalRecords: '672 Pacientes',
        activeUsers: '18 Profissionais',
        transactions: '34 Consultas',
        appointments: '12 Agendamentos Hoje',
        revenue: 'R$ 3.680',
        growth: '+12%',
        satisfaction: '4.7'
      },
      'alimenticio': {
        totalRecords: '856 Clientes',
        activeUsers: '15 Funcionários',
        transactions: '47 Pedidos',
        appointments: '6 Reservas Hoje',
        revenue: 'R$ 2.450',
        growth: '+18%',
        satisfaction: '4.8'
      },
      'vendas': {
        totalRecords: '324 Clientes',
        activeUsers: '8 Vendedores',
        transactions: '12 Vendas',
        appointments: '5 Reuniões Hoje',
        revenue: 'R$ 8.950',
        growth: '+15%',
        satisfaction: '4.6'
      },
      'tecnologia': {
        totalRecords: '156 Clientes',
        activeUsers: '6 Técnicos',
        transactions: '8 Vendas',
        appointments: '3 Demos Hoje',
        revenue: 'R$ 12.450',
        growth: '+25%',
        satisfaction: '4.5'
      },
      'educacao': {
        totalRecords: '523 Alunos',
        activeUsers: '9 Professores',
        transactions: '28 Matrículas',
        appointments: '4 Aulas Hoje',
        revenue: 'R$ 1.950',
        growth: '+8%',
        satisfaction: '4.6'
      },
      'beleza': {
        totalRecords: '687 Clientes',
        activeUsers: '11 Profissionais',
        transactions: '36 Atendimentos',
        appointments: '9 Agendamentos Hoje',
        revenue: 'R$ 2.180',
        growth: '+14%',
        satisfaction: '4.8'
      }
    };
    
    return categoryData[selectedCategory as keyof typeof categoryData] || categoryData.pet;
  };

  const currentMetrics = getCategoryMetrics();

  // Função para filtrar dados baseada nos filtros selecionados
  const getFilteredMetrics = () => {
    let metrics = { ...currentMetrics };
    
    // Aplicar filtro de data se selecionado
    if (dateFrom || dateTo) {
      const now = new Date();
      const daysDiff = dateFrom ? Math.floor((now.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)) : 0;
      
      // Simular ajuste de métricas baseado no período
      if (daysDiff > 7) {
        metrics = {
          ...metrics,
          transactions: metrics.transactions.replace(/\d+/, (num) => String(Math.floor(parseInt(num) * 0.7))),
          revenue: metrics.revenue.replace(/[\d.]+/, (num) => String(Math.floor(parseFloat(num.replace('.', '')) * 0.8))),
        };
      }
    }
    
    // Aplicar filtro de busca
    if (searchTerm) {
      // Ajustar métricas baseado na busca
      const searchMultiplier = searchTerm.length > 3 ? 0.3 : 0.8;
      metrics = {
        ...metrics,
        totalRecords: metrics.totalRecords.replace(/\d+/, (num) => String(Math.floor(parseInt(num) * searchMultiplier))),
      };
    }
    
    return metrics;
  };

  const filteredMetrics = getFilteredMetrics();

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
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{filteredMetrics.totalRecords}</p>
              <p className="text-xs mt-1 text-green-600">{filteredMetrics.growth} este mês</p>
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
              <p className="text-2xl font-bold mt-1 text-gray-900">{filteredMetrics.activeUsers}</p>
              <p className="text-xs mt-1 text-blue-600">Profissionais ativos</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{filteredMetrics.revenue}</p>
              <p className="text-xs mt-1 text-green-600">{filteredMetrics.growth} vs ontem</p>
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
              <p className="text-xs mt-1 text-purple-600">Próximos</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transações Hoje</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.transactions}</p>
              <p className="text-xs mt-1 text-green-600">Volume do dia</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfação</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">{currentMetrics.satisfaction}</p>
              <p className="text-xs mt-1 text-yellow-600">⭐ Avaliação média</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alertas Ativos</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {selectedCategory === 'alimenticio' ? '4' : selectedCategory === 'pet' ? '3' : selectedCategory === 'medico' ? '6' : '2'}
              </p>
              <p className="text-xs mt-1 text-red-600">Requer atenção</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notificações</p>
              <p className="text-2xl font-bold mt-1 text-gray-900">
                {selectedCategory === 'alimenticio' ? '12' : selectedCategory === 'pet' ? '8' : selectedCategory === 'medico' ? '15' : '7'}
              </p>
              <p className="text-xs mt-1 text-blue-600">Não lidas</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100">
              <Bell className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards com informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    { title: 'Emergência - Luna', time: '05/07 às 20:00', status: 'Agendado' },
                    { title: 'Banho e Tosa - Bella', time: '06/07 às 14:00', status: 'Esta semana' }
                  ],
                  'medico': [
                    { title: 'Consulta Cardiologia', time: 'Hoje às 15:00', status: 'Em 2h' },
                    { title: 'Fisioterapia - Reabilitação', time: 'Hoje às 16:30', status: 'Em 3h' },
                    { title: 'Consulta Oftalmológica', time: 'Amanhã às 10:30', status: 'Amanhã' },
                    { title: 'Cirurgia - Emergência', time: '05/07 às 08:00', status: 'Agendado' }
                  ],
                  'alimenticio': [
                    { title: 'Reserva Mesa VIP', time: 'Hoje às 20:00', status: 'Em 7h' },
                    { title: 'Evento Corporativo', time: 'Amanhã às 19:00', status: 'Amanhã' },
                    { title: 'Degustação de Vinhos', time: '07/07 às 18:30', status: 'Agendado' },
                    { title: 'Festa de Aniversário', time: '08/07 às 15:00', status: 'Esta semana' }
                  ],
                  'vendas': [
                    { title: 'Reunião MacBook Air M3', time: 'Hoje às 14:00', status: 'Em 1h' },
                    { title: 'Demo Samsung Galaxy S24', time: 'Hoje às 16:00', status: 'Em 3h' },
                    { title: 'Entrega iPads - Escola', time: 'Amanhã às 14:00', status: 'Amanhã' },
                    { title: 'Apresentação Projeto TI', time: '05/07 às 10:00', status: 'Agendado' }
                  ],
                  'tecnologia': [
                    { title: 'Instalação Servidor', time: 'Hoje às 14:00', status: 'Em 1h' },
                    { title: 'Manutenção Rede', time: 'Hoje às 18:00', status: 'Em 5h' },
                    { title: 'Setup Workstation', time: 'Amanhã às 09:00', status: 'Amanhã' },
                    { title: 'Treinamento Software', time: '06/07 às 14:00', status: 'Esta semana' }
                  ],
                  'educacao': [
                    { title: 'Aula Matemática Avançada', time: 'Hoje às 14:00', status: 'Em 1h' },
                    { title: 'Reunião Pais', time: 'Hoje às 17:00', status: 'Em 4h' },
                    { title: 'Prova de Física', time: 'Amanhã às 08:00', status: 'Amanhã' },
                    { title: 'Feira de Ciências', time: '08/07 às 09:00', status: 'Esta semana' }
                  ],
                  'beleza': [
                    { title: 'Corte e Escova - Maria', time: 'Hoje às 15:00', status: 'Em 2h' },
                    { title: 'Manicure - Ana', time: 'Hoje às 16:30', status: 'Em 3h' },
                    { title: 'Design de Sobrancelhas', time: 'Amanhã às 10:00', status: 'Amanhã' },
                    { title: 'Tratamento Facial', time: '05/07 às 14:00', status: 'Agendado' }
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
                // Função para lidar com cliques nas notificações
                const handleNotificationClick = (notification: any) => {
                  if (notification.color === 'red') {
                    alert(`🚨 URGENTE: ${notification.title}\n\n${notification.desc}\n\nClique em OK para resolver imediatamente.`);
                  } else if (notification.color === 'orange') {
                    alert(`⚠️ ATENÇÃO: ${notification.title}\n\n${notification.desc}\n\nAção recomendada: Verificar em breve.`);
                  } else {
                    alert(`✅ NOVO: ${notification.title}\n\n${notification.desc}\n\nNotificação marcada como visualizada.`);
                  }
                };

                const categoryNotifications = {
                  'pet': [
                    { icon: AlertTriangle, title: 'Vacinas Pendentes', desc: '2 animais precisam de vacinação V10', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Estoque Baixo', desc: 'Ração Premium Golden acabando', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Consulta', desc: 'Agendamento feito há 10 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'medico': [
                    { icon: AlertTriangle, title: 'Medicamentos Vencidos', desc: 'Antibiótico expira em 2 dias', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Estoque Crítico', desc: 'Seringas 10ml em falta', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Consulta', desc: 'Emergência agendada há 5 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'alimenticio': [
                    { icon: AlertTriangle, title: 'Ingredientes Vencendo', desc: '4 ingredientes vencem hoje', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Estoque Baixo', desc: 'Massa para pizza acabando', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Novo Pedido', desc: 'Pizza Margherita há 3 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'vendas': [
                    { icon: AlertTriangle, title: 'Produto Esgotado', desc: 'Monitor 144Hz fora de estoque', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Pagamento Pendente', desc: 'Fatura corporativa vence hoje', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Venda', desc: 'Processador i7 vendido há 8 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'tecnologia': [
                    { icon: AlertTriangle, title: 'Hardware Crítico', desc: 'Placa RTX 4060 esgotada', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Instalação Pendente', desc: 'Servidor aguarda configuração', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Venda', desc: 'SSD Samsung vendido há 12 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'educacao': [
                    { icon: AlertTriangle, title: 'Material Esgotado', desc: 'Papel A4 fora de estoque', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Entrega Atrasada', desc: 'Kit laboratório chegou ontem', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Nova Matrícula', desc: 'Aluno inscrito há 15 minutos', badge: 'Novo', color: 'green' }
                  ],
                  'beleza': [
                    { icon: AlertTriangle, title: 'Produto Vencendo', desc: 'Esmalte Colorama expira em 3 dias', badge: 'Urgente', color: 'red' },
                    { icon: Clock, title: 'Estoque Baixo', desc: 'Perfume Boticário acabando', badge: 'Atenção', color: 'orange' },
                    { icon: TrendingUp, title: 'Novo Agendamento', desc: 'Corte marcado há 7 minutos', badge: 'Novo', color: 'green' }
                  ]
                };
                
                const notifications = categoryNotifications[selectedCategory as keyof typeof categoryNotifications] || categoryNotifications.pet;
                
                return notifications.map((notif, index) => (
                  <div 
                    key={index} 
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleNotificationClick(notif)}
                  >
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