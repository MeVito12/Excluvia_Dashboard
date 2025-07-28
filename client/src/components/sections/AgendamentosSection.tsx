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
  AlertTriangle
} from 'lucide-react';

// Removed getAppointmentData function - now using centralized mock data

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
    const appointment = appointments.find(app => app.id === appointmentId);
    if (appointment) {
      showAlert({
        title: `Editando: ${appointment.title}`,
        description: "Funcionalidade em desenvolvimento. Em breve você poderá editar compromissos.",
        variant: "default"
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
      showAlert({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios"
      });
      return;
    }
    
    showAlert({
      title: "Compromisso Criado",
      description: "O agendamento foi criado com sucesso",
      variant: "success"
    });
    setShowAddModal(false);
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
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10" />
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
                    showAlert({
                      title: `Visualizando Compromisso`,
                      description: `${appointment.title}\nCliente: ${appointment.client}\nData: ${appointment.date} às ${appointment.time}\nStatus: ${appointment.status === 'scheduled' ? 'Agendado' : 'Concluído'}`,
                      variant: "default"
                    });
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





  return (
    <div className="app-section">
      <div className="section-header">
        <h1 className="section-title">Agendamentos</h1>
        <p className="section-subtitle">
          {categories.find(c => c.value === selectedCategory)?.label || 'Categoria Selecionada'} - 
          Gerencie seus agendamentos e lembretes automáticos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{appointments?.length || 0}</p>
              <p className="text-xs text-blue-600 mt-1">{appointments?.filter(a => a.status === 'scheduled').length || 0} pendentes</p>
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