import React, { useState } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { useAppointments } from '@/hooks/useAppointments';
import { 
  Calendar, 
  Clock, 
  Plus,
  Search,
  Edit,
  CheckCircle
} from 'lucide-react';

const AgendamentosSection = () => {
  const { selectedCategory } = useCategory();
  const { appointments } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    client: '',
    date: '',
    time: '',
    type: 'consulta',
    notes: ''
  });

  const markAsCompleted = (appointmentId: number) => {
    alert("Compromisso Concluído");
  };

  const editAppointment = (appointmentId: number) => {
    alert("Funcionalidade em desenvolvimento");
  };

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

  const saveNewAppointment = () => {
    if (!newAppointment.title || !newAppointment.client || !newAppointment.date || !newAppointment.time) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    alert("Compromisso criado com sucesso");
    setShowAddModal(false);
  };

  const filteredAppointments = appointments.filter((appointment: any) =>
    appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-section">
      <div className="section-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
        </div>
        <button 
          onClick={openAddModal}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Compromisso
        </button>
      </div>

      <div className="main-card">
        <div className="space-y-4">
          {/* Busca */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar compromissos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Lista de compromissos */}
          <div className="space-y-2">
            {filteredAppointments.map((appointment: any) => (
              <div key={appointment.id} className="list-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.title}</h3>
                      <p className="text-sm text-gray-600">{appointment.client}</p>
                      <p className="text-sm text-gray-500">{appointment.date} às {appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editAppointment(appointment.id)}
                      className="btn-icon"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => markAsCompleted(appointment.id)}
                      className="btn-icon text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de adicionar compromisso */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Novo Compromisso</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ex: Consulta de rotina"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="consulta">Consulta</option>
                  <option value="retorno">Retorno</option>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={saveNewAppointment}
                className="btn btn-primary flex-1"
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