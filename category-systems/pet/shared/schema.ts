import { z } from "zod";

// ====================================
// SISTEMA PET & VETERINÁRIO - ENTIDADES ESPECÍFICAS
// ====================================

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  crmv?: string; // Conselho Regional de Medicina Veterinária
  emergencyContact?: string;
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
  role: 'admin' | 'veterinarian' | 'assistant' | 'groomer';
  crmv?: string; // Para veterinários
  specialization?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Donos/Tutores
export interface Owner {
  id: number;
  name: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  cellphone?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  occupation?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pets/Animais
export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other';
  breed?: string;
  gender: 'male' | 'female';
  birthDate?: string;
  weight?: number;
  color?: string;
  microchip?: string;
  isNeutered: boolean;
  bloodType?: string;
  observations?: string;
  photoUrl?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Consultas/Atendimentos
export interface Appointment {
  id: number;
  petId: number;
  ownerId: number;
  veterinarianId: number;
  appointmentDate: string;
  appointmentTime: string;
  type: 'consultation' | 'vaccination' | 'surgery' | 'grooming' | 'emergency' | 'checkup';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  observations?: string;
  duration?: number; // em minutos
  price?: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Histórico médico/Prontuário
export interface MedicalRecord {
  id: number;
  petId: number;
  appointmentId?: number;
  veterinarianId: number;
  recordDate: string;
  type: 'consultation' | 'vaccination' | 'surgery' | 'exam' | 'treatment' | 'prescription';
  complaint?: string; // queixa principal
  symptoms?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  followUpDate?: string;
  observations?: string;
  weight?: number;
  temperature?: number;
  heartRate?: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Vacinas
export interface Vaccination {
  id: number;
  petId: number;
  veterinarianId: number;
  vaccineName: string;
  manufacturer?: string;
  batch?: string;
  applicationDate: string;
  nextDose?: string;
  observations?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Produtos/Serviços
export interface Product {
  id: number;
  name: string;
  description?: string;
  category: 'medication' | 'food' | 'toy' | 'hygiene' | 'accessory' | 'service';
  type: 'product' | 'service';
  price: number;
  costPrice?: number;
  currentStock?: number;
  minimumStock?: number;
  barcode?: string;
  brand?: string;
  expiryDate?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vendas
export interface Sale {
  id: number;
  ownerId?: number;
  petId?: number;
  userId: number;
  total: number;
  discount?: number;
  paymentMethod: string;
  appointmentId?: number;
  companyId: number;
  status: 'completed' | 'pending' | 'cancelled';
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

// Fornecedores
export interface Supplier {
  id: number;
  name: string;
  cnpj?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  category: string; // medicamentos, rações, acessórios, etc.
  isActive: boolean;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Financeiro
export interface FinancialEntry {
  id: number;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  paymentMethod?: string;
  saleId?: number;
  appointmentId?: number;
  supplierId?: number;
  userId: number;
  companyId: number;
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// Esquemas de validação Zod
export const petSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other']),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().optional(),
  weight: z.number().min(0, "Peso deve ser positivo").optional(),
  color: z.string().optional(),
  isNeutered: z.boolean(),
  observations: z.string().optional()
});

export const ownerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional()
});

export const appointmentSchema = z.object({
  petId: z.number().min(1, "Pet é obrigatório"),
  appointmentDate: z.string().min(1, "Data é obrigatória"),
  appointmentTime: z.string().min(1, "Horário é obrigatório"),
  type: z.enum(['consultation', 'vaccination', 'surgery', 'grooming', 'emergency', 'checkup']),
  reason: z.string().min(1, "Motivo é obrigatório"),
  observations: z.string().optional(),
  price: z.number().min(0, "Preço deve ser positivo").optional()
});

export const medicalRecordSchema = z.object({
  type: z.enum(['consultation', 'vaccination', 'surgery', 'exam', 'treatment', 'prescription']),
  complaint: z.string().optional(),
  symptoms: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z.string().optional(),
  observations: z.string().optional(),
  weight: z.number().min(0, "Peso deve ser positivo").optional(),
  temperature: z.number().optional(),
  heartRate: z.number().min(0, "Frequência cardíaca deve ser positiva").optional()
});

export type PetInsert = z.infer<typeof petSchema>;
export type OwnerInsert = z.infer<typeof ownerSchema>;
export type AppointmentInsert = z.infer<typeof appointmentSchema>;
export type MedicalRecordInsert = z.infer<typeof medicalRecordSchema>;