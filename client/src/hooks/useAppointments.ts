import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Appointment {
  id: number;
  userId: number;
  clientId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  status: string;
  notes?: string;
}

export interface NewAppointment {
  userId: number;
  clientId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  status: string;
  notes?: string;
}

export function useAppointments(userId: number) {
  const queryClient = useQueryClient();
  const queryKey = ['appointments', userId];

  // Buscar agendamentos
  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetch(`/api/appointments`)
      .then(res => res.json())
  });

  // Criar agendamento
  const createAppointmentMutation = useMutation({
    mutationFn: (appointmentData: NewAppointment) => 
      apiRequest('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Atualizar agendamento
  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewAppointment> }) =>
      apiRequest(`/api/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Excluir agendamento
  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/appointments/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    appointments,
    isLoading,
    error,
    createAppointment: createAppointmentMutation.mutate,
    updateAppointment: updateAppointmentMutation.mutate,
    deleteAppointment: deleteAppointmentMutation.mutate,
    isCreating: createAppointmentMutation.isPending,
    isUpdating: updateAppointmentMutation.isPending,
    isDeleting: deleteAppointmentMutation.isPending,
  };
}