import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';

import type { Appointment, NewAppointment } from '@shared/schema';

export const useAppointments = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();

  const query = useQuery({
    queryKey: ['appointments', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/appointments?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (appointment: NewAppointment) => {
      return apiClient.post('/api/appointments', appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['appointments', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, appointment }: { id: number, appointment: Partial<NewAppointment> }) => {
      return apiClient.put(`/api/appointments/${id}`, appointment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['appointments', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['appointments', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    appointments: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createAppointment: createMutation.mutate,
    updateAppointment: updateMutation.mutate,
    deleteAppointment: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};