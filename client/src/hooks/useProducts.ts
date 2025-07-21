import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock?: number;
  isPerishable?: boolean;
  manufacturingDate?: Date;
  expiryDate?: Date;
  businessCategory: string;
  userId: number;
  createdAt: Date;
}

export interface NewProduct {
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock?: number;
  isPerishable?: boolean;
  manufacturingDate?: Date;
  expiryDate?: Date;
  businessCategory: string;
  userId: number;
}

export function useProducts(userId: number, businessCategory: string) {
  const queryClient = useQueryClient();
  const queryKey = ['products', userId, businessCategory];

  // Buscar produtos
  const { data: products = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetch(`/api/products?userId=${userId}&businessCategory=${businessCategory}`)
      .then(res => res.json())
  });

  // Criar produto
  const createProductMutation = useMutation({
    mutationFn: (productData: NewProduct) => 
      apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Atualizar produto
  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewProduct> }) =>
      apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Excluir produto
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/products/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    products,
    isLoading,
    error,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
  };
}