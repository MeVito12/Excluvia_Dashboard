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

// Products
export const useProducts = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  // Se não tiver company_id, não carrega dados (evita mistura)
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Product[]>({
    queryKey: ['/api/products', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/products?${params}`).then(res => res.json())
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: NewProduct) => apiRequest('/api/products', { method: 'POST', body: JSON.stringify(product) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/products'] })
  });
};

// Categories
export const useCategories = (companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Category[]>({
    queryKey: ['/api/categories', effectiveCompanyId],
    queryFn: () => fetch(`/api/categories?${params}`).then(res => res.json()),
    enabled: !!effectiveCompanyId
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: NewCategory) => apiRequest('/api/categories', { method: 'POST', body: JSON.stringify(category) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/categories'] })
  });
};

// Subcategories
export const useSubcategories = (companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Subcategory[]>({
    queryKey: ['/api/subcategories', effectiveCompanyId],
    queryFn: () => fetch(`/api/subcategories?${params}`).then(res => res.json()),
    enabled: !!effectiveCompanyId
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

// Sales
export const useSales = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Sale[]>({
    queryKey: ['/api/sales', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/sales?${params}`).then(res => res.json())
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

// Clients
export const useClients = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Client[]>({
    queryKey: ['/api/clients', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/clients?${params}`).then(res => res.json())
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (client: NewClient) => apiRequest('/api/clients', { method: 'POST', body: JSON.stringify(client) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/clients'] })
  });
};

// Appointments
export const useAppointments = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Appointment[]>({
    queryKey: ['/api/appointments', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/appointments?${params}`).then(res => res.json()),
    enabled: !!effectiveCompanyId
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointment: NewAppointment) => apiRequest('/api/appointments', { method: 'POST', body: JSON.stringify(appointment) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/appointments'] })
  });
};

// Financial
export const useFinancial = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<FinancialEntry[]>({
    queryKey: ['/api/financial', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/financial?${params}`).then(res => res.json())
  });
};

export const useCreateFinancial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (entry: NewFinancialEntry) => apiRequest('/api/financial', { method: 'POST', body: JSON.stringify(entry) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/financial'] })
  });
};

// Transfers
export const useTransfers = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<Transfer[]>({
    queryKey: ['/api/transfers', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/transfers?${params}`).then(res => res.json())
  });
};

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transfer: NewTransfer) => apiRequest('/api/transfers', { method: 'POST', body: JSON.stringify(transfer) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/transfers'] })
  });
};

// Money Transfers
export const useMoneyTransfers = (branchId?: number, companyId?: number) => {
  const user = getCurrentUser();
  const effectiveCompanyId = companyId || user?.companyId;
  if (!effectiveCompanyId) return { data: [], isLoading: false, error: 'Usuário sem empresa associada' };
  
  const params = new URLSearchParams();
  if (branchId) params.append('branch_id', branchId.toString());
  if (effectiveCompanyId) params.append('company_id', effectiveCompanyId.toString());
  
  return useQuery<MoneyTransfer[]>({
    queryKey: ['/api/money-transfers', branchId, effectiveCompanyId],
    queryFn: () => fetch(`/api/money-transfers?${params}`).then(res => res.json())
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