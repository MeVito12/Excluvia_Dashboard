// Hook consolidado para operações de dados
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { 
  Product, NewProduct,
  Category, NewCategory,
  Subcategory, NewSubcategory,
  Sale, NewSale, 
  Client, NewClient,
  Appointment, NewAppointment,
  FinancialEntry, NewFinancialEntry,
  Transfer, NewTransfer,
  MoneyTransfer, NewMoneyTransfer,
  Branch, NewBranch
} from '@shared/schema';

// Função para obter usuário logado
const getCurrentUser = () => {
  try {
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Products - Usando sistema UUID com headers
export const useProducts = (branchId?: number, companyId?: number) => {
  return useQuery<Product[]>({
    queryKey: ['/api/products', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: NewProduct) => apiRequest('/api/products', { method: 'POST', body: JSON.stringify(product) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/products'] })
  });
};

// Categories - Usando sistema UUID com headers
export const useCategories = (companyId?: number) => {
  return useQuery<Category[]>({
    queryKey: ['/api/categories', companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: NewCategory) => apiRequest('/api/categories', { method: 'POST', body: JSON.stringify(category) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/categories'] })
  });
};

// Subcategories - Usando sistema UUID com headers
export const useSubcategories = (companyId?: number) => {
  return useQuery<Subcategory[]>({
    queryKey: ['/api/subcategories', companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subcategory: NewSubcategory) => apiRequest('/api/subcategories', { method: 'POST', body: JSON.stringify(subcategory) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subcategories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    }
  });
};

// Sales - Usando sistema UUID com headers  
export const useSales = (branchId?: number, companyId?: number) => {
  return useQuery<Sale[]>({
    queryKey: ['/api/sales', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sale: NewSale) => apiRequest('/api/sales', { method: 'POST', body: JSON.stringify(sale) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });
};

// Clients - Usando sistema UUID com headers
export const useClients = (branchId?: number, companyId?: number) => {
  return useQuery<Client[]>({
    queryKey: ['/api/clients', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: NewClient) => apiRequest('/api/clients', { method: 'POST', body: JSON.stringify(client) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/clients'] })
  });
};

// Appointments - Usando sistema UUID com headers
export const useAppointments = (branchId?: number, companyId?: number) => {
  return useQuery<Appointment[]>({
    queryKey: ['/api/appointments', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointment: NewAppointment) => apiRequest('/api/appointments', { method: 'POST', body: JSON.stringify(appointment) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/appointments'] })
  });
};

// Financial - Usando sistema UUID com headers
export const useFinancial = (branchId?: number, companyId?: number) => {
  return useQuery<FinancialEntry[]>({
    queryKey: ['/api/financial', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateFinancial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: NewFinancialEntry) => apiRequest('/api/financial', { method: 'POST', body: JSON.stringify(entry) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/financial'] })
  });
};

// Transfers - Usando sistema UUID com headers
export const useTransfers = (branchId?: number, companyId?: number) => {
  return useQuery<Transfer[]>({
    queryKey: ['/api/transfers', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transfer: NewTransfer) => apiRequest('/api/transfers', { method: 'POST', body: JSON.stringify(transfer) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/transfers'] })
  });
};

// Money Transfers - Usando sistema UUID com headers
export const useMoneyTransfers = (branchId?: number, companyId?: number) => {
  return useQuery<MoneyTransfer[]>({
    queryKey: ['/api/money-transfers', branchId, companyId],
    // A queryFn padrão do queryClient já lida com headers automaticamente
  });
};

export const useCreateMoneyTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transfer: NewMoneyTransfer) => apiRequest('/api/money-transfers', { method: 'POST', body: JSON.stringify(transfer) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/money-transfers'] })
  });
};

// Função para simplificar operações de venda do carrinho 
export const useCreateCartSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (saleData: any) => {
      const response = await fetch('/api/sales/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao processar venda');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/financial'] });
    }
  });
};

// Branches
export const useBranches = (companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.company_id;
  
  const params = new URLSearchParams();
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Branch[]>({
    queryKey: ['/api/branches', effectiveCompanyId],
    queryFn: () => fetch(`/api/branches?${params}`).then(res => res.json()),
    enabled: !!effectiveCompanyId
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branch: NewBranch) => apiRequest('/api/branches', { method: 'POST', body: JSON.stringify(branch) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/branches'] })
  });
};

// CUPONS
export const useCoupons = (companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.company_id;
  
  const params = new URLSearchParams();
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery({
    queryKey: ['/api/coupons', effectiveCompanyId],
    queryFn: () => fetch(`/api/coupons?${params}`).then(res => res.json()),
    enabled: !!effectiveCompanyId
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiRequest('/api/coupons', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/coupons'] })
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (couponCode: string) => {
      const response = await fetch(`/api/coupons/validate/${couponCode}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Cupom inválido');
      }
      return response.json();
    }
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { couponId: number; saleAmount: number }) => {
      const response = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao aplicar cupom');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/coupons'] });
    }
  });
};