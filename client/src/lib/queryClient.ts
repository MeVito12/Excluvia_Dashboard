import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        console.log('[QUERY-CLIENT] 🚀 Starting request for:', queryKey);
        
        const userId = getCurrentUserId();
        const url = Array.isArray(queryKey) ? queryKey.join('/') : queryKey;
        
        console.log('[QUERY-CLIENT] 🔍 Request details:', { 
          url, 
          userId, 
          hasUserId: !!userId,
          userIdType: typeof userId,
          userIdLength: userId?.length 
        });
        
        // Teste direto do localStorage
        const directTest = localStorage.getItem('currentUser');
        console.log('[QUERY-CLIENT] 🧪 Direct localStorage test:', directTest);
        
        if (!userId) {
          console.error('[QUERY-CLIENT] ❌ No userId - cannot make authenticated request to:', url);
          throw new Error('User not authenticated - userId is null/undefined');
        }
        
        console.log('[QUERY-CLIENT] ✅ Making request with userId:', userId);
        
        const response = await fetch(url as string, {
          headers: {
            'x-user-id': userId
          }
        });
        
        console.log('[QUERY-CLIENT] 📡 Response status:', response.status);
        
        if (!response.ok) {
          console.error('[QUERY-CLIENT] ❌ Request failed:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[QUERY-CLIENT] ✅ Request successful, data length:', Array.isArray(data) ? data.length : 'not array');
        
        return data;
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
    console.log('[QUERY-CLIENT] 🔍 Raw localStorage currentUser:', userData);
    
    if (userData && userData !== 'null' && userData !== 'undefined') {
      const user = JSON.parse(userData);
      console.log('[QUERY-CLIENT] 📊 Parsed user data:', user);
      
      // O sistema UUID salva o UUID diretamente em user.id
      const userId = user.id?.toString();
      console.log('[QUERY-CLIENT] 🎯 Extracted userId:', userId, 'type:', typeof userId);
      
      if (userId && userId !== 'undefined' && userId !== 'null') {
        return userId;
      } else {
        console.log('[QUERY-CLIENT] ❌ userId is null/undefined:', userId);
      }
    } else {
      console.log('[QUERY-CLIENT] ❌ No valid currentUser in localStorage');
    }
  } catch (error) {
    console.error('[QUERY-CLIENT] ❌ Error getting current user:', error);
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