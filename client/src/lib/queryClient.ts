import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const userId = getCurrentUserId();
        const url = Array.isArray(queryKey) ? queryKey.join('/') : queryKey;
        const response = await fetch(url as string, {
          headers: {
            'x-user-id': userId || ''
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      },
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Função para obter userId atual (UUID-aware)
function getCurrentUserId(): string | null {
  try {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const user = JSON.parse(userData);
      // Priorizar UUID se existir, senão usar ID integer
      return user.uuid?.toString() || user.id?.toString();
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }
  return null;
}

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const userId = getCurrentUserId();
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId || '',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};