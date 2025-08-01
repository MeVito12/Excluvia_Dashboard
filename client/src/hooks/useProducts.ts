import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@/lib/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCategory } from '@/contexts/CategoryContext';
import type { Product, NewProduct } from '@shared/schema';

export const useProducts = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { selectedCategory } = useCategory();

  const query = useQuery({
    queryKey: ['products', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory
      });
      return apiClient.get(`/api/products?${params}`);
    },
    enabled: !!(user && selectedCategory)
  });

  const createMutation = useMutation({
    mutationFn: async (product: NewProduct) => {
      return apiClient.post('/api/products', product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, product }: { id: number, product: Partial<NewProduct> }) => {
      return apiClient.put(`/api/products/${id}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products', (user as any)?.id, selectedCategory] 
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['products', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};