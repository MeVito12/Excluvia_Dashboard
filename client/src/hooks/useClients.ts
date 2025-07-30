import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import { useDemo } from '@/contexts/DemoContext';
import type { Client, NewClient } from '@shared/schema';

export const useClients = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();
  const { isDemoMode, demoData } = useDemo();

  const query = useQuery({
    queryKey: ['clients', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.clients || [];
      }
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/clients?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (client: NewClient) => {
      return apiClient.post('/api/clients', client);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['clients', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, client }: { id: number, client: Partial<NewClient> }) => {
      return apiClient.put(`/api/clients/${id}`, client);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['clients', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['clients', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    clients: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};