import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategory, categories } from '@/contexts/CategoryContext';
import UnifiedFilters from '@/components/UnifiedFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar, Plus, Clock, Mail, MessageSquare, Settings, Trash2, Edit, CheckCircle, X } from 'lucide-react';
import { format, parseISO, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Schemas
const appointmentSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  startTime: z.string().min(1, 'Data e hora de início são obrigatórias'),
  endTime: z.string().min(1, 'Data e hora de fim são obrigatórias'),
  location: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email('E-mail inválido').optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
});

const integrationSchema = z.object({
  platform: z.enum(['google_calendar', 'doctoralia', 'outlook']),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  calendarId: z.string().optional(),
  isActive: z.boolean().default(true),
});

const notificationSchema = z.object({
  emailEnabled: z.boolean().default(true),
  telegramEnabled: z.boolean().default(false),
  telegramChatId: z.string().optional(),
  emailAddress: z.string().email('E-mail inválido').optional().or(z.literal('')),
  reminderMinutesBefore: z.number().min(1).default(60),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;
type IntegrationFormData = z.infer<typeof integrationSchema>;
type NotificationFormData = z.infer<typeof notificationSchema>;

const AgendamentosSection = () => {
  const { selectedCategory } = useCategory();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Tipos de serviços específicos por categoria
  const getServiceTypesByCategory = () => {
    switch (selectedCategory) {
      case 'pet':
        return [
          { value: 'all', label: 'Todos os Serviços' },
          { value: 'consulta', label: 'Consulta Veterinária' },
          { value: 'vacinacao', label: 'Vacinação' },
          { value: 'cirurgia', label: 'Cirurgia' },
          { value: 'banho_tosa', label: 'Banho e Tosa' },
          { value: 'exame', label: 'Exames' },
          { value: 'emergencia', label: 'Emergência' }
        ];
      case 'saude':
        return [
          { value: 'all', label: 'Todos os Serviços' },
          { value: 'consulta', label: 'Consulta Médica' },
          { value: 'exame', label: 'Exames' },
          { value: 'fisioterapia', label: 'Fisioterapia' },
          { value: 'cirurgia', label: 'Cirurgia' },
          { value: 'retorno', label: 'Retorno' },
          { value: 'emergencia', label: 'Emergência' }
        ];
      case 'alimenticio':
        return [
          { value: 'all', label: 'Todos os Serviços' },
          { value: 'mesa', label: 'Reserva de Mesa' },
          { value: 'evento', label: 'Evento/Festa' },
          { value: 'delivery', label: 'Agendamento Delivery' },
          { value: 'catering', label: 'Serviço de Catering' },
          { value: 'degustacao', label: 'Degustação' }
        ];
      case 'vendas':
        return [
          { value: 'all', label: 'Todos os Serviços' },
          { value: 'reuniao_vendas', label: 'Reunião de Vendas' },
          { value: 'apresentacao', label: 'Apresentação de Produto' },
          { value: 'negociacao', label: 'Negociação' },
          { value: 'follow_up', label: 'Follow-up' },
          { value: 'entrega', label: 'Entrega/Instalação' },
          { value: 'pos_venda', label: 'Pós-venda' }
        ];
      case 'design':
        return [
          { value: 'all', label: 'Todos os Serviços' },
          { value: 'briefing', label: 'Briefing Inicial' },
          { value: 'apresentacao', label: 'Apresentação' },
          { value: 'aprovacao', label: 'Aprovação' },
          { value: 'entrega', label: 'Entrega Final' },
          { value: 'revisao', label: 'Revisão' }
        ];
      case 'sites':
        return [
          { value: 'all', label: 'Todos os Serviços' },
          { value: 'briefing', label: 'Briefing do Projeto' },
          { value: 'prototipo', label: 'Apresentação Protótipo' },
          { value: 'desenvolvimento', label: 'Reunião Desenvolvimento' },
          { value: 'teste', label: 'Testes e Validação' },
          { value: 'lancamento', label: 'Lançamento' },
          { value: 'manutencao', label: 'Manutenção' }
        ];
      default:
        return [{ value: 'all', label: 'Todos os Serviços' }];
    }
  };

  const serviceTypes = getServiceTypesByCategory();

  // Queries
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  // Função para categorizar agendamentos
  const getAppointmentCategory = (appointment: any) => {
    const title = appointment.title?.toLowerCase() || '';
    const description = appointment.description?.toLowerCase() || '';
    const location = appointment.location?.toLowerCase() || '';
    
    if (title.includes('veterinár') || title.includes('pet') || title.includes('vacinação') || 
        title.includes('cirurgia') || title.includes('banho') || title.includes('tosa') ||
        location.includes('veterinár') || location.includes('pet')) {
      return 'veterinario';
    }
    
    if (title.includes('consulta') || title.includes('médic') || title.includes('fisioterapia') || 
        title.includes('oftalmológ') || title.includes('cirurgia') || title.includes('exame') ||
        location.includes('hospital') || location.includes('clínica') || location.includes('laboratório')) {
      return 'medico';
    }
    
    if (title.includes('design') || title.includes('logo') || title.includes('identidade visual') || 
        title.includes('branding') || title.includes('gráfico') || title.includes('ui/ux') ||
        title.includes('apresentação') || title.includes('material gráfico') ||
        location.includes('agência') || location.includes('estúdio')) {
      return 'design';
    }
    
    if (title.includes('site') || title.includes('website') || title.includes('e-commerce') || 
        title.includes('loja online') || title.includes('landing page') || title.includes('sistema') ||
        title.includes('aplicativo') || title.includes('app') || title.includes('desenvolvimento') ||
        location.includes('desenvolvimento') || location.includes('software')) {
      return 'sites';
    }
    
    if (title.includes('entrega') || title.includes('demonstração') || title.includes('degustação') || 
        title.includes('corporativa') || title.includes('vendas') || title.includes('macbook') ||
        location.includes('loja') || location.includes('empresa') || location.includes('adega')) {
      return 'vendas';
    }
    
    return 'outros';
  };

  // Filtrar agendamentos apenas da categoria selecionada
  const filteredAppointments = (appointments as any[]).filter((appointment: any) => {
    const matchesSearch = !searchTerm || 
      appointment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Verifica se é da categoria selecionada
    const appointmentCategory = getAppointmentCategory(appointment);
    const categoryMap: { [key: string]: string } = {
      'pet': 'veterinario',
      'saude': 'medico',
      'alimenticio': 'restaurante',
      'vendas': 'vendas',
      'design': 'design',
      'sites': 'websites'
    };
    const matchesCategory = appointmentCategory === categoryMap[selectedCategory] || appointmentCategory === 'outros';
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || 
      appointment.title?.toLowerCase().includes(serviceTypeFilter) ||
      appointment.description?.toLowerCase().includes(serviceTypeFilter);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesServiceType;
  });

  const { data: integrations = [] } = useQuery({
    queryKey: ['/api/integrations'],
  });

  const { data: notificationSettings } = useQuery({
    queryKey: ['/api/notification-settings'],
  });

  // Mutations
  const createAppointmentMutation = useMutation({
    mutationFn: (data: AppointmentFormData) => apiRequest('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      setIsNewAppointmentOpen(false);
      toast({ title: 'Agendamento criado com sucesso!' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar agendamento', variant: 'destructive' });
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AppointmentFormData> }) => 
      apiRequest(`/api/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({ title: 'Agendamento atualizado com sucesso!' });
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/appointments/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({ title: 'Agendamento removido com sucesso!' });
    },
  });

  const createNotificationSettingsMutation = useMutation({
    mutationFn: (data: NotificationFormData) => apiRequest('/api/notification-settings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-settings'] });
      toast({ title: 'Configurações salvas com sucesso!' });
    },
  });

  // Forms
  const appointmentForm = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      status: 'scheduled',
    },
  });

  const notificationForm = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailEnabled: (notificationSettings as any)?.emailEnabled ?? true,
      telegramEnabled: (notificationSettings as any)?.telegramEnabled ?? false,
      telegramChatId: (notificationSettings as any)?.telegramChatId ?? '',
      emailAddress: (notificationSettings as any)?.emailAddress ?? '',
      reminderMinutesBefore: (notificationSettings as any)?.reminderMinutesBefore ?? 60,
    },
  });

  const onSubmitAppointment = (data: AppointmentFormData) => {
    createAppointmentMutation.mutate(data);
  };

  const onSubmitNotifications = (data: NotificationFormData) => {
    if ((notificationSettings as any)?.id) {
      // Update existing settings
      apiRequest(`/api/notification-settings/${(notificationSettings as any).id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/notification-settings'] });
        toast({ title: 'Configurações atualizadas com sucesso!' });
      });
    } else {
      createNotificationSettingsMutation.mutate(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getCategoryBadge = (appointment: any) => {
    const category = getAppointmentCategory(appointment);
    switch (category) {
      case 'veterinario':
        return <Badge className="bg-green-100 text-green-800">Veterinário</Badge>;
      case 'medico':
        return <Badge className="bg-blue-100 text-blue-800">Médico</Badge>;
      case 'design':
        return <Badge className="bg-pink-100 text-pink-800">Design</Badge>;
      case 'sites':
        return <Badge className="bg-indigo-100 text-indigo-800">Sites</Badge>;
      case 'vendas':
        return <Badge className="bg-purple-100 text-purple-800">Vendas</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Outros</Badge>;
    }
  };

  const upcomingAppointments = (appointments as any[])
    .filter((apt: any) => new Date(apt.startTime) > new Date())
    .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-300">
            {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - Gerencie seus agendamentos e lembretes
          </p>
        </div>
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Agendamento</DialogTitle>
            </DialogHeader>
            <Form {...appointmentForm}>
              <form onSubmit={appointmentForm.handleSubmit(onSubmitAppointment)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={appointmentForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Consulta médica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data e Hora de Início *</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data e Hora de Fim *</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Local</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Clínica Dr. Silva, Sala 205" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>E-mail do Cliente</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="cliente@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={appointmentForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detalhes adicionais sobre o agendamento..."
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsNewAppointmentOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createAppointmentMutation.isPending}
                  >
                    {createAppointmentMutation.isPending ? 'Criando...' : 'Criar Agendamento'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="agenda" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="lembretes" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Lembretes
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                <p className="text-xs text-muted-foreground">nos próximos dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(appointments as any[]).length}</div>
                <p className="text-xs text-muted-foreground">no sistema</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(appointments as any[]).filter((apt: any) => {
                    const aptDate = new Date(apt.startTime);
                    const today = new Date();
                    return aptDate.toDateString() === today.toDateString();
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">agendados</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtros Específicos da Categoria */}
          <div className="bg-white border border-border/50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Input
                  placeholder="Buscar por título, cliente, local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white text-gray-900 border-border/50"
                />
              </div>

              {/* Service Type Filter */}
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger className="text-gray-900 bg-white">
                  <SelectValue placeholder="Tipo de Serviço" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-gray-900 hover:bg-gray-50">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-gray-900 bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">Todos os Status</SelectItem>
                  <SelectItem value="scheduled" className="text-gray-900 hover:bg-gray-50">Agendado</SelectItem>
                  <SelectItem value="completed" className="text-gray-900 hover:bg-gray-50">Concluído</SelectItem>
                  <SelectItem value="cancelled" className="text-gray-900 hover:bg-gray-50">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Contador de resultados */}
          <div className="text-sm text-gray-500 px-2">
            Mostrando {filteredAppointments.length} de {(appointments as any[]).length} agendamentos
          </div>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Filtrados</CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum agendamento encontrado</p>
                  <p className="text-sm">Ajuste os filtros ou crie um novo agendamento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment: any) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{appointment.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {format(parseISO(appointment.startTime), "PPP 'às' HH:mm", { locale: ptBR })}
                          </p>
                          {appointment.clientName && (
                            <p className="text-sm text-gray-500">Cliente: {appointment.clientName}</p>
                          )}
                          {appointment.location && (
                            <p className="text-sm text-gray-500">Local: {appointment.location}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getCategoryBadge(appointment)}
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusLabel(appointment.status)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateAppointmentMutation.mutate({
                            id: appointment.id,
                            data: { status: appointment.status === 'scheduled' ? 'completed' : 'scheduled' }
                          })}
                        >
                          {appointment.status === 'scheduled' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAppointmentMutation.mutate(appointment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lembretes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Lembretes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Os lembretes são criados automaticamente para cada agendamento, 1 hora antes do horário marcado.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Lembretes por E-mail</h3>
                      <p className="text-sm text-gray-600">Receba lembretes diretamente no seu e-mail</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Lembretes por Telegram</h3>
                      <p className="text-sm text-gray-600">Configure nas notificações para receber via Telegram</p>
                    </div>
                  </div>
                  <Badge variant="outline">Disponível</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Google Calendar</h3>
                      <p className="text-sm text-gray-600">Sincronize com seu Google Calendar</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Doctoralia</h3>
                      <p className="text-sm text-gray-600">Importe agendamentos da Doctoralia</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Outlook Calendar</h3>
                      <p className="text-sm text-gray-600">Sincronize com o Outlook</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Conectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSubmitNotifications)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={notificationForm.control}
                      name="emailEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notificações por E-mail
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Receba lembretes por e-mail
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="telegramEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Notificações por Telegram
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Receba lembretes via Telegram
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail para notificações</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="telegramChatId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID do Chat do Telegram</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789" {...field} />
                          </FormControl>
                          <div className="text-sm text-muted-foreground">
                            Para obter seu ID, envie uma mensagem para @userinfobot no Telegram
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationForm.control}
                      name="reminderMinutesBefore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lembrete antes do agendamento (minutos)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="60" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                            />
                          </FormControl>
                          <div className="text-sm text-muted-foreground">
                            Padrão: 60 minutos (1 hora)
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={createNotificationSettingsMutation.isPending}>
                    {createNotificationSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgendamentosSection;