import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import type { Sale, NewSale } from '@shared/schema';

export const useSales = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();

  const query = useQuery({
    queryKey: ['sales', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/sales?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (sale: NewSale) => {
      return apiClient.post('/api/sales', sale);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['sales', (user as any)?.id, selectedCategory] 
      });
      // Invalidar também produtos e financeiro pois vendas afetam estoque e geram entradas
      queryClient.invalidateQueries({ 
        queryKey: ['products', (user as any)?.id, selectedCategory] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['financial', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    sales: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createSale: createMutation.mutate,
    isCreating: createMutation.isPending
  };
};