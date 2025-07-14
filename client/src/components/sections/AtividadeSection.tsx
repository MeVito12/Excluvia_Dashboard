import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, Search, Download, Mail, MessageCircle, Send, Settings, CreditCard, CheckCircle, Zap, Activity as ActivityIcon, ShoppingCart, Users, BarChart3, TrendingUp, DollarSign, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { 
  getActivitiesByCategory,
  getSalesByCategory, 
  getClientsByCategory,
  type Activity,
  type Sale,
  type Client
} from '@/lib/mockData';

import React from 'react';

const AtividadeSection = () => {
  const { selectedCategory } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dados das abas movidas do Estoque
  const [sales, setSales] = useState(() => getSalesByCategory(selectedCategory));
  const [clients, setClients] = useState(() => getClientsByCategory(selectedCategory));

  // Atualizar dados quando a categoria mudar
  React.useEffect(() => {
    setSales(getSalesByCategory(selectedCategory));
    setClients(getClientsByCategory(selectedCategory));
  }, [selectedCategory]);

  // Logs de integração em tempo real - agora usando dados centralizados
  const integrationLogs = getActivitiesByCategory(selectedCategory);

  // Atividades tradicionais do sistema
  const systemActivities = [
    { 
      id: 'sys_1',
      action: 'Agendamento confirmado', 
      description: 'Consulta veterinária para Luna agendada para hoje às 14:00',
      timestamp: new Date('2024-12-26T08:00:00'),
      status: 'success', 
      user: 'Dr. Carlos Mendes',
      type: 'appointment',
      category: 'pet'
    },
    { 
      id: 'sys_2',
      action: 'Venda processada', 
      description: 'Venda de R$ 45,90 - Combo Executivo processada com PIX',
      timestamp: new Date('2024-12-26T07:45:00'),
      status: 'success', 
      user: 'Ana Costa',
      type: 'sale',
      category: 'alimenticio'
    },
    { 
      id: 'sys_3',
      action: 'Produto adicionado', 
      description: 'Medicamento "Antibiótico Amoxicilina 500mg" cadastrado no estoque',
      timestamp: new Date('2024-12-26T07:30:00'),
      status: 'success', 
      user: 'Farmacêutico',
      type: 'product',
      category: 'medico'
    }
  ];

  // Tipos de atividade
  const activityTypes = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'calendar', label: 'Calendário' },
    { value: 'payment', label: 'Pagamentos' },
    { value: 'integration', label: 'Integrações' },
    { value: 'system', label: 'Sistema' },
    { value: 'appointment', label: 'Agendamentos' },
    { value: 'sale', label: 'Vendas' },
    { value: 'stock', label: 'Estoque' },
    { value: 'product', label: 'Produtos' },
    { value: 'client', label: 'Clientes' },
    { value: 'order', label: 'Pedidos' }
  ];

  // Função para obter ícone baseado no tipo
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'whatsapp': return MessageCircle;
      case 'telegram': return Send;
      case 'calendar': return CalendarIcon;
      case 'payment': return CreditCard;
      case 'integration': return Settings;
      case 'system': return Zap;
      default: return CheckCircle;
    }
  };

  // Combinar todas as atividades
  const allActivities = [...integrationLogs, ...systemActivities]
    .filter(activity => selectedCategory === 'all' || activity.category === selectedCategory)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .map(activity => ({
      ...activity,
      time: format(activity.timestamp, 'HH:mm - dd/MM', { locale: ptBR })
    }));

  // Filtrar atividades
  const filteredActivities = allActivities.filter(activity => {
    const matchesSearch = searchTerm === '' || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    
    // Filtro de data funcional
    const activityDate = activity.timestamp;
    const matchesDateFrom = !dateFrom || activityDate >= dateFrom;
    const matchesDateTo = !dateTo || activityDate <= dateTo;
    const matchesDate = matchesDateFrom && matchesDateTo;
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Estatísticas
  const stats = {
    total: filteredActivities.length,
    success: filteredActivities.filter(a => a.status === 'success').length,
    error: filteredActivities.filter(a => a.status === 'error').length,
    pending: filteredActivities.filter(a => a.status === 'warning' || a.status === 'info').length,
    integrations: filteredActivities.filter(a => integrationLogs.some(log => log.id === a.id)).length
  };

  // Função para mostrar modal de exportação
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('atividades');
  
  // Função para exportar dados com formatação profissional
  const handleExport = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-BR');
    const formattedTime = currentDate.toLocaleTimeString('pt-BR');
    const categoryName = categories.find(c => c.value === selectedCategory)?.label || 'Sistema';
    
    // Cabeçalho profissional
    const header = [
      `"RELATÓRIO DE ATIVIDADES - ${categoryName.toUpperCase()}"`,
      `"Data de Geração: ${formattedDate} às ${formattedTime}"`,
      `"Total de Registros: ${stats.total}"`,
      `"Período: ${filteredActivities.length > 0 ? filteredActivities[filteredActivities.length - 1].time : 'N/A'} até ${filteredActivities.length > 0 ? filteredActivities[0].time : 'N/A'}"`,
      '""',
      '"=== RESUMO EXECUTIVO ==="',
      `"Atividades com Sucesso: ${stats.success}"`,
      `"Atividades com Erro: ${stats.error}"`,
      `"Atividades Pendentes: ${stats.pending}"`,
      '""',
      '"=== DETALHAMENTO DAS ATIVIDADES ==="',
      '"Data/Hora","Tipo","Ação","Descrição Completa","Status","Responsável","Categoria"'
    ].join('\n');
    
    // Dados formatados
    const csvData = filteredActivities.map(activity => {
      const statusFormatted = activity.status === 'success' ? 'SUCESSO' : 
                             activity.status === 'error' ? 'ERRO' : 'PENDENTE';
      return `"${activity.time}","${activity.type.toUpperCase()}","${activity.action}","${activity.description}","${statusFormatted}","${activity.user}","${activity.category}"`;
    }).join('\n');
    
    const csvContent = header + '\n' + csvData;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_atividades_${selectedCategory}_${currentDate.toISOString().split('T')[0]}.csv`;
    link.click();
    
    // Modal de confirmação personalizado
    setShowExportModal(true);
    setTimeout(() => setShowExportModal(false), 3000);
  };

  // Tabs da seção com as abas movidas do Estoque
  const tabs = [
    { id: 'atividades', label: 'Atividades', icon: ActivityIcon },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 }
  ];

  // Métricas específicas da aba ativa
  const getTabMetrics = () => {
    if (activeTab === 'atividades') {
      return {
        metric1: { label: 'Total de Atividades', value: stats.total, change: 'Últimas 24h', icon: CheckCircle, color: 'blue' },
        metric2: { label: 'Integrações Ativas', value: stats.integrations, change: 'Funcionando normalmente', icon: Settings, color: 'green' },
        metric3: { label: 'Sucessos', value: stats.success, change: `Taxa: ${Math.round((stats.success / stats.total) * 100)}%`, icon: CheckCircle, color: 'emerald' },
        metric4: { label: 'Erros', value: stats.error, change: 'Requer atenção', icon: Zap, color: 'red' }
      };
    } else if (activeTab === 'vendas') {
      return {
        metric1: { label: 'Vendas Hoje', value: 'R$ 6.499', change: '+18% vs ontem', icon: DollarSign, color: 'green' },
        metric2: { label: 'Total de Vendas', value: sales.length, change: 'Este mês', icon: ShoppingCart, color: 'blue' },
        metric3: { label: 'Ticket Médio', value: 'R$ 89,50', change: '+12% vs semana passada', icon: TrendingUp, color: 'purple' },
        metric4: { label: 'Meta Mensal', value: '87%', change: 'R$ 15.200 de R$ 17.500', icon: BarChart3, color: 'orange' }
      };
    } else if (activeTab === 'clientes') {
      return {
        metric1: { label: 'Clientes Ativos', value: clients.length, change: '+12 este mês', icon: Users, color: 'purple' },
        metric2: { label: 'Novos Clientes', value: '23', change: 'Esta semana', icon: Users, color: 'green' },
        metric3: { label: 'Taxa de Retenção', value: '85%', change: '+3% vs mês anterior', icon: TrendingUp, color: 'blue' },
        metric4: { label: 'Satisfação', value: '4.8', change: 'Média de avaliações', icon: CheckCircle, color: 'emerald' }
      };
    } else {
      return {
        metric1: { label: 'Relatórios Gerados', value: '47', change: 'Este mês', icon: BarChart3, color: 'blue' },
        metric2: { label: 'Exportações', value: '12', change: 'Esta semana', icon: Download, color: 'green' },
        metric3: { label: 'Crescimento', value: '+22%', change: 'Vs mês anterior', icon: TrendingUp, color: 'purple' },
        metric4: { label: 'Automações', value: '8', change: 'Relatórios automáticos', icon: Settings, color: 'orange' }
      };
    }
  };

  const metrics = getTabMetrics();

  // Funções para renderizar o conteúdo de cada aba
  const renderActivities = () => (
    <div>
      {/* Filtros */}
      <div className="main-card p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white text-gray-900 placeholder:text-gray-500 border-gray-200 focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">De:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateFrom ? dateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setDateFrom(date);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Até:</span>
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={dateTo ? dateTo.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setDateTo(date);
              }}
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setDateFrom(undefined);
              setDateTo(undefined);
            }}
            className="cursor-pointer"
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* Lista de Atividades */}
      <div className="main-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Logs de Atividade ({filteredActivities.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredActivities.map((activity) => {
            const Icon = getActivityTypeIcon(activity.type);
            
            return (
              <div 
                key={activity.id} 
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-purple-500"
                onClick={() => {
                  alert(`📋 Detalhes da Atividade\n\nAção: ${activity.action}\nDescrição: ${activity.description}\nData/Hora: ${activity.time}\nStatus: ${activity.status === 'success' ? 'Sucesso' : activity.status === 'error' ? 'Erro' : activity.status === 'warning' ? 'Aviso' : 'Info'}\nUsuário: ${activity.user}\nTipo: ${activity.type}`);
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`${
                            activity.status === 'success' ? 'bg-green-100 text-green-800' :
                            activity.status === 'error' ? 'bg-red-100 text-red-800' :
                            activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {activity.status === 'success' ? 'Sucesso' :
                           activity.status === 'error' ? 'Erro' :
                           activity.status === 'warning' ? 'Aviso' : 'Info'}
                        </Badge>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Usuário: {activity.user}</span>
                      <span>Categoria: {activity.category}</span>
                      <span>Tipo: {activity.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="main-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Gestão de Vendas</h3>
        <Button className="bg-purple-600 text-white hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar vendas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">{sale.clientName}</h4>
                <p className="text-sm text-gray-600">{sale.productName} x{sale.quantity}</p>
                <p className="text-xs text-gray-500">{format(new Date(sale.date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">R$ {sale.total.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  sale.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {sale.status === 'completed' ? 'Concluída' : 'Pendente'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="main-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Gestão de Clientes</h3>
        <Button className="bg-purple-600 text-white hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div key={client.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">{client.name}</h4>
                <p className="text-sm text-gray-600">{client.email}</p>
                <p className="text-xs text-gray-500">{client.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">Total: R$ {client.totalSpent?.toFixed(2) || '0.00'}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="main-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Relatórios de Negócios</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button 
          onClick={() => {
            const csvContent = `"Relatório","Relatório Diário"\n"Período","${new Date().toLocaleDateString('pt-BR')}"\n"Total de Vendas","R$ 6.499,97"\n"Transações","45 vendas"`;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `daily_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            alert('📊 Relatório Diário exportado!');
          }}
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Relatório Diário
        </Button>
        <Button 
          onClick={() => {
            const csvContent = `"Relatório","Relatório Semanal"\n"Período","Última semana"\n"Total de Vendas","R$ 15.299,95"\n"Transações","127 vendas"`;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `weekly_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            alert('📊 Relatório Semanal exportado!');
          }}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Relatório Semanal
        </Button>
        <Button 
          onClick={() => {
            const csvContent = `"Relatório","Relatório Mensal"\n"Período","Este mês"\n"Total de Vendas","R$ 45.899,20"\n"Transações","389 vendas"`;
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `monthly_report_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
            alert('📊 Relatório Mensal exportado!');
          }}
          variant="outline"
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Relatório Mensal
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Notificações Automáticas</h4>
        <p className="text-sm text-blue-700">
          Você receberá alertas automáticos para: vendas processadas, novos clientes, metas atingidas e análises semanais.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'atividades':
        return renderActivities();
      case 'vendas':
        return renderSales();
      case 'clientes':
        return renderClients();
      case 'relatorios':
        return renderReports();
      default:
        return renderActivities();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Atividades e Negócios</h1>
        <p className="section-subtitle">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - 
          Monitore atividades, vendas, clientes e relatórios
        </p>
      </div>

      {/* Métricas Dinâmicas por Aba */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metrics.metric1.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.metric1.value}</p>
              <p className={`text-xs mt-1 ${metrics.metric1.color === 'green' ? 'text-green-600' : metrics.metric1.color === 'blue' ? 'text-blue-600' : metrics.metric1.color === 'red' ? 'text-red-600' : 'text-purple-600'}`}>
                {metrics.metric1.change}
              </p>
            </div>
            <div className={`p-3 rounded-full ${metrics.metric1.color === 'green' ? 'bg-green-100' : metrics.metric1.color === 'blue' ? 'bg-blue-100' : metrics.metric1.color === 'red' ? 'bg-red-100' : 'bg-purple-100'}`}>
              <metrics.metric1.icon className={`h-6 w-6 ${metrics.metric1.color === 'green' ? 'text-green-600' : metrics.metric1.color === 'blue' ? 'text-blue-600' : metrics.metric1.color === 'red' ? 'text-red-600' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metrics.metric2.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.metric2.value}</p>
              <p className={`text-xs mt-1 ${metrics.metric2.color === 'green' ? 'text-green-600' : metrics.metric2.color === 'blue' ? 'text-blue-600' : metrics.metric2.color === 'red' ? 'text-red-600' : 'text-purple-600'}`}>
                {metrics.metric2.change}
              </p>
            </div>
            <div className={`p-3 rounded-full ${metrics.metric2.color === 'green' ? 'bg-green-100' : metrics.metric2.color === 'blue' ? 'bg-blue-100' : metrics.metric2.color === 'red' ? 'bg-red-100' : 'bg-purple-100'}`}>
              <metrics.metric2.icon className={`h-6 w-6 ${metrics.metric2.color === 'green' ? 'text-green-600' : metrics.metric2.color === 'blue' ? 'text-blue-600' : metrics.metric2.color === 'red' ? 'text-red-600' : 'text-purple-600'}`} />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metrics.metric3.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.metric3.value}</p>
              <p className={`text-xs mt-1 ${metrics.metric3.color === 'green' ? 'text-green-600' : metrics.metric3.color === 'blue' ? 'text-blue-600' : metrics.metric3.color === 'red' ? 'text-red-600' : metrics.metric3.color === 'purple' ? 'text-purple-600' : metrics.metric3.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'}`}>
                {metrics.metric3.change}
              </p>
            </div>
            <div className={`p-3 rounded-full ${metrics.metric3.color === 'green' ? 'bg-green-100' : metrics.metric3.color === 'blue' ? 'bg-blue-100' : metrics.metric3.color === 'red' ? 'bg-red-100' : metrics.metric3.color === 'purple' ? 'bg-purple-100' : metrics.metric3.color === 'emerald' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
              <metrics.metric3.icon className={`h-6 w-6 ${metrics.metric3.color === 'green' ? 'text-green-600' : metrics.metric3.color === 'blue' ? 'text-blue-600' : metrics.metric3.color === 'red' ? 'text-red-600' : metrics.metric3.color === 'purple' ? 'text-purple-600' : metrics.metric3.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metrics.metric4.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metrics.metric4.value}</p>
              <p className={`text-xs mt-1 ${metrics.metric4.color === 'green' ? 'text-green-600' : metrics.metric4.color === 'blue' ? 'text-blue-600' : metrics.metric4.color === 'red' ? 'text-red-600' : metrics.metric4.color === 'purple' ? 'text-purple-600' : metrics.metric4.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'}`}>
                {metrics.metric4.change}
              </p>
            </div>
            <div className={`p-3 rounded-full ${metrics.metric4.color === 'green' ? 'bg-green-100' : metrics.metric4.color === 'blue' ? 'bg-blue-100' : metrics.metric4.color === 'red' ? 'bg-red-100' : metrics.metric4.color === 'purple' ? 'bg-purple-100' : metrics.metric4.color === 'emerald' ? 'bg-emerald-100' : 'bg-orange-100'}`}>
              <metrics.metric4.icon className={`h-6 w-6 ${metrics.metric4.color === 'green' ? 'text-green-600' : metrics.metric4.color === 'blue' ? 'text-blue-600' : metrics.metric4.color === 'red' ? 'text-red-600' : metrics.metric4.color === 'purple' ? 'text-purple-600' : metrics.metric4.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba selecionada */}
      {renderTabContent()}

      {/* Modal de Confirmação de Exportação */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 transform animate-bounce">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Exportação Concluída!
              </h3>
              <p className="text-gray-600 mb-4">
                Relatório de atividades exportado com sucesso.
                <br />
                <span className="font-medium">{stats.total} registros</span> processados
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  📄 Arquivo: <span className="font-mono">relatorio_atividades_{selectedCategory}_{new Date().toISOString().split('T')[0]}.csv</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtividadeSection;