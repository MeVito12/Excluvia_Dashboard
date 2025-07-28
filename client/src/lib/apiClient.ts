import { useAuth } from '@/contexts/AuthContext';

// Cliente HTTP que automaticamente inclui userId nos headers
export const createApiClient = (userId?: number) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (userId) {
    headers['x-user-id'] = userId.toString();
  }

  return {
    get: async (url: string) => {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    
    post: async (url: string, data: any) => {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    
    put: async (url: string, data: any) => {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    
    delete: async (url: string) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  };
};

// Hook para usar o cliente da API com usuário autenticado
export const useApiClient = () => {
  const { user } = useAuth();
  return createApiClient((user as any)?.id);
};