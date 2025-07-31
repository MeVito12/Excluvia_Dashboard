import { z } from "zod";

// ====================================
// HIERARQUIA EMPRESARIAL COMPLETA
// CEO → Empresa → Filial → Usuário
// ====================================

export interface Company {
  id: number;
  name: string;
  businessCategory: string;
  cnpj?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: number;
  companyId: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  isMain: boolean;
  isActive: boolean;
  managerId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  companyId?: number;
  branchId?: number;
  role: 'ceo' | 'master' | 'user';
  businessCategory?: string;
  isActive: boolean;
  createdBy?: number;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermission {
  id: number;
  userId: number;
  section: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  createdAt: string;
}

// ====================================
// ENTIDADES DE NEGÓCIO
// ====================================

export interface Product {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  barcode?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  isPerishable: boolean;
  companyId: number;
  branchId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// Para categoria alimenticia: produtos do cardápio que usam ingredientes do estoque
export interface MenuProduct {
  id: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  ingredients: MenuIngredient[]; // Lista de ingredientes necessários
  isActive: boolean;
  companyId: number;
  branchId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuIngredient {
  id: number;
  menuProductId: number;
  productId: number; // Referência ao produto do estoque (ingrediente)
  quantity: number; // Quantidade necessária do ingrediente
  unit: string; // Unidade de medida (kg, g, L, ml, unidades)
  createdAt: string;
}

export interface Sale {
  id: number;
  productId: number;
  clientId?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: string;
  saleDate: string;
  notes?: string;
  companyId: number;
  branchId: number;
  createdBy: number;
  createdAt: string;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
  clientType: 'individual' | 'company';
  companyId: number;
  branchId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: number;
  title: string;
  description?: string;
  clientId?: number;
  clientName?: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: string;
  notes?: string;
  companyId: number;
  branchId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialEntry {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  paymentMethod?: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate?: string;
  paidDate?: string;
  referenceId?: number;
  referenceType?: string;
  companyId: number;
  branchId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  id: number;
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  transferDate: string;
  receivedDate?: string;
  notes?: string;
  companyId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface MoneyTransfer {
  id: number;
  fromBranchId: number;
  toBranchId: number;
  amount: number;
  description: string;
  transferType: 'operational' | 'investment' | 'emergency' | 'reimbursement';
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  transferDate: string;
  completedDate?: string;
  approvedBy?: number;
  notes?: string;
  companyId: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// ====================================
// SCHEMAS DE VALIDAÇÃO ZOD
// ====================================

export const CompanySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  businessCategory: z.string().min(1, "Categoria é obrigatória"),
  cnpj: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
});

export const BranchSchema = z.object({
  companyId: z.number().positive(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  isMain: z.boolean().default(false),
});

export const UserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  companyId: z.number().positive().optional(),
  branchId: z.number().positive().optional(),
  role: z.enum(['ceo', 'master', 'user']),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.number().positive("Preço deve ser positivo"),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  minStock: z.number().min(0, "Estoque mínimo não pode ser negativo"),
  barcode: z.string().optional(),
  manufacturingDate: z.string().optional(),
  expiryDate: z.string().optional(),
  isPerishable: z.boolean().default(false),
});

export const SaleSchema = z.object({
  productId: z.number().positive(),
  clientId: z.number().positive().optional(),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  unitPrice: z.number().positive("Preço unitário deve ser positivo"),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  notes: z.string().optional(),
});

export const ClientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.string().optional(),
  clientType: z.enum(['individual', 'company']).default('individual'),
});

export const AppointmentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  clientId: z.number().positive().optional(),
  clientName: z.string().optional(),
  appointmentDate: z.string().min(1, "Data é obrigatória"),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().optional(),
  type: z.string().min(1, "Tipo é obrigatório"),
  notes: z.string().optional(),
});

export const FinancialEntrySchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  paymentMethod: z.string().optional(),
  status: z.enum(['paid', 'pending', 'overdue']).default('pending'),
  dueDate: z.string().optional(),
  paidDate: z.string().optional(),
  referenceId: z.number().optional(),
  referenceType: z.string().optional(),
});

export const TransferSchema = z.object({
  productId: z.number().positive(),
  fromBranchId: z.number().positive(),
  toBranchId: z.number().positive(),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  notes: z.string().optional(),
});

export const MoneyTransferSchema = z.object({
  fromBranchId: z.number().positive("Filial de origem é obrigatória"),
  toBranchId: z.number().positive("Filial de destino é obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória"),
  transferType: z.enum(['operational', 'investment', 'emergency', 'reimbursement']),
  notes: z.string().optional(),
});

// ====================================
// TIPOS DERIVADOS
// ====================================

export type NewCompany = z.infer<typeof CompanySchema>;
export type NewBranch = z.infer<typeof BranchSchema>;
export type NewUser = z.infer<typeof UserSchema>;
export type NewProduct = z.infer<typeof ProductSchema>;
export type NewSale = z.infer<typeof SaleSchema>;
export type NewClient = z.infer<typeof ClientSchema>;
export type NewAppointment = z.infer<typeof AppointmentSchema>;
export type NewFinancialEntry = z.infer<typeof FinancialEntrySchema>;
export type NewTransfer = z.infer<typeof TransferSchema>;
export type NewMoneyTransfer = z.infer<typeof MoneyTransferSchema>;

// ====================================
// CONSTANTES
// ====================================

export const BUSINESS_CATEGORIES = [
  'farmacia',
  'pet', 
  'medico',
  'alimenticio',
  'vendas',
  'design',
  'sites'
] as const;

export const USER_ROLES = ['ceo', 'master', 'user'] as const;
export const PAYMENT_METHODS = ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'boleto'] as const;
export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled'] as const;
export const FINANCIAL_STATUSES = ['paid', 'pending', 'overdue'] as const;
export const TRANSFER_STATUSES = ['pending', 'in_transit', 'completed', 'cancelled'] as const;
export const MONEY_TRANSFER_STATUSES = ['pending', 'approved', 'completed', 'rejected'] as const;
export const MONEY_TRANSFER_TYPES = ['operational', 'investment', 'emergency', 'reimbursement'] as const;