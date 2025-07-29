import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MoneyTransfer, NewMoneyTransfer } from '@shared/schema';

const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': localStorage.getItem('userId') || '1',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }
  
  return response.json();
};

export function useMoneyTransfers() {
  const queryClient = useQueryClient();

  const {
    data: transfers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/money-transfers'],
    queryFn: () => apiRequest('/api/money-transfers')
  });

  const createTransferMutation = useMutation({
    mutationFn: (transfer: NewMoneyTransfer) => 
      apiRequest('/api/money-transfers', {
        method: 'POST',
        body: JSON.stringify(transfer)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    }
  });

  const updateTransferMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MoneyTransfer> }) => 
      apiRequest(`/api/money-transfers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    }
  });

  const deleteTransferMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/money-transfers/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    }
  });

  const approveTransferMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/money-transfers/${id}/approve`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    }
  });

  const completeTransferMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/money-transfers/${id}/complete`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] });
    }
  });

  return {
    transfers,
    isLoading,
    error,
    createTransfer: createTransferMutation.mutateAsync,
    updateTransfer: updateTransferMutation.mutateAsync,
    deleteTransfer: deleteTransferMutation.mutateAsync,
    approveTransfer: approveTransferMutation.mutateAsync,
    completeTransfer: completeTransferMutation.mutateAsync,
    isCreating: createTransferMutation.isPending,
    isUpdating: updateTransferMutation.isPending,
    isDeleting: deleteTransferMutation.isPending,
    isApproving: approveTransferMutation.isPending,
    isCompleting: completeTransferMutation.isPending
  };
}