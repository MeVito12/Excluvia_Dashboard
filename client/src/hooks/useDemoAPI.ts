import { useDemo } from '@/contexts/DemoContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Hook personalizado que intercepta chamadas da API no modo demo
export const useDemoQuery = (queryKey: string[], enabled = true) => {
  const { isDemoMode, demoData } = useDemo();

  return useQuery({
    queryKey,
    queryFn: isDemoMode ? () => getDemoData(queryKey[0], demoData) : () => fetch(queryKey[0]).then(res => res.json()),
    enabled
  });
};

export const useDemoMutation = (endpoint: string, options: any = {}) => {
  const { isDemoMode, demoData } = useDemo();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: isDemoMode 
      ? (data: any) => mockMutationResponse(endpoint, data, demoData)
      : (data: any) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
      // Invalidar cache para atualizações
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((key: string[]) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
    },
    ...options
  });
};

// Função para retornar dados mock baseados no endpoint
const getDemoData = (endpoint: string, demoData: any) => {
  if (!demoData) return [];

  switch (endpoint) {
    case '/api/products':
      return demoData.products || [];
    case '/api/sales':
      return demoData.sales || [];
    case '/api/clients':
      return demoData.clients || [];
    case '/api/appointments':
      return demoData.appointments || [];
    case '/api/financial':
      return demoData.financial || [];
    case '/api/transfers':
      return demoData.transfers || [];
    case '/api/branches':
      return [{ id: 1, name: 'Matriz - Demo', address: 'Endereço Demo' }];
    default:
      return [];
  }
};

// Função para simular respostas de mutação
const mockMutationResponse = (endpoint: string, data: any, demoData: any) => {
  // Simular delay de rede
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { ...data, id: Math.floor(Math.random() * 1000) + 10000 },
        message: 'Operação realizada com sucesso (Demo)'
      });
    }, 500);
  });
};

// Hooks específicos para cada seção usando o sistema demo
export const useDemoProducts = () => useDemoQuery(['/api/products']);
export const useDemoSales = () => useDemoQuery(['/api/sales']);
export const useDemoClients = () => useDemoQuery(['/api/clients']);
export const useDemoAppointments = () => useDemoQuery(['/api/appointments']);
export const useDemoFinancial = () => useDemoQuery(['/api/financial']);
export const useDemoTransfers = () => useDemoQuery(['/api/transfers']);
export const useDemoBranches = () => useDemoQuery(['/api/branches']);