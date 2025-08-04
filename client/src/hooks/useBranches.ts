import { useQuery } from '@tanstack/react-query';
import { Branch } from '@shared/schema';

const apiRequest = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': localStorage.getItem('userId') || '1',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }
  
  return response.json();
};

export function useBranches() {
  const {
    data: branches = [],
    isLoading,
    error
  } = useQuery<Branch[]>({
    queryKey: ['/api/branches'],
    queryFn: () => apiRequest('/api/branches')
  });

  return {
    branches,
    isLoading,
    error
  };
}