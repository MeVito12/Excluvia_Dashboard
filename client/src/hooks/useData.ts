// Hook consolidado para operações de dados
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { 
  Product, NewProduct,
  Sale, NewSale, 
  Client, NewClient,
  Appointment, NewAppointment,
  FinancialEntry, NewFinancialEntry,
  Transfer, NewTransfer,
  MoneyTransfer, NewMoneyTransfer,
  Branch, NewBranch
} from '@shared/schema';

// Products
export const useProducts = (branchId?: number, companyId?: number) => {
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId.toString());
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<Product[]>({
    queryKey: ['/api/products', branchId, companyId],
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

// Sales
export const useSales = (branchId?: number, companyId?: number) => {
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId.toString());
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<Sale[]>({
    queryKey: ['/api/sales', branchId, companyId],
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
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId.toString());
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<Client[]>({
    queryKey: ['/api/clients', branchId, companyId],
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
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId.toString());
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<Appointment[]>({
    queryKey: ['/api/appointments', branchId, companyId],
    queryFn: () => fetch(`/api/appointments?${params}`).then(res => res.json())
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
  const params = new URLSearchParams();
  if (branchId) params.append('branchId', branchId.toString());
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<FinancialEntry[]>({
    queryKey: ['/api/financial', branchId, companyId],
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
export const useTransfers = (companyId?: number) => {
  const params = new URLSearchParams();
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<Transfer[]>({
    queryKey: ['/api/transfers', companyId],
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
export const useMoneyTransfers = (companyId?: number) => {
  const params = new URLSearchParams();
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<MoneyTransfer[]>({
    queryKey: ['/api/money-transfers', companyId],
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
  const params = new URLSearchParams();
  if (companyId) params.append('companyId', companyId.toString());
  
  return useQuery<Branch[]>({
    queryKey: ['/api/branches', companyId],
    queryFn: () => fetch(`/api/branches?${params}`).then(res => res.json())
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (branch: NewBranch) => apiRequest('/api/branches', { method: 'POST', body: JSON.stringify(branch) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/branches'] })
  });
};