import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transfer, NewTransfer, Branch } from "@shared/schema";
import { useAuth } from "@/contexts/AuthContext";
import { useCategory } from "@/contexts/CategoryContext";

const API_BASE = "/api";

export const useTransfers = () => {
  const { user } = useAuth();
  const { selectedCategory } = useCategory();
  const queryClient = useQueryClient();

  // Query para buscar transferências
  const {
    data: transfers = [],
    isLoading: isLoadingTransfers,
    error: transfersError,
  } = useQuery({
    queryKey: ["/api/transfers", user?.name, selectedCategory],
    queryFn: async () => {
      const userId = user?.name === 'Junior Silva - Coordenador' ? 3 : 1;
      const response = await fetch(
        `${API_BASE}/transfers?userId=${userId}&businessCategory=${selectedCategory}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar transferências");
      }
      return response.json() as Promise<Transfer[]>;
    },
    enabled: !!user?.name && !!selectedCategory,
  });

  // Query para buscar filiais
  const {
    data: branches = [],
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useQuery({
    queryKey: ["/api/branches", user?.name, selectedCategory],
    queryFn: async () => {
      const userId = user?.name === 'Junior Silva - Coordenador' ? 3 : 1;
      const response = await fetch(
        `${API_BASE}/branches?userId=${userId}&businessCategory=${selectedCategory}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar filiais");
      }
      return response.json() as Promise<Branch[]>;
    },
    enabled: !!user?.name && !!selectedCategory,
  });

  // Mutation para criar transferência
  const createTransferMutation = useMutation({
    mutationFn: async (transferData: NewTransfer) => {
      const response = await fetch(`${API_BASE}/transfers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar transferência");
      }

      return response.json() as Promise<Transfer>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transfers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  // Mutation para atualizar transferência (receber/devolver)
  const updateTransferMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      receivedDate, 
      returnDate 
    }: { 
      id: number; 
      status: 'received' | 'returned';
      receivedDate?: Date;
      returnDate?: Date;
    }) => {
      const updateData: Partial<NewTransfer> = {
        status,
        ...(status === 'received' && { receivedDate }),
        ...(status === 'returned' && { returnDate }),
      };

      const response = await fetch(`${API_BASE}/transfers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar transferência");
      }

      return response.json() as Promise<Transfer>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transfers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
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
    isUpdatingTransfer: updateTransferMutation.isPending,
  };
};