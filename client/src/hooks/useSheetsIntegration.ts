import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SheetsProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  manufacturingDate: string;
  expiryDate?: string;
  supplier: string;
  barcode: string;
  location: string;
  minimumStock: number;
  status: string;
  lastUpdated: string;
  lastMovement: string;
}

interface SheetsStats {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
}

// Hook para integração com Google Sheets
export const useSheetsIntegration = () => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  // Query para obter produtos da planilha
  const {
    data: sheetsProducts,
    isLoading: isLoadingProducts,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['sheets', 'products'],
    queryFn: async (): Promise<SheetsProduct[]> => {
      const response = await fetch('/api/sheets/products');
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos da planilha');
      }
      const data = await response.json();
      return data.products || [];
    },
    enabled: isInitialized
  });

  // Query para estatísticas da planilha
  const {
    data: sheetsStats,
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['sheets', 'stats'],
    queryFn: async (): Promise<SheetsStats> => {
      const response = await fetch('/api/sheets/stats');
      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas da planilha');
      }
      const data = await response.json();
      return data.stats;
    },
    enabled: isInitialized
  });

  // Mutation para inicializar planilha
  const initSheetsMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/sheets/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Erro ao inicializar planilha');
      }
      return response.json();
    },
    onSuccess: () => {
      setIsInitialized(true);
      queryClient.invalidateQueries({ queryKey: ['sheets'] });
    }
  });

  // Mutation para adicionar produto
  const addProductMutation = useMutation({
    mutationFn: async (product: Partial<SheetsProduct>) => {
      const response = await fetch('/api/sheets/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) {
        throw new Error('Erro ao adicionar produto na planilha');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets'] });
    }
  });

  // Mutation para atualizar estoque
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity, movement }: { id: string; quantity: number; movement: string }) => {
      const response = await fetch(`/api/sheets/products/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity, movement })
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar estoque na planilha');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sheets'] });
    }
  });

  return {
    // Estado
    isInitialized,
    setIsInitialized,
    
    // Dados
    sheetsProducts: sheetsProducts || [],
    sheetsStats,
    
    // Loading states
    isLoadingProducts,
    isLoadingStats,
    isInitializing: initSheetsMutation.isPending,
    isAddingProduct: addProductMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
    
    // Actions
    initializeSheets: initSheetsMutation.mutate,
    addProductToSheets: addProductMutation.mutate,
    updateProductStock: updateStockMutation.mutate,
    refreshProducts: refetchProducts,
    
    // Errors
    initError: initSheetsMutation.error,
    addError: addProductMutation.error,
    updateError: updateStockMutation.error
  };
};