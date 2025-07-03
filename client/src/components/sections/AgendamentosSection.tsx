import React, { useState } from 'react';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { 
  Calendar, 
  Clock, 
  Settings, 
  Mail,
  Plus,
  Search,
  Edit,
  CheckCircle,
  Bell,
  Users,
  MessageSquare,
  MessageCircle,
  Send,
  AlertTriangle
} from 'lucide-react';

const getAppointmentData = () => {
  const commonData = [
    { id: 1, title: 'Reunião Principal', client: 'Cliente A', date: '2024-12-26', time: '09:00', type: 'reuniao', status: 'scheduled' },
    { id: 2, title: 'Consulta Importante', client: 'Cliente B', date: '2024-12-26', time: '10:30', type: 'consulta', status: 'scheduled' },
    { id: 3, title: 'Follow-up', client: 'Cliente C', date: '2024-12-27', time: '14:00', type: 'followup', status: 'completed' }
  ];
  return commonData;
};

const AgendamentosSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('agenda');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState(() => getAppointmentData());

  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'lembretes', label: 'Lembretes', icon: Clock },
    { id: 'integracoes', label: 'Integrações', icon: Settings },
    { id: 'notificacoes', label: 'Notificações', icon: Mail }
  ];

  // Função para marcar compromisso como concluído
  const markAsCompleted = (appointmentId: number) => {
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId 
          ? { ...app, status: 'completed' }
          : app
      )
    );
    alert('✅ Compromisso marcado como concluído!');
  };

  // Função para editar compromisso
  const editAppointment = (appointmentId: number) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      alert(`📝 Editando: ${appointment.title}\n\nFuncionalidade em desenvolvimento.\nEm breve você poderá editar todos os detalhes do compromisso.`);
    }
  };

  // Função para adicionar novo compromisso
  const addNewAppointment = () => {
    const newId = Math.max(...appointments.map(a => a.id)) + 1;
    const newAppointment = {
      id: newId,
      title: 'Novo Compromisso',
      client: 'Cliente Novo',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : '2024-12-26',
      time: '14:00',
      type: 'consulta',
      status: 'scheduled' as const
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    alert('✅ Novo compromisso adicionado com sucesso!\n\nVocê pode editar os detalhes clicando no botão de edição.');
  };

  const renderAgenda = () => (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Compromissos ({appointments.length})
        </h3>
        <button 
          onClick={addNewAppointment}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Compromisso
        </button>
      </div>
      
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="main-card p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{appointment.title}</h4>
                <p className="text-sm text-gray-600">{appointment.client}</p>
                <p className="text-xs text-gray-500">{appointment.date} às {appointment.time}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`badge ${appointment.status === 'scheduled' ? 'badge-success' : 'badge-info'}`}>
                  {appointment.status === 'scheduled' ? 'Agendado' : 'Concluído'}
                </span>
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => editAppointment(appointment.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar compromisso"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  
                  {appointment.status === 'scheduled' && (
                    <button 
                      onClick={() => markAsCompleted(appointment.id)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Marcar como concluído"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLembretes = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Configurações de Lembretes</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lembrete Automático</span>
            <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
              <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email de Confirmação</span>
            <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center">
              <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegracoes = () => (
    <div className="animate-fade-in">
      <div className="content-grid">
        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Integrações de Calendário</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Google Calendar</h4>
                  <p className="text-sm text-gray-600">Sincronização automática ativa</p>
                  <p className="text-xs text-blue-600">Última sync: há 5 minutos</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Outlook Calendar</h4>
                  <p className="text-sm text-gray-600">Microsoft 365 integração</p>
                  <p className="text-xs text-red-600">Erro: Token expirado</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-0.5"></div>
              </div>
            </div>

            {(selectedCategory === 'medico' || selectedCategory === 'pet') && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Doctoralia</h4>
                    <p className="text-sm text-gray-600">
                      {selectedCategory === 'medico' ? 'Plataforma médica conectada' : 'Plataforma veterinária conectada'}
                    </p>
                    <p className="text-xs text-green-600">3 agendamentos sincronizados hoje</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                  <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Sistemas de Notificação</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">SendGrid Email</h4>
                  <p className="text-sm text-gray-600">Sistema de emails automáticos</p>
                  <p className="text-xs text-green-600">127 emails enviados hoje</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">WhatsApp Business</h4>
                  <p className="text-sm text-gray-600">Mensagens e lembretes automáticos</p>
                  <p className="text-xs text-blue-600">45 mensagens enviadas hoje</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Telegram Bot</h4>
                  <p className="text-sm text-gray-600">Alertas e notificações instantâneas</p>
                  <p className="text-xs text-purple-600">12 alertas enviados hoje</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-card p-6 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Logs de Integração - Últimas 24h</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">Google Calendar - Sync automático</p>
                  <p className="text-xs text-gray-600">3 novos agendamentos sincronizados</p>
                </div>
                <span className="text-xs text-gray-500">há 5 min</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Mail className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">Email - Lembrete enviado</p>
                  <p className="text-xs text-gray-600">Consulta de Maria Silva às 14:00</p>
                </div>
                <span className="text-xs text-gray-500">há 15 min</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">WhatsApp - Confirmação recebida</p>
                  <p className="text-xs text-gray-600">Cliente confirmou agendamento via WhatsApp</p>
                </div>
                <span className="text-xs text-gray-500">há 32 min</span>
              </div>
            </div>
          </div>

          {(selectedCategory === 'medico' || selectedCategory === 'pet') && (
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <Users className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Doctoralia - Sincronização completa</p>
                    <p className="text-xs text-gray-600">2 novos pacientes importados</p>
                  </div>
                  <span className="text-xs text-gray-500">há 1 hora</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-800">Outlook Calendar - Erro de conexão</p>
                  <p className="text-xs text-gray-600">Token de acesso expirado, reconexão necessária</p>
                </div>
                <span className="text-xs text-gray-500">há 2 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificacoes = () => (
    <div className="animate-fade-in">
      <div className="content-grid">
        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Configurações de Email</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lembretes por Email</span>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confirmações Automáticas</span>
              <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Telegram e WhatsApp</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Telegram Habilitado</span>
              <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WhatsApp Business</span>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'agenda': return renderAgenda();
      case 'lembretes': return renderLembretes();
      case 'integracoes': return renderIntegracoes();
      case 'notificacoes': return renderNotificacoes();
      default: return renderAgenda();
    }
  };

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Agendamentos</h1>
        <p className="section-subtitle">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - 
          Gerencie seus agendamentos e lembretes automáticos
        </p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              <p className="text-xs text-blue-600 mt-1">4 pendentes</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Comparecimento</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
              <p className="text-xs text-green-600 mt-1">↑ 5% vs mês anterior</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lembretes Enviados</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
              <p className="text-xs text-purple-600 mt-1">Últimas 24h</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Integrações Ativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(selectedCategory === 'medico' || selectedCategory === 'pet') ? '3' : '2'}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                {(selectedCategory === 'medico' || selectedCategory === 'pet') 
                  ? 'Google, Outlook, Doctoralia' 
                  : 'Google, Outlook'
                }
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

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

      {renderTabContent()}
    </div>
  );
};

export default AgendamentosSection;