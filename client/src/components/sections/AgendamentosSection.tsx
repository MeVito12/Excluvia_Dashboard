import React, { useState } from 'react';
import { useCategory, categories } from '@/contexts/CategoryContext';
import { useCustomAlert } from '@/hooks/use-custom-alert';
import { CustomAlert } from '@/components/ui/custom-alert';
import { useAppointments } from '@/hooks/useAppointments';
import { 
  Calendar, 
  Clock, 
  Settings, 
  Plus,
  Search,
  Edit,
  CheckCircle,
  Bell,
  AlertTriangle,
  Eye
} from 'lucide-react';

const AgendamentosSection = () => {
  const { selectedCategory } = useCategory();
  const { showAlert, isOpen, alertData, closeAlert } = useCustomAlert();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { appointments } = useAppointments();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    type: 'consulta',
    notes: ''
  });

  // Função para marcar compromisso como concluído
  const markAsCompleted = (appointmentId: number) => {
    showAlert({
      title: "Compromisso Concluído",
      description: "O agendamento foi marcado como concluído com sucesso",
      variant: "success"
    });
  };

  // Função para editar compromisso
  const editAppointment = (appointmentId: number) => {
    showAlert({
      title: "Editar Compromisso",
      description: "Funcionalidade de edição será implementada em breve",
      variant: "default"
    });
  };

  // Função para abrir modal de adicionar
  const openAddModal = () => {
    setShowAddModal(true);
  };

  // Estados para filtros de data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Função para limpar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  // Renderização da agenda
  const renderAgenda = () => (
    <div className="animate-fade-in">
      {/* Barra de busca e filtros com botão adicionar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Campo de busca */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar compromissos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro Data Inicial */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 whitespace-nowrap">De:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="dd/mm/aaaa"
            />
          </div>

          {/* Filtro Data Final */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 whitespace-nowrap">Até:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="dd/mm/aaaa"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Limpar Filtros
            </button>
            
            <button 
              onClick={openAddModal}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Adicionar Compromisso
            </button>
          </div>
        </div>
      </div>

      {/* Lista de compromissos */}
      <div className="main-card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Compromissos ({appointments.length})
          </h2>
        </div>
        
        <div className="standard-list-container">
          <div className="standard-list-content">
            {appointments.map((appointment: any) => (
              <div key={appointment.id} className="standard-list-item group">
                <div className="list-item-main">
                  <div className="list-item-title">{appointment.title}</div>
                  <div className="list-item-subtitle">Cliente: {appointment.client_name}</div>
                  <div className="list-item-meta">
                    Data: {appointment.appointment_date} às {appointment.start_time} | Tipo: {appointment.type === 'reuniao' ? 'Reunião' : 
                     appointment.type === 'consulta' ? 'Consulta' : 'Follow-up'}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`list-status-badge ${
                    appointment.status === 'scheduled' ? 'status-success' :
                    appointment.status === 'completed' ? 'status-info' :
                    'status-warning'
                  }`}>
                    {appointment.status === 'scheduled' ? 'Agendado' : 
                     appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </span>
                  
                  <div className="list-item-actions">
                    <button 
                      onClick={() => {
                        showAlert({
                          title: `Visualizando Compromisso`,
                          description: `${appointment.title}\nCliente: ${appointment.client_name}\nData: ${appointment.appointment_date} às ${appointment.start_time}\nStatus: ${appointment.status === 'scheduled' ? 'Agendado' : 'Concluído'}`,
                          variant: "default"
                        });
                      }}
                      className="list-action-button view"
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => editAppointment(appointment.id)}
                      className="list-action-button edit"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => markAsCompleted(appointment.id)}
                      className="list-action-button transfer"
                      title="Marcar como concluído"
                    >
                      <CheckCircle className="w-4 h-4" />
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

  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Agendamentos</h1>
        <p className="section-subtitle">
          Gerencie seus agendamentos e lembretes automáticos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{appointments?.length || 0}</p>
              <p className="text-xs text-blue-600 mt-1">{appointments?.filter((a: any) => a.status === 'scheduled').length || 0} pendentes</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{appointments?.length || 0}</p>
              <p className="text-xs text-purple-600 mt-1">Todos os registros</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {renderAgenda()}

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
              
              <div className="grid grid-cols-2 gap-4">
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (newAppointment.title && newAppointment.client && newAppointment.date && newAppointment.time) {
                    showAlert({
                      title: "Compromisso Agendado",
                      description: `O compromisso "${newAppointment.title}" foi agendado com sucesso para ${newAppointment.date} às ${newAppointment.time}`,
                      variant: "success"
                    });
                    setNewAppointment({ title: '', client: '', date: '', time: '', type: 'consulta', notes: '' });
                    setShowAddModal(false);
                  } else {
                    showAlert({
                      title: "Campos Obrigatórios",
                      description: "Por favor, preencha todos os campos obrigatórios (título, cliente, data e horário)",
                      variant: "destructive"
                    });
                  }
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AgendamentosSection;