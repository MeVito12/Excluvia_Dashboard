import { useDemo } from '@/contexts/DemoContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Hook personalizado que intercepta chamadas da API no modo demo
export const useDemoQuery = (queryKey: string[], enabled = true) => {

  return useQuery({
    queryKey,
    enabled
  });
};

export const useDemoMutation = (endpoint: string, options: any = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
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

  switch (endpoint) {
    case '/api/products':
    case '/api/sales':
    case '/api/clients':
    case '/api/appointments':
    case '/api/financial':
    case '/api/transfers':
    case '/api/branches':
      return [{ id: 1, name: 'Matriz - Demo', address: 'Endereço Demo' }];
    default:
      return [];
  }
};

// Função para simular respostas de mutação
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