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
  MessageSquare
} from 'lucide-react';

const AgendamentosSection = () => {
  const { selectedCategory } = useCategory();
  const [activeTab, setActiveTab] = useState('agenda');
  const [searchTerm, setSearchTerm] = useState('');

  // Tabs do sistema
  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'lembretes', label: 'Lembretes', icon: Clock },
    { id: 'integracoes', label: 'Integrações', icon: Settings },
    { id: 'notificacoes', label: 'Notificações', icon: Mail }
  ];

  // Dados mockados por categoria
  const getAppointmentData = () => {
    if (selectedCategory === 'saude') {
      return [
        { id: 1, title: 'Consulta - Dr. Silva', client: 'João Santos', date: '2024-12-26', time: '09:00', type: 'consulta', status: 'scheduled' },
        { id: 2, title: 'Retorno - Dra. Maria', client: 'Ana Costa', date: '2024-12-26', time: '10:30', type: 'retorno', status: 'scheduled' },
        { id: 3, title: 'Exame - Lab Central', client: 'Carlos Lima', date: '2024-12-27', time: '14:00', type: 'exame', status: 'completed' }
      ];
    } else if (selectedCategory === 'pet') {
      return [
        { id: 1, title: 'Vacinação - Rex', client: 'Maria Silva', date: '2024-12-26', time: '09:00', type: 'vacina', status: 'scheduled' },
        { id: 2, title: 'Consulta - Mimi', client: 'João Pedro', date: '2024-12-26', time: '11:00', type: 'consulta', status: 'scheduled' },
        { id: 3, title: 'Cirurgia - Thor', client: 'Ana Santos', date: '2024-12-27', time: '15:00', type: 'cirurgia', status: 'completed' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, title: 'Reunião - Apresentação', client: 'Empresa ABC', date: '2024-12-26', time: '09:00', type: 'reuniao', status: 'scheduled' },
        { id: 2, title: 'Demonstração - Software', client: 'Tech Corp', date: '2024-12-26', time: '14:00', type: 'demo', status: 'scheduled' },
        { id: 3, title: 'Follow-up - Proposta', client: 'Inovação Ltd', date: '2024-12-27', time: '10:00', type: 'followup', status: 'completed' }
      ];
    }
    return [
      { id: 1, title: 'Agendamento Geral', client: 'Cliente', date: '2024-12-26', time: '09:00', type: 'geral', status: 'scheduled' }
    ];
  };

  const getReminderData = () => {
    if (selectedCategory === 'saude') {
      return [
        { id: 1, title: 'Lembrar consulta Dr. Silva', client: 'João Santos', scheduleFor: '2024-12-25 20:00', type: 'email', status: 'pending' },
        { id: 2, title: 'Confirmar exame Lab Central', client: 'Carlos Lima', scheduleFor: '2024-12-26 08:00', type: 'sms', status: 'sent' }
      ];
    } else if (selectedCategory === 'pet') {
      return [
        { id: 1, title: 'Lembrar vacinação Rex', client: 'Maria Silva', scheduleFor: '2024-12-25 18:00', type: 'email', status: 'pending' },
        { id: 2, title: 'Pré-operatório Thor', client: 'Ana Santos', scheduleFor: '2024-12-26 12:00', type: 'whatsapp', status: 'sent' }
      ];
    } else if (selectedCategory === 'vendas') {
      return [
        { id: 1, title: 'Lembrar reunião Empresa ABC', client: 'Empresa ABC', scheduleFor: '2024-12-25 17:00', type: 'email', status: 'pending' },
        { id: 2, title: 'Preparar demo Tech Corp', client: 'Tech Corp', scheduleFor: '2024-12-26 09:00', type: 'slack', status: 'sent' }
      ];
    }
    return [
      { id: 1, title: 'Lembrete Geral', client: 'Cliente', scheduleFor: '2024-12-25 18:00', type: 'email', status: 'pending' }
    ];
  };

  const renderAgenda = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Agenda de Compromissos</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar agendamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input pl-10"
            />
          </div>
        </div>

        <div className="item-list">
          {getAppointmentData().map((appointment) => (
            <div key={appointment.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{appointment.title}</h4>
                  <p className="text-sm text-gray-600">Cliente: {appointment.client}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    appointment.status === 'scheduled' ? 'badge-primary' : 
                    appointment.status === 'completed' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {appointment.status === 'scheduled' ? 'Agendado' : 
                     appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{appointment.type}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline p-2">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="btn btn-outline p-2">
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLembretes = () => (
    <div className="animate-fade-in">
      <div className="main-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Sistema de Lembretes</h3>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Criar Lembrete
          </button>
        </div>

        <div className="item-list">
          {getReminderData().map((reminder) => (
            <div key={reminder.id} className="list-item">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{reminder.title}</h4>
                  <p className="text-sm text-gray-600">Para: {reminder.client}</p>
                  <p className="text-sm text-gray-600">Enviar em: {reminder.scheduleFor}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${reminder.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                    {reminder.status === 'pending' ? 'Pendente' : 'Enviado'}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{reminder.type}</p>
                </div>
              </div>
              <button className="btn btn-outline p-2">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          ))}
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
                  <p className="text-sm text-gray-600">Sincronização automática</p>
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
                  <h4 className="font-medium text-gray-800">Outlook</h4>
                  <p className="text-sm text-gray-600">Microsoft 365</p>
                </div>
              </div>
              <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-0.5"></div>
              </div>
            </div>

            {selectedCategory === 'saude' && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Doctoralia</h4>
                    <p className="text-sm text-gray-600">Plataforma médica</p>
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
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Configurações de Sync</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sincronização Automática</span>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Notificações Push</span>
              <div className="w-12 h-6 bg-blue-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backup Automático</span>
              <div className="w-12 h-6 bg-green-500 rounded-full flex items-center">
                <div className="w-5 h-5 bg-white rounded-full ml-auto mr-0.5"></div>
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
            
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Antecedência do Lembrete</label>
              <select className="modern-input">
                <option>1 hora antes</option>
                <option>2 horas antes</option>
                <option>1 dia antes</option>
                <option>2 dias antes</option>
              </select>
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
            
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Chat ID do Telegram</label>
              <input
                type="text"
                placeholder="@seuchatid"
                className="modern-input"
              />
            </div>
            
            <button className="btn btn-secondary w-full">
              <MessageSquare className="w-4 h-4" />
              Conectar Telegram
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'agenda':
        return renderAgenda();
      case 'lembretes':
        return renderLembretes();
      case 'integracoes':
        return renderIntegracoes();
      case 'notificacoes':
        return renderNotificacoes();
      default:
        return renderAgenda();
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

      {/* Métricas de Agendamentos */}
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
              <p className="text-sm font-medium text-gray-600">Lembretes Ativos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">28</p>
              <p className="text-xs text-yellow-600 mt-1">6 para enviar</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Bell className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Comparecimento</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
              <p className="text-xs text-green-600 mt-1">+5% este mês</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Integrações Ativas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              <p className="text-xs text-purple-600 mt-1">Google, WhatsApp, Doctoralia</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      <div className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              console.log('Agendamentos tab clicked:', tab.id);
              setActiveTab(tab.id);
            }}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            type="button"
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {renderTabContent()}
    </div>
  );
};

export default AgendamentosSection;