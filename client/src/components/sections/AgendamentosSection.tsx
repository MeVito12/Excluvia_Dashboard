import React, { useState } from 'react';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { useToast } from '@/hooks/use-toast';
import { 
  getAppointmentsByCategory,
  type Appointment
} from '@/lib/mockData';
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

// Removed getAppointmentData function - now using centralized mock data

const AgendamentosSection = () => {
  const { selectedCategory } = useCategory();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('agenda');
  const [searchTerm, setSearchTerm] = useState('');
  const [emailReminders, setEmailReminders] = useState(true);
  const [autoConfirmations, setAutoConfirmations] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);

  // Função para alternar configurações de notificação
  const toggleEmailReminders = () => {
    setEmailReminders(!emailReminders);
    toast({
      title: !emailReminders ? "Lembretes por Email Ativados" : "Lembretes por Email Desativados",
      description: !emailReminders 
        ? "Agora você receberá lembretes automáticos por email" 
        : "Os lembretes por email foram desabilitados"
    });
  };

  const toggleAutoConfirmations = () => {
    setAutoConfirmations(!autoConfirmations);
    toast({
      title: !autoConfirmations ? "Confirmações Automáticas Ativadas" : "Confirmações Automáticas Desativadas",
      description: !autoConfirmations 
        ? "Confirmações serão enviadas automaticamente" 
        : "As confirmações automáticas foram desabilitadas"
    });
  };

  const toggleTelegram = () => {
    setTelegramEnabled(!telegramEnabled);
    toast({
      title: !telegramEnabled ? "Telegram Habilitado" : "Telegram Desabilitado",
      description: !telegramEnabled 
        ? "Notificações via Telegram estão ativas" 
        : "Notificações via Telegram foram desabilitadas"
    });
  };

  const toggleWhatsApp = () => {
    setWhatsappEnabled(!whatsappEnabled);
    toast({
      title: !whatsappEnabled ? "WhatsApp Business Ativado" : "WhatsApp Business Desativado",
      description: !whatsappEnabled 
        ? "Notificações via WhatsApp estão ativas" 
        : "Notificações via WhatsApp foram desabilitadas"
    });
  };
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState(() => getAppointmentsByCategory(selectedCategory));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    type: 'consulta',
    notes: ''
  });

  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
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
    toast({
      title: "Compromisso Concluído",
      description: "O agendamento foi marcado como concluído com sucesso"
    });
  };

  // Função para editar compromisso
  const editAppointment = (appointmentId: number) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      toast({
        title: `Editando: ${appointment.title}`,
        description: "Funcionalidade em desenvolvimento. Em breve você poderá editar compromissos."
      });
    }
  };

  // Função para abrir modal de adicionar compromisso
  const openAddModal = () => {
    setNewAppointment({
      title: '',
      client: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      type: 'consulta',
      notes: ''
    });
    setShowAddModal(true);
  };

  // Função para salvar novo compromisso
  const saveNewAppointment = () => {
    if (!newAppointment.title || !newAppointment.client || !newAppointment.date || !newAppointment.time) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha título, cliente, data e horário."
      });
      return;
    }

    const newId = Math.max(...appointments.map(a => a.id)) + 1;
    const appointment = {
      id: newId,
      title: newAppointment.title,
      client: newAppointment.client,
      date: newAppointment.date,
      time: newAppointment.time,
      type: newAppointment.type,
      status: 'scheduled' as const
    };
    
    setAppointments(prev => [...prev, appointment]);
    setShowAddModal(false);
    toast({
      title: "Compromisso Adicionado",
      description: "O novo agendamento foi criado com sucesso"
    });
  };

  const renderAgenda = () => (
    <div className="animate-fade-in">
      {/* Quadro único de Compromissos - formato uniforme */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Compromissos</h3>
          <button 
            onClick={openAddModal}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            + Adicionar Compromisso
          </button>
        </div>

        {/* Barra de busca e filtros */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar compromissos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>Todos os status</option>
            <option>Agendado</option>
            <option>Concluído</option>
            <option>Cancelado</option>
          </select>
        </div>

        {/* Lista de compromissos */}
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="list-card">
              <div className="list-card-header">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="metric-card-icon bg-purple-100 !p-2">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="list-card-title">{appointment.title}</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{appointment.id}</span>
                    </div>
                    <div className="list-card-content">
                      <p>Cliente: {appointment.client}</p>
                      <p>Data: {appointment.date} às {appointment.time}</p>
                      <p>Tipo: {appointment.type === 'reuniao' ? 'Reunião' : 
                               appointment.type === 'consulta' ? 'Consulta' : 'Follow-up'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status === 'scheduled' ? 'Agendado' : 
                     appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </div>
                </div>
              </div>
              
              <div className="list-card-footer">
                <button 
                  onClick={() => {
                    alert(`👁️ Visualizando compromisso:\n\n${appointment.title}\nCliente: ${appointment.client}\nData: ${appointment.date} às ${appointment.time}\nStatus: ${appointment.status === 'scheduled' ? 'Agendado' : 'Concluído'}`);
                  }}
                  className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                  title="Visualizar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button 
                  onClick={() => editAppointment(appointment.id)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={() => markAsCompleted(appointment.id)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Marcar como concluído"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
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
              <button 
                onClick={toggleEmailReminders}
                className={`w-12 h-6 rounded-full flex items-center transition-colors cursor-pointer ${
                  emailReminders ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  emailReminders ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Confirmações Automáticas</span>
              <button 
                onClick={toggleAutoConfirmations}
                className={`w-12 h-6 rounded-full flex items-center transition-colors cursor-pointer ${
                  autoConfirmations ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  autoConfirmations ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="main-card p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Telegram e WhatsApp</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Telegram Habilitado</span>
              <button 
                onClick={toggleTelegram}
                className={`w-12 h-6 rounded-full flex items-center transition-colors cursor-pointer ${
                  telegramEnabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  telegramEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WhatsApp Business</span>
              <button 
                onClick={toggleWhatsApp}
                className={`w-12 h-6 rounded-full flex items-center transition-colors cursor-pointer ${
                  whatsappEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  whatsappEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'agenda': return renderAgenda();
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

      {/* Modal de Adicionar Compromisso */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Adicionar Novo Compromisso
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Consulta Veterinária"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <input
                  type="text"
                  value={newAppointment.client}
                  onChange={(e) => setNewAppointment({ ...newAppointment, client: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nome do cliente"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário *
                  </label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="consulta">Consulta</option>
                  <option value="reuniao">Reunião</option>
                  <option value="followup">Follow-up</option>
                  <option value="emergencia">Emergência</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveNewAppointment}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendamentosSection;