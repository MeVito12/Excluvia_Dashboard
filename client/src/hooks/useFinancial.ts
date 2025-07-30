import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';

import type { FinancialEntry, NewFinancialEntry } from '@shared/schema';

export const useFinancial = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();

  const query = useQuery({
    queryKey: ['financial', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/financial?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (entry: NewFinancialEntry) => {
      return apiClient.post('/api/financial', entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, entry }: { id: number, entry: Partial<NewFinancialEntry> }) => {
      return apiClient.put(`/api/financial/${id}`, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/financial/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    entries: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createEntry: createMutation.mutate,
    updateEntry: updateMutation.mutate,
    deleteEntry: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};