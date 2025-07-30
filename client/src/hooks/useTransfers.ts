import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';

import type { Transfer, NewTransfer } from '@shared/schema';

export const useTransfers = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();

  const query = useQuery({
    queryKey: ['transfers', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/transfers?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (transfer: NewTransfer) => {
      return apiClient.post('/api/transfers', transfer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['transfers', (user as any)?.id, selectedCategory] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['products', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, transfer }: { id: number, transfer: Partial<NewTransfer> }) => {
      return apiClient.put(`/api/transfers/${id}`, transfer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['transfers', (user as any)?.id, selectedCategory] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['products', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/transfers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['transfers', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    transfers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createTransfer: createMutation.mutate,
    updateTransfer: updateMutation.mutate,
    deleteTransfer: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};