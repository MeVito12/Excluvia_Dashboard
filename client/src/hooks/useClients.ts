import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessCategory: string;
  userId: number;
  createdAt: Date;
}

export interface NewClient {
  name: string;
  email: string;
  phone: string;
  businessCategory: string;
  userId: number;
}

export function useClients(userId: number, businessCategory: string) {
  const queryClient = useQueryClient();
  const queryKey = ['clients', userId, businessCategory];

  // Buscar clientes
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => fetch(`/api/clients?userId=${userId}&businessCategory=${businessCategory}`)
      .then(res => res.json())
  });

  // Criar cliente
  const createClientMutation = useMutation({
    mutationFn: (clientData: NewClient) => 
      apiRequest('/api/clients', {
        method: 'POST',
        body: JSON.stringify(clientData)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Atualizar cliente
  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NewClient> }) =>
      apiRequest(`/api/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  // Excluir cliente
  const deleteClientMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest(`/api/clients/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
  });

  return {
    clients,
    isLoading,
    error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
}