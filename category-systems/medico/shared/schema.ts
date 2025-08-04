import { z } from "zod";

// ====================================
// SISTEMA MÉDICO & SAÚDE - ENTIDADES ESPECÍFICAS
// ====================================

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  cnes?: string; // Cadastro Nacional de Estabelecimentos de Saúde
  specialties?: string; // especialidades da clínica
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
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'technician';
  crm?: string; // Para médicos
  specialty?: string;
  scheduleStart?: string; // horário de início
  scheduleEnd?: string; // horário de fim
  workDays?: string; // dias da semana que trabalha
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Pacientes
export interface Patient {
  id: number;
  name: string;
  cpf?: string;
  rg?: string;
  email?: string;
  phone?: string;
  cellphone?: string;
  birthDate?: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus?: string;
  profession?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  healthInsurance?: string;
  insuranceNumber?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  familyHistory?: string;
  observations?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Consultas/Agendamentos
export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // em minutos
  type: 'consultation' | 'return' | 'emergency' | 'surgery' | 'exam' | 'procedure';
  status: 'scheduled' | 'confirmed' | 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  reason: string;
  observations?: string;
  price?: number;
  healthInsurance?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Prontuário médico
export interface MedicalRecord {
  id: number;
  patientId: number;
  appointmentId?: number;
  doctorId: number;
  recordDate: string;
  type: 'consultation' | 'exam' | 'surgery' | 'prescription' | 'report' | 'referral';
  chiefComplaint?: string; // queixa principal
  historyOfPresentIllness?: string; // história da doença atual
  physicalExamination?: string; // exame físico
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  followUpDate?: string;
  observations?: string;
  vitalSigns?: string; // sinais vitais
  weight?: number;
  height?: number;
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Receitas médicas
export interface Prescription {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  prescriptionDate: string;
  validUntil?: string;
  observations?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  id: number;
  prescriptionId: number;
  medication: string;
  dosage: string;
  usage: string;
  quantity: string;
  createdAt: string;
}

// Exames
export interface Exam {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  examType: string;
  examDate: string;
  requestDate: string;
  laboratory?: string;
  results?: string;
  observations?: string;
  attachmentUrl?: string;
  status: 'requested' | 'collected' | 'processing' | 'ready' | 'delivered';
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Procedimentos
export interface Procedure {
  id: number;
  name: string;
  description?: string;
  category: string;
  duration: number; // em minutos
  price: number;
  requiresAnesthesia: boolean;
  requiresHospitalization: boolean;
  preparationInstructions?: string;
  postProcedureInstructions?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vendas/Faturamento
export interface Sale {
  id: number;
  patientId?: number;
  userId: number;
  total: number;
  discount?: number;
  paymentMethod: string;
  appointmentId?: number;
  healthInsurance?: string;
  insuranceDiscount?: number;
  companyId: number;
  status: 'completed' | 'pending' | 'cancelled';
  saleDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: number;
  saleId: number;
  procedureId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
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
  userId: number;
  companyId: number;
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// Esquemas de validação Zod
export const patientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "Telefone é obrigatório"),
  birthDate: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  currentMedications: z.string().optional(),
  observations: z.string().optional()
});

export const appointmentSchema = z.object({
  patientId: z.number().min(1, "Paciente é obrigatório"),
  doctorId: z.number().min(1, "Médico é obrigatório"),
  appointmentDate: z.string().min(1, "Data é obrigatória"),
  appointmentTime: z.string().min(1, "Horário é obrigatório"),
  duration: z.number().min(15, "Duração mínima de 15 minutos"),
  type: z.enum(['consultation', 'return', 'emergency', 'surgery', 'exam', 'procedure']),
  reason: z.string().min(1, "Motivo é obrigatório"),
  observations: z.string().optional(),
  price: z.number().min(0, "Preço deve ser positivo").optional()
});

export const medicalRecordSchema = z.object({
  type: z.enum(['consultation', 'exam', 'surgery', 'prescription', 'report', 'referral']),
  chiefComplaint: z.string().optional(),
  historyOfPresentIllness: z.string().optional(),
  physicalExamination: z.string().optional(),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  prescription: z.string().optional(),
  observations: z.string().optional(),
  weight: z.number().min(0, "Peso deve ser positivo").optional(),
  height: z.number().min(0, "Altura deve ser positiva").optional(),
  bloodPressure: z.string().optional(),
  heartRate: z.number().min(0, "Frequência cardíaca deve ser positiva").optional(),
  temperature: z.number().optional()
});

export const prescriptionSchema = z.object({
  observations: z.string().optional(),
  items: z.array(z.object({
    medication: z.string().min(1, "Medicamento é obrigatório"),
    dosage: z.string().min(1, "Dosagem é obrigatória"),
    usage: z.string().min(1, "Uso é obrigatório"),
    quantity: z.string().min(1, "Quantidade é obrigatória")
  })).min(1, "Pelo menos um medicamento é obrigatório")
});

export type PatientInsert = z.infer<typeof patientSchema>;
export type AppointmentInsert = z.infer<typeof appointmentSchema>;
export type MedicalRecordInsert = z.infer<typeof medicalRecordSchema>;
export type PrescriptionInsert = z.infer<typeof prescriptionSchema>;