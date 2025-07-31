import { useState } from 'react';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { formatDateBR } from '@/utils/dateFormat';
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
    { 
      id: 'sys_1',
      action: 'Agendamento confirmado', 
      description: 'Consulta veterinária para Luna agendada para hoje às 14:00',
      timestamp: new Date('2024-12-26T08:00:00'),
      status: 'success', 
      user: 'Dr. Carlos Mendes',
      type: 'appointment',
      category: 'pet',
      time: '08:00'
    },
    { 
      id: 'sys_2',
      action: 'Venda processada', 
      description: 'Venda de R$ 45,90 - Combo Executivo processada com PIX',
      timestamp: new Date('2024-12-26T07:45:00'),
      status: 'success', 
      user: 'Ana Costa',
      type: 'sale',
      category: 'vendas',
      time: '07:45'
    },
    { 
      id: 'sys_3',
      action: 'Produto adicionado', 
      description: 'Medicamento "Antibiótico Amoxicilina 500mg" cadastrado no estoque',
      timestamp: new Date('2024-12-26T07:30:00'),
      status: 'success', 
      user: 'Farmacêutico',
      type: 'product',
      category: 'medico',
      time: '07:30'
    }
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
        metric1: { label: 'Vendas Hoje', value: `${sales.length}`, change: `R$ ${sales.reduce((sum: number, sale: any) => sum + (Number(sale.total_price) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'green' },
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
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Logs ({stats.total})
          </h3>
        </div>

        {/* Filtros abaixo do cabeçalho */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data inicial"
          />
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data final"
          />
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
            }}
            className="btn btn-outline"
          >
            Limpar Filtros
          </button>
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
    </div>
  );

  const renderSales = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Vendas ({sales.length})
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total:</p>
            <p className="text-lg font-bold text-green-600">
              R$ {sales.reduce((sum: number, sale: any) => sum + (Number(sale.total_price) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filtros abaixo do cabeçalho */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar vendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data inicial"
          />
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data final"
          />
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
            }}
            className="btn btn-outline"
          >
            Limpar Filtros
          </button>
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
                      {sale.sale_date ? formatDateBR(sale.sale_date) : 'Data não disponível'}
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
    </div>
  );

  const renderClients = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Clientes ({clients.length})
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total gasto:</p>
            <p className="text-lg font-bold text-blue-600">
              R$ {clients.reduce((sum: number, client: any) => sum + (Number(client.totalSpent) || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filtros abaixo do cabeçalho */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data inicial"
          />
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data final"
          />
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
            }}
            className="btn btn-outline"
          >
            Limpar Filtros
          </button>
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
    </div>
  );

  const renderReports = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Relatórios
          </h3>
        </div>

        {/* Filtros abaixo do cabeçalho */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="date"
            value={dateFrom || ''}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data inicial"
          />
          <input
            type="date"
            value={dateTo || ''}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Data final"
          />
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFrom('');
              setDateTo('');
            }}
            className="btn btn-outline"
          >
            Limpar Filtros
          </button>
        </div>
        
        <div className="standard-list-container">
          <div className="standard-list-content">
            <div className="text-center py-8">
              <p className="text-gray-600">Relatórios disponíveis em breve.</p>
            </div>
          </div>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.entries(metrics).slice(0, 2).map(([key, metric]) => (
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

      {/* Navegação por abas - Padrão EstoqueSection */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
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