import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Sale {
  id: number;
  productId: number;
  clientId: number;
  quantity: number;
  totalPrice: number;
  paymentMethod?: string;
  businessCategory: string;
  userId: number;
  saleDate: Date;
}

export interface NewSale {
  productId: number;
  clientId: number;
  quantity: number;
  totalPrice: number;
  paymentMethod?: string;
  businessCategory: string;
  userId: number;
  saleDate: Date;
}

export function useSales(userId: number, businessCategory: string) {
  const queryClient = useQueryClient();
  const queryKey = ['sales', userId, businessCategory];

  // Buscar vendas
  const { data: sales = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetch(`/api/sales?userId=${userId}&businessCategory=${businessCategory}`)
      .then(res => res.json())
  });

  // Criar venda
  const createSaleMutation = useMutation({
    mutationFn: (saleData: NewSale) => 
      apiRequest('/api/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      // Invalidar cache financeiro também já que vendas geram entradas automáticas
      queryClient.invalidateQueries({ queryKey: ['financial'] });
    }
  });

  return {
    sales,
    isLoading,
    error,
    createSale: createSaleMutation.mutate,
    isCreating: createSaleMutation.isPending,
  };
}