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
    queryKey: ['financial', (user as any)?.id],
    queryFn: async () => {
      const result = await apiClient.get('/api/financial');
      console.log('DEBUG useFinancial: Dados retornados da API:', result?.length, 'entradas');
      console.log('DEBUG useFinancial: Receitas totais:', result?.filter((e: any) => e.type === 'income').reduce((total: number, entry: any) => total + Number(entry.amount || 0), 0));
      return result;
    },
    enabled: !!user,
    staleTime: 0, // Força atualização
    refetchOnMount: true
  });

  const createMutation = useMutation({
    mutationFn: async (entry: NewFinancialEntry) => {
      return apiClient.post('/api/financial', entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id] 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, entry }: { id: number, entry: Partial<NewFinancialEntry> }) => {
      return apiClient.put(`/api/financial/${id}`, entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id] 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/financial/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id] 
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