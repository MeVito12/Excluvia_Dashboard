// Schema definitions for Supabase integration
// These types will be used to interface with multiple Supabase databases
import { z } from "zod";

// User Types
export interface User {
  id: number;
  username: string;
  password: string;
}

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// Appointment Types
export interface Appointment {
  id: number;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  userId: number;
  scheduledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const insertAppointmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  location: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientPhone: z.string().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']).default('scheduled'),
  userId: z.number(),
  scheduledAt: z.date(),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// Reminder Types
export interface Reminder {
  id: number;
  appointmentId: number;
  reminderType: 'email' | 'telegram' | 'whatsapp';
  reminderTime: Date;
  sent: boolean;
  createdAt: Date;
}

export const insertReminderSchema = z.object({
  appointmentId: z.number(),
  reminderType: z.enum(['email', 'telegram', 'whatsapp']),
  reminderTime: z.date(),
  sent: z.boolean().default(false),
});

export type InsertReminder = z.infer<typeof insertReminderSchema>;

// Integration Settings Types
export interface IntegrationSettings {
  id: number;
  userId: number;
  platform: 'google_calendar' | 'doctoralia' | 'outlook';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  isActive: boolean;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export const insertIntegrationSettingsSchema = z.object({
  userId: z.number(),
  platform: z.enum(['google_calendar', 'doctoralia', 'outlook']),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.date().optional(),
  isActive: z.boolean().default(false),
  settings: z.record(z.any()).default({}),
});

export type InsertIntegrationSettings = z.infer<typeof insertIntegrationSettingsSchema>;

// Notification Settings Types
export interface NotificationSettings {
  id: number;
  userId: number;
  emailEnabled: boolean;
  telegramEnabled: boolean;
  whatsappEnabled: boolean;
  emailAddress?: string;
  telegramChatId?: string;
  whatsappNumber?: string;
  defaultReminderTime: number; // minutes before appointment
  createdAt: Date;
  updatedAt: Date;
}

export const insertNotificationSettingsSchema = z.object({
  userId: z.number(),
  emailEnabled: z.boolean().default(false),
  telegramEnabled: z.boolean().default(false),
  whatsappEnabled: z.boolean().default(false),
  emailAddress: z.string().email().optional().or(z.literal("")),
  telegramChatId: z.string().optional(),
  whatsappNumber: z.string().optional(),
  defaultReminderTime: z.number().default(60), // 1 hour default
});

export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;

// Supabase Database Configuration Types
export interface SupabaseConfig {
  id: string;
  name: string;
  url: string;
  anonKey: string;
  serviceKey?: string;
  isActive: boolean;
  description?: string;
}

// Multi-database connection manager types
export interface DatabaseConnection {
  id: string;
  config: SupabaseConfig;
  client: any; // Will be Supabase client instance
  lastConnected: Date;
  isHealthy: boolean;
}

export const supabaseConfigSchema = z.object({
  id: z.string().min(1, "Database ID is required"),
  name: z.string().min(1, "Database name is required"),
  url: z.string().url("Must be a valid URL"),
  anonKey: z.string().min(1, "Anonymous key is required"),
  serviceKey: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

export type InsertSupabaseConfig = z.infer<typeof supabaseConfigSchema>;

// Product/Inventory Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  sku: string;
  category: string;
  price: number;
  cost?: number;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unit: string; // 'unit', 'kg', 'liter', etc.
  supplier?: string;
  expirationDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const insertProductSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  description: z.string().optional(),
  sku: z.string().min(1, "SKU é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.number().min(0, "Preço deve ser positivo"),
  cost: z.number().min(0, "Custo deve ser positivo").optional(),
  currentStock: z.number().min(0, "Estoque atual deve ser positivo"),
  minimumStock: z.number().min(0, "Estoque mínimo deve ser positivo"),
  maximumStock: z.number().min(0, "Estoque máximo deve ser positivo").optional(),
  unit: z.string().default("unit"),
  supplier: z.string().optional(),
  expirationDate: z.date().optional(),
  isActive: z.boolean().default(true),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

// Sale Types
export interface Sale {
  id: number;
  productId: number;
  clientName?: string;
  clientEmail?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  saleDate: Date;
  deliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const insertSaleSchema = z.object({
  productId: z.number(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
  unitPrice: z.number().min(0, "Preço unitário deve ser positivo"),
  totalPrice: z.number().min(0, "Preço total deve ser positivo"),
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).default('pending'),
  saleDate: z.date().default(() => new Date()),
  deliveryDate: z.date().optional(),
  notes: z.string().optional(),
});

export type InsertSale = z.infer<typeof insertSaleSchema>;

// Stock Movement Types
export interface StockMovement {
  id: number;
  productId: number;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  reference?: string; // Sale ID, Purchase Order, etc.
  userId?: number;
  movementDate: Date;
  createdAt: Date;
}

export const insertStockMovementSchema = z.object({
  productId: z.number(),
  type: z.enum(['in', 'out', 'adjustment']),
  quantity: z.number(),
  reason: z.string().min(1, "Motivo é obrigatório"),
  reference: z.string().optional(),
  userId: z.number().optional(),
  movementDate: z.date().default(() => new Date()),
});

export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;

// Client Types
export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  isActive: boolean;
  lastPurchaseDate?: Date;
  totalPurchases: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export const insertClientSchema = z.object({
  name: z.string().min(1, "Nome do cliente é obrigatório"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type InsertClient = z.infer<typeof insertClientSchema>;