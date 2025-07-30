import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import { useDemo } from '@/contexts/DemoContext';
import type { Sale, NewSale } from '@shared/schema';

export const useSales = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();
  const { isDemoMode, demoData } = useDemo();

  const query = useQuery({
    queryKey: ['sales', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      if (isDemoMode && demoData) {
        return demoData.sales || [];
      }
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/sales?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (sale: NewSale) => {
      if (isDemoMode) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ 
              success: true, 
              data: { ...sale, id: Math.floor(Math.random() * 1000) + 10000 },
              message: 'Venda registrada com sucesso (Demo)' 
            });
          }, 500);
        });
      }
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