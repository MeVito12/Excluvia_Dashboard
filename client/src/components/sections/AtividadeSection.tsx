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
import { useCategory, categories } from '@/contexts/CategoryContext';

const AtividadeSection = () => {
  const { selectedCategory } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  // Tipos de atividade
  const activityTypes = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'appointment', label: 'Agendamentos' },
    { value: 'reminder', label: 'Lembretes' },
    { value: 'sale', label: 'Vendas' },
    { value: 'stock', label: 'Estoque' },
    { value: 'product', label: 'Produtos' },
    { value: 'message', label: 'Mensagens' },
    { value: 'qrcode', label: 'QR Codes' },
    { value: 'campaign', label: 'Campanhas' },
    { value: 'client', label: 'Clientes' },
    { value: 'order', label: 'Pedidos' },
    { value: 'integration', label: 'Integrações' },
    { value: 'backup', label: 'Backups' },
    { value: 'report', label: 'Relatórios' },
    { value: 'delivery', label: 'Entregas' }
  ];

  // Dados de atividades relacionados aos dados do aplicativo
  const activities = [
    // Atividades de Agendamentos
    { 
      id: 1,
      action: 'Agendamento confirmado', 
      company: 'Pet & Veterinário', 
      time: '5 min atrás', 
      status: 'success', 
      details: 'Consulta veterinária para Luna agendada para hoje às 14:00',
      user: 'Dr. Carlos Mendes',
      type: 'appointment',
      category: 'pet'
    },
    { 
      id: 2,
      action: 'Lembrete enviado', 
      company: 'Saúde & Medicamentos', 
      time: '15 min atrás', 
      status: 'info', 
      details: 'Email de lembrete enviado para Ana Silva sobre consulta de amanhã',
      user: 'Sistema',
      type: 'reminder',
      category: 'saude'
    },
    { 
      id: 3,
      action: 'Agendamento reagendado', 
      company: 'Design Gráfico', 
      time: '30 min atrás', 
      status: 'warning', 
      details: 'Reunião de briefing movida de 10:00 para 15:00 a pedido do cliente',
      user: 'Sarah Design',
      type: 'appointment',
      category: 'design'
    },
    
    // Atividades de Estoque/Vendas
    { 
      id: 4,
      action: 'Venda processada', 
      company: 'Alimentício', 
      time: '45 min atrás', 
      status: 'success', 
      details: 'Venda de R$ 45,90 - Combo Executivo processada com PIX',
      user: 'Ana Costa',
      type: 'sale',
      category: 'alimenticio'
    },
    { 
      id: 5,
      action: 'Estoque baixo detectado', 
      company: 'Pet & Veterinário', 
      time: '1h atrás', 
      status: 'warning', 
      details: 'Ração Premium Cães - apenas 5 unidades restantes',
      user: 'Sistema',
      type: 'stock',
      category: 'pet'
    },
    // Atividades de Vendas - Extensas
    { 
      id: 6,
      action: 'Venda corporativa fechada', 
      company: 'Vendas', 
      time: '15 min atrás', 
      status: 'success', 
      details: 'Digital Solutions Corp - 3 MacBook Air M3 vendidos por R$ 28.500,00',
      user: 'Vendedor Premium',
      type: 'sale',
      category: 'vendas'
    },
    { 
      id: 7,
      action: 'Orçamento aprovado', 
      company: 'Vendas', 
      time: '25 min atrás', 
      status: 'success', 
      details: 'MegaTech - Orçamento de 50 Samsung Galaxy S24 Ultra aprovado (R$ 360.000)',
      user: 'Gerente Comercial',
      type: 'sale',
      category: 'vendas'
    },
    { 
      id: 8,
      action: 'Entrega realizada', 
      company: 'Vendas', 
      time: '35 min atrás', 
      status: 'success', 
      details: 'Hotel Presidente - 8 Smart TVs Samsung entregues e instaladas',
      user: 'Equipe Técnica',
      type: 'delivery',
      category: 'vendas'
    },
    { 
      id: 9,
      action: 'Follow-up agendado', 
      company: 'Vendas', 
      time: '45 min atrás', 
      status: 'info', 
      details: 'GameZone - Follow-up sobre PlayStation 5 agendado para amanhã',
      user: 'Vendedor Senior',
      type: 'appointment',
      category: 'vendas'
    },
    { 
      id: 10,
      action: 'Produto em destaque', 
      company: 'Vendas', 
      time: '1h atrás', 
      status: 'info', 
      details: 'iPad Pro 12.9" M2 adicionado às ofertas especiais (desconto 15%)',
      user: 'Marketing',
      type: 'product',
      category: 'vendas'
    },
    { 
      id: 11,
      action: 'Cliente recomprado', 
      company: 'Vendas', 
      time: '1h 15min atrás', 
      status: 'success', 
      details: 'Pedro Santos - Segunda compra: iPhone 15 Pro Max por R$ 9.999,00',
      user: 'Vendedor Especialista',
      type: 'sale',
      category: 'vendas'
    },
    { 
      id: 12,
      action: 'Negociação em andamento', 
      company: 'Vendas', 
      time: '1h 30min atrás', 
      status: 'warning', 
      details: 'Escola Técnica Moderna - Negociando desconto em lote de 15 iPads',
      user: 'Gerente Regional',
      type: 'sale',
      category: 'vendas'
    },
    { 
      id: 13,
      action: 'Catálogo atualizado', 
      company: 'Vendas', 
      time: '2h atrás', 
      status: 'info', 
      details: 'Catálogo Eletrônicos: 5 novos produtos adicionados incluindo Xbox Series X',
      user: 'Gestor de Produtos',
      type: 'product',
      category: 'vendas'
    },
    { 
      id: 14,
      action: 'Estoque reposto', 
      company: 'Vendas', 
      time: '2h 20min atrás', 
      status: 'success', 
      details: 'AirPods Pro 2ª Geração - 30 unidades recebidas do fornecedor',
      user: 'Almoxarifado',
      type: 'stock',
      category: 'vendas'
    },
    { 
      id: 15,
      action: 'Demonstração agendada', 
      company: 'Vendas', 
      time: '2h 45min atrás', 
      status: 'info', 
      details: 'Agência Criativa - Demo dos Monitores LG UltraWide marcada para amanhã',
      user: 'Especialista Técnico',
      type: 'appointment',
      category: 'vendas'
    },
    { 
      id: 16,
      action: 'Desconto corporativo aplicado', 
      company: 'Vendas', 
      time: '3h atrás', 
      status: 'success', 
      details: 'TechFix Informática - 15% desconto aprovado para compra em lote',
      user: 'Diretor Comercial',
      type: 'sale',
      category: 'vendas'
    },
    { 
      id: 17,
      action: 'Pagamento confirmado', 
      company: 'Vendas', 
      time: '3h 15min atrás', 
      status: 'success', 
      details: 'Universidade TechnoSul - PIX de R$ 13.500 confirmado para 30 Kindles',
      user: 'Financeiro',
      type: 'sale',
      category: 'vendas'
    },
    { 
      id: 18,
      action: 'Cliente reativado', 
      company: 'Vendas', 
      time: '3h 30min atrás', 
      status: 'success', 
      details: 'Casa & Decoração Ltda retomou compras após 3 meses',
      user: 'Relacionamento',
      type: 'client',
      category: 'vendas'
    },
    { 
      id: 19,
      action: 'Promoção criada', 
      company: 'Vendas', 
      time: '4h atrás', 
      status: 'info', 
      details: 'Campanha "Black Week Eletrônicos" criada com 20% desconto',
      user: 'Marketing Digital',
      type: 'campaign',
      category: 'vendas'
    },
    { 
      id: 20,
      action: 'Relatório de vendedor', 
      company: 'Vendas', 
      time: '4h 30min atrás', 
      status: 'info', 
      details: 'Vendedor do mês: João Silva com R$ 145.000 em vendas',
      user: 'RH Comercial',
      type: 'report',
      category: 'vendas'
    },
    { 
      id: 21,
      action: 'Parceria firmada', 
      company: 'Vendas', 
      time: '5h atrás', 
      status: 'success', 
      details: 'Startup InnovaTech agora é cliente corporativo gold',
      user: 'Gerente de Contas',
      type: 'client',
      category: 'vendas'
    },
    { 
      id: 22,
      action: 'Treinamento concluído', 
      company: 'Vendas', 
      time: '6h atrás', 
      status: 'success', 
      details: 'Equipe concluiu treinamento sobre novos produtos Apple',
      user: 'Supervisor Técnico',
      type: 'integration',
      category: 'vendas'
    },
    { 
      id: 23,
      action: 'Meta mensal atingida', 
      company: 'Vendas', 
      time: '8h atrás', 
      status: 'success', 
      details: 'Meta de julho superada em 115% - R$ 2.3 milhões em vendas',
      user: 'Diretor Comercial',
      type: 'report',
      category: 'vendas'
    },
    { 
      id: 24,
      action: 'Novo revendedor', 
      company: 'Vendas', 
      time: '12h atrás', 
      status: 'success', 
      details: 'MegaTech Distribuidora agora é parceiro oficial Samsung',
      user: 'Gerente de Parcerias',
      type: 'client',
      category: 'vendas'
    },
    { 
      id: 25,
      action: 'Análise de concorrência', 
      company: 'Vendas', 
      time: '1 dia atrás', 
      status: 'info', 
      details: 'Relatório de preços de concorrentes atualizado',
      user: 'Analista Comercial',
      type: 'report',
      category: 'vendas'
    },
    
    // Atividades de Atendimento
    { 
      id: 7,
      action: 'Mensagem recebida', 
      company: 'Criação de Sites', 
      time: '2h atrás', 
      status: 'info', 
      details: 'Nova mensagem de João sobre orçamento para e-commerce',
      user: 'Bot Assistente',
      type: 'message',
      category: 'sites'
    },
    { 
      id: 8,
      action: 'QR Code gerado', 
      company: 'Alimentício', 
      time: '3h atrás', 
      status: 'success', 
      details: 'QR Code criado para cardápio "Menu Executivo" - 5 downloads',
      user: 'Sistema',
      type: 'qrcode',
      category: 'alimenticio'
    },
    { 
      id: 9,
      action: 'Campanha de fidelização ativada', 
      company: 'Saúde & Medicamentos', 
      time: '4h atrás', 
      status: 'success', 
      details: 'Desconto 10% para clientes VIP ativado - 38 conversões',
      user: 'Marketing',
      type: 'campaign',
      category: 'saude'
    },
    
    // Atividades de Cliente
    { 
      id: 10,
      action: 'Novo cliente cadastrado', 
      company: 'Pet & Veterinário', 
      time: '5h atrás', 
      status: 'success', 
      details: 'Maria Santos cadastrada com pet "Bolt" - Pastor Alemão',
      user: 'Recepção',
      type: 'client',
      category: 'pet'
    },
    { 
      id: 11,
      action: 'Pedido automático processado', 
      company: 'Alimentício', 
      time: '6h atrás', 
      status: 'success', 
      details: 'Pizza Margherita - R$ 32,50 pedida via bot e enviada para cozinha',
      user: 'Bot IA',
      type: 'order',
      category: 'alimenticio'
    },
    { 
      id: 12,
      action: 'Integração Google Calendar', 
      company: 'Saúde & Medicamentos', 
      time: '8h atrás', 
      status: 'info', 
      details: 'Consulta sincronizada com Google Calendar de Dr. Pedro Lima',
      user: 'Sistema',
      type: 'integration',
      category: 'saude'
    },
    
    // Atividades de Sistema
    { 
      id: 13,
      action: 'Backup automático', 
      company: 'Global', 
      time: '12h atrás', 
      status: 'success', 
      details: 'Backup diário concluído - 2.4GB de dados salvos com segurança',
      user: 'Sistema',
      type: 'backup',
      category: 'all'
    },
    { 
      id: 14,
      action: 'Relatório de vendas gerado', 
      company: 'Tecnologia', 
      time: '1 dia atrás', 
      status: 'info', 
      details: 'Relatório semanal: R$ 2.847,30 em vendas de produtos tech',
      user: 'Sistema',
      type: 'report',
      category: 'tecnologia'
    },
    { 
      id: 15,
      action: 'Falha de entrega detectada', 
      company: 'Alimentício', 
      time: '1 dia atrás', 
      status: 'error', 
      details: 'Entrega #1247 falhou - cliente contatado e reagendada',
      user: 'Sistema',
      type: 'delivery',
      category: 'alimenticio'
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Sucesso';
      case 'warning': return 'Aviso';
      case 'error': return 'Erro';
      case 'info': return 'Info';
      case 'neutral': return 'Neutro';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'reminder': return 'bg-yellow-100 text-yellow-800';
      case 'sale': return 'bg-green-100 text-green-800';
      case 'stock': return 'bg-orange-100 text-orange-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      case 'message': return 'bg-blue-100 text-blue-800';
      case 'qrcode': return 'bg-emerald-100 text-emerald-800';
      case 'campaign': return 'bg-pink-100 text-pink-800';
      case 'client': return 'bg-indigo-100 text-indigo-800';
      case 'order': return 'bg-green-100 text-green-800';
      case 'integration': return 'bg-cyan-100 text-cyan-800';
      case 'backup': return 'bg-purple-100 text-purple-800';
      case 'report': return 'bg-slate-100 text-slate-800';
      case 'delivery': return 'bg-amber-100 text-amber-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar atividades pela categoria selecionada globalmente
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    const matchesCategory = activity.category === selectedCategory; // Filtra apenas pela categoria selecionada
    const matchesType = selectedType === 'all' || activity.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Atividade</h1>
        <p className="text-gray-300">
          Log de atividades - {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'}
        </p>
      </div>

      {/* Filtros específicos da seção */}
      <div className="bg-white border border-border/50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="text-gray-900 bg-white">
              <SelectValue placeholder="Tipo" className="text-gray-500" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-gray-50">
                  {type.label}
                </SelectItem>
              ))}
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
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="font-medium text-gray-900">{activity.action}</h4>
                  <Badge className={getStatusColor(activity.status)}>
                    {getStatusLabel(activity.status)}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(activity.type)}>
                    {activityTypes.find(t => t.value === activity.type)?.label || activity.type}
                  </Badge>
                  {activity.category !== 'all' && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      {categories.find(c => c.value === activity.category)?.label || activity.company}
                    </Badge>
                  )}
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