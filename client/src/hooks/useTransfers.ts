import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transfer, NewTransfer, Branch } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useCategory } from "@/contexts/CategoryContext";
import { useApiClient } from "@/lib/apiClient";

export const useTransfers = () => {
  const { user } = useAuth();
  const { selectedCategory } = useCategory();
  const queryClient = useQueryClient();
  const apiClient = useApiClient();

  // Query para buscar transferências
  const {
    data: transfers = [],
    isLoading: isLoadingTransfers,
    error: transfersError,
  } = useQuery({
    queryKey: ['transfers', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory,
      });
      return apiClient.get(`/api/transfers?${params}`);
    },
    enabled: !!(user && selectedCategory),
  });

  // Query para buscar filiais
  const {
    data: branches = [],
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useQuery({
    queryKey: ['branches', (user as any)?.id, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams({
        businessCategory: selectedCategory,
      });
      return apiClient.get(`/api/branches?${params}`);
    },
    enabled: !!(user && selectedCategory),
  });

  // Mutation para criar transferência
  const createTransferMutation = useMutation({
    mutationFn: async (transferData: NewTransfer) => {
      return apiClient.post('/api/transfers', transferData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['transfers', (user as any)?.id, selectedCategory] 
      });
    }
  });

  // Mutation para atualizar transferência
  const updateTransferMutation = useMutation({
    mutationFn: async ({ id, transferData }: { id: number, transferData: Partial<NewTransfer> }) => {
      return apiClient.put(`/api/transfers/${id}`, transferData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['transfers', (user as any)?.id, selectedCategory] 
      });
    }
  });

  return {
    transfers,
    branches,
    isLoadingTransfers,
    isLoadingBranches,
    transfersError,
    branchesError,
    createTransfer: createTransferMutation.mutate,
    updateTransfer: updateTransferMutation.mutate,
    isCreatingTransfer: createTransferMutation.isPending,
    isUpdatingTransfer: updateTransferMutation.isPending
  };
};