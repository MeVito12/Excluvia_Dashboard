import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { FinancialEntry, NewFinancialEntry } from '@shared/schema';

export const useFinancial = (userId: number, businessCategory: string) => {
  const queryClient = useQueryClient();

  const {
    data: financialEntries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/financial', userId, businessCategory],
    queryFn: async (): Promise<FinancialEntry[]> => {
      const response = await fetch(`/api/financial?userId=${userId}&businessCategory=${businessCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch financial entries');
      }
      return response.json();
    }
  });

  const createFinancialEntry = useMutation({
    mutationFn: async (entry: NewFinancialEntry): Promise<FinancialEntry> => {
      return apiRequest('/api/financial', {
        method: 'POST',
        body: JSON.stringify(entry)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });

  const updateFinancialEntry = useMutation({
    mutationFn: async ({ id, entry }: { id: number; entry: Partial<FinancialEntry> }): Promise<FinancialEntry> => {
      return apiRequest(`/api/financial/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entry)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });

  const deleteFinancialEntry = useMutation({
    mutationFn: async (id: number): Promise<void> => {
      return apiRequest(`/api/financial/${id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });

  const payFinancialEntry = useMutation({
    mutationFn: async ({ id, paymentProof }: { id: number; paymentProof: string }): Promise<FinancialEntry> => {
      return apiRequest(`/api/financial/${id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ paymentProof })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });

  const revertFinancialEntry = useMutation({
    mutationFn: async (id: number): Promise<FinancialEntry> => {
      return apiRequest(`/api/financial/${id}/revert`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });

  return {
    financialEntries,
    isLoading,
    error,
    createFinancialEntry,
    updateFinancialEntry,
    deleteFinancialEntry,
    payFinancialEntry,
    revertFinancialEntry
  };
};