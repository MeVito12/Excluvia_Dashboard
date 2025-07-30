import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MoneyTransfer, NewMoneyTransfer } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export function useMoneyTransfers() {
  const queryClient = useQueryClient();

  const { data: moneyTransfers = [], isLoading, error } = useQuery({
    queryKey: ['/api/money-transfers'],
  });

  const createMutation = useMutation({
    mutationFn: (transfer: NewMoneyTransfer) => 
      apiRequest('/api/money-transfers', { method: 'POST', body: JSON.stringify(transfer) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, transfer }: { id: number; transfer: Partial<MoneyTransfer> }) =>
      apiRequest(`/api/money-transfers/${id}`, { method: 'PUT', body: JSON.stringify(transfer) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    },
  });

  return {
    moneyTransfers,
    isLoading,
    error,
    createMoneyTransfer: createMutation.mutateAsync,
    updateMoneyTransfer: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}