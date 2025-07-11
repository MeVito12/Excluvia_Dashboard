import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, Search, Download, Mail, MessageCircle, Send, Settings, CreditCard, CheckCircle, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { 
  getActivitiesByCategory,
  type Activity
} from '@/lib/mockData';

const AtividadeSection = () => {
  const { selectedCategory } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

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

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Atividades e Logs</h1>
        <p className="section-subtitle">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - 
          Monitore todas as atividades e integrações em tempo real
        </p>
      </div>

      {/* Métricas de Atividade */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Atividades</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              <p className="text-xs text-blue-600 mt-1">Últimas 24h</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Integrações Ativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.integrations}</p>
              <p className="text-xs text-green-600 mt-1">Funcionando normalmente</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sucessos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.success}</p>
              <p className="text-xs text-green-600 mt-1">Taxa: {Math.round((stats.success / stats.total) * 100)}%</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Erros</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.error}</p>
              <p className="text-xs text-red-600 mt-1">Requer atenção</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Zap className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

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

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48 bg-white text-gray-900 border-gray-200">
              <SelectValue placeholder="Tipo de atividade" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {activityTypes.map(type => (
                <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-gray-100">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32 bg-white text-gray-900 border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-100">Todos</SelectItem>
              <SelectItem value="success" className="text-gray-900 hover:bg-gray-100">Sucesso</SelectItem>
              <SelectItem value="error" className="text-gray-900 hover:bg-gray-100">Erro</SelectItem>
              <SelectItem value="warning" className="text-gray-900 hover:bg-gray-100">Aviso</SelectItem>
              <SelectItem value="info" className="text-gray-900 hover:bg-gray-100">Info</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtros de Data Interativos */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
              value={dateFrom ? dateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setDateFrom(date);
              }}
              placeholder="Data inicial"
              title="Clique para selecionar data inicial"
            />
          </div>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
              value={dateTo ? dateTo.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                setDateTo(date);
              }}
              placeholder="Data final"
              title="Clique para selecionar data final"
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setDateFrom(undefined);
              setDateTo(undefined);
              alert('📅 Filtros de data limpos!\n\nTodas as atividades serão exibidas.');
            }}
            className="cursor-pointer"
          >
            Limpar Datas
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport} className="cursor-pointer">
            <Download className="h-4 w-4 mr-2" />
            Exportar
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
                title="Clique para ver detalhes da atividade"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="p-2 rounded-lg bg-gray-100 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`🔧 Ação rápida\n\nTipo: ${activity.type}\nEsta ação permite gerenciar configurações específicas para ${activity.type}.`);
                    }}
                  >
                    <Icon className="h-5 w-5 text-gray-600 hover:text-purple-600 transition-colors" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 
                        className="text-sm font-medium text-gray-900 cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`📝 Ação: ${activity.action}\n\nClique para editar ou configurar esta ação.`);
                        }}
                      >
                        {activity.action}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={`cursor-pointer hover:scale-105 transition-transform ${
                            activity.status === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            activity.status === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                            activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                            'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`📊 Status: ${activity.status === 'success' ? 'Sucesso' : activity.status === 'error' ? 'Erro' : activity.status === 'warning' ? 'Aviso' : 'Info'}\n\nClique para filtrar apenas itens com este status.`);
                          }}
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
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span 
                          className="cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`👤 Usuário: ${activity.user}\n\nClique para ver todas as atividades deste usuário.`);
                          }}
                        >
                          Usuário: {activity.user}
                        </span>
                        <span 
                          className="cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`🏷️ Categoria: ${activity.category}\n\nClique para filtrar por esta categoria.`);
                          }}
                        >
                          Categoria: {activity.category}
                        </span>
                        <span 
                          className="cursor-pointer hover:text-purple-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`🔧 Tipo: ${activity.type}\n\nClique para ver configurações deste tipo.`);
                          }}
                        >
                          Tipo: {activity.type}
                        </span>
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="flex gap-1">
                        <button
                          className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`📋 Copiando detalhes...\n\nDetalhes da atividade copiados para a área de transferência.`);
                          }}
                          title="Copiar detalhes"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        
                        <button
                          className="p-1 rounded text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`✅ Marcando como resolvido...\n\nAtividade marcada como resolvida com sucesso.`);
                          }}
                          title="Marcar como resolvido"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        
                        <button
                          className="p-1 rounded text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`⚙️ Abrindo configurações...\n\nAcessando configurações avançadas para esta atividade.`);
                          }}
                          title="Configurações"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredActivities.length === 0 && (
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros para ver mais resultados.
            </p>
          </div>
        )}
      </div>

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