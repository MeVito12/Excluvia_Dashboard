import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CompanySelector from '@/components/CompanySelector';

const AtividadeSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Dados de atividades expandidos
  const activities = [
    { 
      id: 1,
      action: 'Backup completo realizado', 
      company: 'Empresa A', 
      time: '2 min atrás', 
      status: 'success', 
      details: 'Todos os dados salvos com sucesso. 2.4GB processados.',
      user: 'Sistema',
      type: 'backup'
    },
    { 
      id: 2,
      action: 'Novo usuário registrado', 
      company: 'Empresa C', 
      time: '5 min atrás', 
      status: 'info', 
      details: 'Usuário premium adicionado ao sistema.',
      user: 'Admin',
      type: 'user'
    },
    { 
      id: 3,
      action: 'Alerta de performance', 
      company: 'Empresa B', 
      time: '12 min atrás', 
      status: 'warning', 
      details: 'CPU acima de 80% por 5 minutos consecutivos.',
      user: 'Monitor',
      type: 'alert'
    },
    { 
      id: 4,
      action: 'Manutenção programada', 
      company: 'Empresa D', 
      time: '1h atrás', 
      status: 'neutral', 
      details: 'Servidor 3 em manutenção preventiva.',
      user: 'Admin',
      type: 'maintenance'
    },
    { 
      id: 5,
      action: 'Transação de alto valor', 
      company: 'Empresa F', 
      time: '2h atrás', 
      status: 'success', 
      details: 'R$ 15.000 processados com sucesso.',
      user: 'Sistema',
      type: 'transaction'
    },
    { 
      id: 6,
      action: 'Falha de conexão', 
      company: 'Empresa G', 
      time: '3h atrás', 
      status: 'error', 
      details: 'Conexão com banco perdida, restaurada automaticamente.',
      user: 'Sistema',
      type: 'error'
    },
    { 
      id: 7,
      action: 'Atualização de sistema', 
      company: 'Global', 
      time: '4h atrás', 
      status: 'success', 
      details: 'Sistema atualizado para versão 2.1.3.',
      user: 'DevOps',
      type: 'update'
    },
    { 
      id: 8,
      action: 'Novo relatório gerado', 
      company: 'Empresa A', 
      time: '5h atrás', 
      status: 'info', 
      details: 'Relatório mensal de vendas disponível.',
      user: 'Sistema',
      type: 'report'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'backup': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      case 'alert': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      case 'transaction': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'update': return 'bg-indigo-100 text-indigo-800';
      case 'report': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar atividades
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'all' || activity.company === selectedCompany;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    
    return matchesSearch && matchesCompany && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Atividade</h1>
        <p className="text-gray-300">Log de atividades</p>
      </div>

      {/* Filtros específicos da seção */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white text-gray-900 border-border/50"
            />
          </div>

          {/* Company Filter */}
          <CompanySelector
            value={selectedCompany}
            onValueChange={setSelectedCompany}
          />

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="text-gray-900 bg-white">
              <SelectValue placeholder="Status" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">Todos os Status</SelectItem>
              <SelectItem value="success" className="text-gray-900 hover:bg-gray-50">Sucesso</SelectItem>
              <SelectItem value="warning" className="text-gray-900 hover:bg-gray-50">Aviso</SelectItem>
              <SelectItem value="error" className="text-gray-900 hover:bg-gray-50">Erro</SelectItem>
              <SelectItem value="info" className="text-gray-900 hover:bg-gray-50">Informação</SelectItem>
              <SelectItem value="neutral" className="text-gray-900 hover:bg-gray-50">Neutro</SelectItem>
            </SelectContent>
          </Select>

          {/* Date From */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal bg-white text-gray-900 border-border/50 hover:bg-gray-50">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Date To */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal bg-white text-gray-900 border-border/50 hover:bg-gray-50">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="bg-white text-gray-900 border-border/50 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            Filtros Avançados
          </Button>
          <Button variant="outline" size="sm" className="bg-white text-gray-900 border-border/50 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2 text-gray-500" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-black">
            Atividades Recentes ({filteredActivities.length})
          </h3>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-medium text-gray-900">{activity.action}</h4>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{activity.details}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span><strong>Empresa:</strong> {activity.company}</span>
                  <span><strong>Usuário:</strong> {activity.user}</span>
                  <span><strong>Tempo:</strong> {activity.time}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Detalhes
              </Button>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma atividade encontrada com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-border/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-600">{activities.filter(a => a.status === 'success').length}</div>
          <div className="text-sm text-gray-600">Operações Bem-sucedidas</div>
        </div>
        <div className="bg-white border border-border/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-600">{activities.filter(a => a.status === 'warning').length}</div>
          <div className="text-sm text-gray-600">Avisos</div>
        </div>
        <div className="bg-white border border-border/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-red-600">{activities.filter(a => a.status === 'error').length}</div>
          <div className="text-sm text-gray-600">Erros</div>
        </div>
        <div className="bg-white border border-border/50 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{activities.filter(a => a.status === 'info').length}</div>
          <div className="text-sm text-gray-600">Informações</div>
        </div>
      </div>
    </div>
  );
};

export default AtividadeSection;