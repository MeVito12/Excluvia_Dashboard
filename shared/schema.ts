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
  company_id: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  is_main: boolean;
  is_active: boolean;
  manager_id?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  company_id?: number;
  branch_id?: number;
  role: 'ceo' | 'master' | 'user';
  business_category?: string;
  is_active: boolean;
  created_by?: number;
  last_login?: string;
  created_at: string;
  updated_at: string;
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

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  company_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  color: string;
  company_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase_amount: number;
  max_uses?: number;
  current_uses: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  is_loyalty_reward: boolean;
  company_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category_id: number;
  subcategory_id?: number;
  price: number;
  stock: number;
  min_stock: number;
  barcode?: string;
  manufacturing_date?: string;
  expiry_date?: string;
  is_perishable: boolean;
  for_sale: boolean; // Se está à venda (aparece no cardápio) ou é apenas ingrediente
  company_id: number;
  branch_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
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
  product_id: number;
  client_id?: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method: string;
  sale_date: string;
  notes?: string;
  company_id: number;
  branch_id: number;
  created_by: number;
  created_at: string;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  address?: string;
  client_type: 'individual' | 'company';
  company_id: number;
  branch_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
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
  clientId?: number;
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

export const CategorySchema = z.object({
  name: z.string().min(1, "Nome da categoria é obrigatório"),
  description: z.string().optional(),
  color: z.string().min(1, "Cor é obrigatória"),
});

export const SubcategorySchema = z.object({
  name: z.string().min(1, "Nome da subcategoria é obrigatório"),
  description: z.string().optional(),
  category_id: z.number().positive("Categoria é obrigatória"),
  color: z.string().min(1, "Cor é obrigatória"),
});

export const CouponSchema = z.object({
  code: z.string().min(1, "Código do cupom é obrigatório").max(20, "Código deve ter no máximo 20 caracteres"),
  name: z.string().min(1, "Nome do cupom é obrigatório"),
  description: z.string().optional(),
  discount_type: z.enum(['percentage', 'fixed'], { required_error: "Tipo de desconto é obrigatório" }),
  discount_value: z.number().positive("Valor do desconto deve ser positivo"),
  campaign_type: z.enum(['category_discount', 'seasonal_promotion', 'client_reactivation', 'total_purchase'], { required_error: "Tipo de campanha é obrigatório" }),
  target_categories: z.array(z.number()).optional(), // IDs das categorias elegíveis
  target_products: z.array(z.number()).optional(), // IDs dos produtos elegíveis
  min_purchase_amount: z.number().min(0, "Valor mínimo não pode ser negativo").default(0),
  max_uses: z.number().positive().optional(),
  max_uses_per_client: z.number().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_active: z.boolean().default(true),
  is_loyalty_reward: z.boolean().default(false),
  client_segment: z.enum(['all', 'new', 'inactive', 'vip']).default('all'),
});

export const ProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category_id: z.number().positive("Categoria é obrigatória"),
  subcategory_id: z.number().positive().optional(),
  price: z.number().min(0, "Preço não pode ser negativo"),
  stock: z.number().min(0, "Estoque não pode ser negativo"),
  min_stock: z.number().min(0, "Estoque mínimo não pode ser negativo"),
  barcode: z.string().optional(),
  manufacturing_date: z.string().optional(),
  expiry_date: z.string().optional(),
  is_perishable: z.boolean().default(false),
  for_sale: z.boolean().default(false),
});

export const SaleSchema = z.object({
  productId: z.number().positive(),
  clientId: z.number().positive().optional(),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  unitPrice: z.number().positive("Preço unitário deve ser positivo"),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  notes: z.string().optional(),
});

// Schema para carrinho de compras (múltiplos itens)
export const CartItemSchema = z.object({
  productId: z.number().positive("Produto é obrigatório"),
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  unitPrice: z.number().positive("Preço unitário deve ser positivo"),
  totalPrice: z.number().positive("Preço total deve ser positivo"),
  barcode: z.string().optional(),
});

export const SaleCartSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Carrinho deve ter pelo menos um item"),
  clientId: z.number().positive("Cliente é obrigatório").optional(),
  clientName: z.string().optional(),
  subtotal: z.number().positive("Subtotal deve ser positivo"),
  discount: z.number().min(0, "Desconto não pode ser negativo").default(0),
  totalAmount: z.number().positive("Total deve ser positivo"),
  paymentMethod: z.enum(['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'boleto']),
  notes: z.string().optional(),
  couponId: z.number().positive().optional(),
  couponDiscount: z.number().min(0, "Desconto do cupom não pode ser negativo").default(0),
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
export type NewCategory = z.infer<typeof CategorySchema>;
export type NewSubcategory = z.infer<typeof SubcategorySchema>;
export type NewProduct = z.infer<typeof ProductSchema>;
export type NewSale = z.infer<typeof SaleSchema>;
export type NewClient = z.infer<typeof ClientSchema>;
export type NewAppointment = z.infer<typeof AppointmentSchema>;
export type NewFinancialEntry = z.infer<typeof FinancialEntrySchema>;
export type NewTransfer = z.infer<typeof TransferSchema>;
export type NewMoneyTransfer = z.infer<typeof MoneyTransferSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type SaleCart = z.infer<typeof SaleCartSchema>;

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