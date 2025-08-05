import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        console.log('[QUERY-CLIENT] 🚀 === STARTING REQUEST ===');
        console.log('[QUERY-CLIENT] 🔗 QueryKey:', queryKey);
        
        // Fallback direto - se a função falhar, uso direto do localStorage
        let userId = null;
        try {
          userId = getCurrentUserId();
          console.log('[QUERY-CLIENT] 📋 getUserId result:', userId);
        } catch (e) {
          console.error('[QUERY-CLIENT] ❌ getUserId failed:', e);
        }
        
        // Fallback absoluto
        if (!userId) {
          console.log('[QUERY-CLIENT] 🔄 Using fallback method');
          try {
            const raw = localStorage.getItem('currentUser');
            if (raw) {
              const parsed = JSON.parse(raw);
              userId = parsed.id;
              console.log('[QUERY-CLIENT] 🎯 Fallback userId:', userId);
            }
          } catch (e) {
            console.error('[QUERY-CLIENT] ❌ Fallback failed:', e);
          }
        }
        
        const url = Array.isArray(queryKey) ? queryKey.join('/') : queryKey;
        console.log('[QUERY-CLIENT] 🌐 Final URL:', url);
        console.log('[QUERY-CLIENT] 🔑 Final userId:', userId);
        
        if (!userId) {
          console.error('[QUERY-CLIENT] ❌ CRITICAL: No userId available');
          throw new Error('Authentication required');
        }
        
        console.log('[QUERY-CLIENT] ✅ Making authenticated request');
        
        const response = await fetch(url as string, {
          headers: {
            'x-user-id': userId
          }
        });
        
        console.log('[QUERY-CLIENT] 📡 Response:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('[QUERY-CLIENT] ✅ SUCCESS! Received data:', { 
          type: typeof data, 
          isArray: Array.isArray(data), 
          length: Array.isArray(data) ? data.length : 'not array',
          firstItem: Array.isArray(data) && data.length > 0 ? data[0] : 'no items',
          sample: Array.isArray(data) ? data.slice(0, 2) : data
        });
        
        return data;
      },
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Função para obter userId atual (UUID-aware) - VERSÃO SIMPLIFICADA
function getCurrentUserId(): string | null {
  console.log('[QUERY-CLIENT] 🔧 getCurrentUserId called');
  
  try {
    const userData = localStorage.getItem('currentUser');
    console.log('[QUERY-CLIENT] 🔍 Raw localStorage:', userData);
    
    if (!userData) {
      console.log('[QUERY-CLIENT] ❌ No userData in localStorage');
      return null;
    }
    
    const parsed = JSON.parse(userData);
    console.log('[QUERY-CLIENT] 📊 Parsed data:', parsed);
    
    const userId = parsed?.id;
    console.log('[QUERY-CLIENT] 🎯 Extracted userId:', userId);
    
    return userId || null;
  } catch (error) {
    console.error('[QUERY-CLIENT] ❌ Error:', error);
    return null;
  }
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