import { z } from "zod";

// ====================================
// SISTEMA FARMÁCIA - ENTIDADES ESPECÍFICAS
// ====================================

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  crf?: string; // Conselho Regional de Farmácia
  responsiblePharmacist?: string;
  isActive: boolean;
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
  role: 'admin' | 'pharmacist' | 'attendant';
  crf?: string; // Para farmacêuticos
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Medicamentos e produtos farmacêuticos
export interface Medicine {
  id: number;
  name: string;
  laboratory: string;
  activeIngredient: string;
  dosage: string;
  presentation: string; // comprimido, xarope, pomada, etc.
  barcode?: string;
  registrationNumber?: string; // Registro ANVISA
  category: 'prescription' | 'otc' | 'controlled' | 'generic';
  price: number;
  costPrice: number;
  currentStock: number;
  minimumStock: number;
  batchNumber?: string;
  manufacturingDate?: string;
  expiryDate?: string;
  requiresPrescription: boolean;
  isControlled: boolean;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Clientes/Pacientes
export interface Client {
  id: number;
  name: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  healthInsurance?: string;
  allergies?: string;
  chronicDiseases?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vendas de medicamentos
export interface Sale {
  id: number;
  clientId?: number;
  userId: number;
  total: number;
  paymentMethod: string;
  prescriptionId?: number;
  discount?: number;
  companyId: number;
  status: 'completed' | 'pending' | 'cancelled';
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  medicineId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNumber?: string;
  expiryDate?: string;
  createdAt: string;
}

// Receitas médicas
export interface Prescription {
  id: number;
  clientId: number;
  doctorName: string;
  crm: string;
  prescriptionDate: string;
  validUntil?: string;
  observations?: string;
  isUsed: boolean;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  id: number;
  prescriptionId: number;
  medicineId?: number;
  medicineName: string;
  dosage: string;
  usage: string;
  quantity: number;
  isDispensed: boolean;
  createdAt: string;
}

// Controle de estoque farmacêutico
export interface StockMovement {
  id: number;
  medicineId: number;
  type: 'entry' | 'exit' | 'adjustment' | 'expiry' | 'return';
  quantity: number;
  reason?: string;
  batchNumber?: string;
  expiryDate?: string;
  userId: number;
  companyId: number;
  createdAt: string;
}

// Fornecedores farmacêuticos
export interface Supplier {
  id: number;
  name: string;
  cnpj?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  isActive: boolean;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Financeiro específico para farmácia
export interface FinancialEntry {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  paymentMethod?: string;
  saleId?: number;
  supplierId?: number;
  userId: number;
  companyId: number;
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// Esquemas de validação Zod
export const medicineSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  laboratory: z.string().min(1, "Laboratório é obrigatório"),
  activeIngredient: z.string().min(1, "Princípio ativo é obrigatório"),
  dosage: z.string().min(1, "Dosagem é obrigatória"),
  presentation: z.string().min(1, "Apresentação é obrigatória"),
  category: z.enum(['prescription', 'otc', 'controlled', 'generic']),
  price: z.number().min(0, "Preço deve ser positivo"),
  currentStock: z.number().min(0, "Estoque deve ser positivo"),
  minimumStock: z.number().min(0, "Estoque mínimo deve ser positivo"),
  requiresPrescription: z.boolean(),
  isControlled: z.boolean()
});

export const saleSchema = z.object({
  clientId: z.number().optional(),
  total: z.number().min(0, "Total deve ser positivo"),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  items: z.array(z.object({
    medicineId: z.number(),
    quantity: z.number().min(1, "Quantidade deve ser positiva"),
    unitPrice: z.number().min(0, "Preço unitário deve ser positivo")
  })).min(1, "Pelo menos um item é obrigatório")
});

export const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "Telefone é obrigatório"),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional()
});

export type MedicineInsert = z.infer<typeof medicineSchema>;
export type SaleInsert = z.infer<typeof saleSchema>;
export type ClientInsert = z.infer<typeof clientSchema>;