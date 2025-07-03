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
      {/* Quadro único de Compromissos - formato uniforme */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-black">Compromissos</h3>
          <button 
            onClick={addNewAppointment}
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
            <div key={appointment.id} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">{appointment.title}</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{appointment.id}</span>
                    </div>
                    <p className="text-sm text-gray-600">Cliente: {appointment.client}</p>
                    <p className="text-sm text-gray-500">Data: {appointment.date} às {appointment.time}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Tipo: {appointment.type === 'reuniao' ? 'Reunião' : 
                             appointment.type === 'consulta' ? 'Consulta' : 'Follow-up'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.status === 'scheduled' ? 'Agendado' : 
                       appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        alert(`👁️ Visualizando compromisso:\n\n${appointment.title}\nCliente: ${appointment.client}\nData: ${appointment.date} às ${appointment.time}\nStatus: ${appointment.status === 'scheduled' ? 'Agendado' : 'Concluído'}`);
                      }}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Visualizar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => editAppointment(appointment.id)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Editar compromisso"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    {appointment.status === 'scheduled' && (
                      <button 
                        onClick={() => markAsCompleted(appointment.id)}
                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
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