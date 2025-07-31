import { useState } from 'react';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, Search, Download, Mail, MessageCircle, Send, Settings, CreditCard, CheckCircle, Zap, Activity as ActivityIcon, ShoppingCart, Users, BarChart3, TrendingUp, DollarSign, Plus, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { useSales } from '@/hooks/useSales';
import { useClients } from '@/hooks/useClients';
import { useProducts } from '@/hooks/useProducts';

import React from 'react';

const AtividadeSection = () => {
  const { selectedCategory } = useCategory();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState('vendas');
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Configurar datas automáticas (últimos 7 dias por padrão)
  const getDefaultDates = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    return {
      from: sevenDaysAgo.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [dateFrom, setDateFrom] = useState<string>(defaultDates.from);
  const [dateTo, setDateTo] = useState<string>(defaultDates.to);

  // Dados das abas usando hooks reais
  const { sales } = useSales();
  const { clients } = useClients();
  const { products } = useProducts();

  // Atividades do sistema simplificadas
  const systemActivities = [
    { id: 'sys_1', action: 'Venda processada', description: 'Nova venda registrada', timestamp: new Date(), status: 'success', user: 'Sistema', type: 'sale', category: selectedCategory, time: '10:30' }
  ];

  const stats = {
    total: systemActivities.length + sales.length,
    success: systemActivities.filter(a => a.status === 'success').length + sales.length,
    error: systemActivities.filter(a => a.status === 'error').length,
    pending: systemActivities.filter(a => a.status === 'pending').length,
    integrations: 5
  };

  const filteredActivities = systemActivities.filter(activity => {
    const matchesSearch = !searchTerm || 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Tabs da seção
  const tabs = [
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'atividades', label: 'Logs', icon: ActivityIcon }
  ];

  // Métricas específicas da aba ativa
  const getTabMetrics = () => {
    if (activeTab === 'vendas') {
      return {
        metric1: { label: 'Vendas Hoje', value: `R$ ${sales.reduce((sum: number, sale: any) => sum + (Number(sale.total_price) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, change: `${sales.length} vendas`, icon: DollarSign, color: 'green' },
        metric2: { label: 'Total Vendas', value: sales.length.toString(), change: 'Transações realizadas', icon: BarChart3, color: 'orange' }
      };
    } else if (activeTab === 'clientes') {
      return {
        metric1: { label: 'Clientes Ativos', value: clients.length, change: 'Total cadastrados', icon: Users, color: 'purple' },
        metric2: { label: 'Taxa de Retenção', value: '85%', change: 'Média mensal', icon: TrendingUp, color: 'blue' }
      };
    } else if (activeTab === 'atividades') {
      return {
        metric1: { label: 'Total de Atividades', value: stats.total, change: 'Últimas 24h', icon: CheckCircle, color: 'blue' },
        metric2: { label: 'Sucessos', value: stats.success, change: `Taxa: ${Math.round((stats.success / stats.total) * 100)}%`, icon: CheckCircle, color: 'emerald' }
      };
    } else {
      return {
        metric1: { label: 'Relatórios Gerados', value: '47', change: 'Este mês', icon: BarChart3, color: 'blue' },
        metric2: { label: 'Exportações', value: '12', change: 'Esta semana', icon: Download, color: 'green' }
      };
    }
  };

  const metrics = getTabMetrics();

  // Funções para renderizar o conteúdo de cada aba
  const renderActivities = () => (
    <div className="main-card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Logs ({stats.total})
          </h2>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar atividades..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setDateFrom('');
                setDateTo('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="standard-list-container">
        <div className="standard-list-content">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="standard-list-item group">
              <div className="list-item-main">
                <div className="list-item-title">{activity.action}</div>
                <div className="list-item-subtitle">{activity.description}</div>
                <div className="list-item-meta flex items-center gap-2">
                  <span className={`list-status-badge ${
                    activity.status === 'success' ? 'status-success' :
                    activity.status === 'error' ? 'status-danger' :
                    activity.status === 'warning' ? 'status-warning' :
                    'status-info'
                  }`}>
                    {activity.status === 'success' ? 'Sucesso' :
                     activity.status === 'error' ? 'Erro' :
                     activity.status === 'warning' ? 'Aviso' : 'Info'}
                  </span>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <span>•</span>
                  <span className="text-xs text-gray-500">Por: {activity.user}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="list-item-actions">
                  <button
                    onClick={() => {
                      showAlert({
                        title: "Detalhes da Atividade",
                        description: `Ação: ${activity.action}\nDescrição: ${activity.description}\nStatus: ${activity.status}\nUsuário: ${activity.user}`,
                        variant: "default"
                      });
                    }}
                    className="list-action-button view"
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="main-card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Vendas ({sales.length})
            </h2>
            <p className="text-sm text-gray-600">
              Total: R$ {sales.reduce((sum: number, sale: any) => sum + (Number(sale.total_price) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar vendas..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setDateFrom('');
                setDateTo('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
      
      <div className="standard-list-container">
        <div className="standard-list-content">
          {sales.map((sale: any) => {
            const client = clients.find((c: any) => c.id === sale.client_id);
            const product = products.find((p: any) => p.id === sale.product_id);
            
            return (
              <div key={sale.id} className="standard-list-item group">
                <div className="list-item-main">
                  <div className="list-item-title">{client?.name || `Cliente #${sale.client_id}`}</div>
                  <div className="list-item-subtitle">{product?.name || `Produto #${sale.product_id}`} x{sale.quantity || 0}</div>
                  <div className="list-item-meta">
                    {sale.sale_date ? format(new Date(sale.sale_date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Data não disponível'}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="list-status-badge status-success">Concluída</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">R$ {Number(sale.total_price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="main-card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Clientes ({clients.length})
            </h2>
            <p className="text-sm text-gray-600">
              Total gasto: R$ {clients.reduce((sum: number, client: any) => sum + (Number(client.totalSpent) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar clientes..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setDateFrom('');
                setDateTo('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
      
      <div className="standard-list-container">
        <div className="standard-list-content">
          {clients.map((client: any) => (
            <div key={client.id} className="standard-list-item group">
              <div className="list-item-main">
                <div className="list-item-title">{client.name}</div>
                <div className="list-item-subtitle">{client.email}</div>
                <div className="list-item-meta">{client.phone}</div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="list-status-badge status-success">Ativo</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">R$ {Number(client.totalSpent || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="main-card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Relatórios
          </h2>
          
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar relatórios..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setDateFrom('');
                setDateTo('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600">Relatórios disponíveis em breve.</p>
      </div>
    </div>
  );

  // Função para renderizar o conteúdo da aba selecionada
  const renderTabContent = () => {
    switch (activeTab) {
      case 'vendas':
        return renderSales();
      case 'clientes':
        return renderClients();
      case 'relatorios':
        return renderReports();
      case 'atividades':
        return renderActivities();
      default:
        return renderSales();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Atividade</h1>
        <p className="section-subtitle">
          Monitore atividades, vendas, clientes e relatórios do seu negócio
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {Object.entries(metrics).slice(0, 4).map(([key, metric]) => (
          <div key={key} className="metric-card-standard">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                <p className={`text-xs mt-1 text-${metric.color}-600`}>{metric.change}</p>
              </div>
              <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navegação por abas */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo da aba selecionada */}
      {renderTabContent()}
      
      <CustomAlert
        isOpen={isOpen}
        onClose={closeAlert}
        title={alertData.title}
        description={alertData.description}
        variant={alertData.variant}
      />
    </div>
  );
};

export default AtividadeSection;