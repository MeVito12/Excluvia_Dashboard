// Type definitions for in-memory storage
import { z } from "zod";

// Base Types
export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  businessCategory: string;
  createdAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  minStock?: number;
  isPerishable?: boolean;
  manufacturingDate?: Date;
  expiryDate?: Date;
  businessCategory: string;
  userId: number;
  createdAt: Date;
}

export interface Sale {
  id: number;
  productId: number;
  clientId: number;
  quantity: number;
  totalPrice: number;
  paymentMethod?: string;
  businessCategory: string;
  userId: number;
  saleDate: Date;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessCategory: string;
  userId: number;
  createdAt: Date;
}

export interface Appointment {
  id: number;
  userId: number;
  clientId: number;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  status: string;
  notes?: string;
}

export interface LoyaltyCampaign {
  id: number;
  userId: number;
  businessCategory: string;
  name: string;
  description: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: Date;
}

export interface WhatsAppChat {
  id: number;
  userId: number;
  businessCategory: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastActivity: Date;
  isActive: boolean;
}

export interface StockMovement {
  id: number;
  productId: number;
  movementType: string;
  quantity: number;
  movementDate: Date;
  notes?: string;
}

// Insert Types (without id and auto-generated fields)
export type InsertUser = Omit<User, 'id' | 'createdAt'>;
export type InsertProduct = Omit<Product, 'id' | 'createdAt'>;
export type InsertSale = Omit<Sale, 'id'>;
export type InsertClient = Omit<Client, 'id' | 'createdAt'>;
export type InsertAppointment = Omit<Appointment, 'id'>;
export type InsertLoyaltyCampaign = Omit<LoyaltyCampaign, 'id' | 'createdAt'>;
export type InsertWhatsAppChat = Omit<WhatsAppChat, 'id'>;
export type InsertStockMovement = Omit<StockMovement, 'id'>;

// Validation Schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  businessCategory: z.string().min(2)
});

export const insertProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().min(0),
  minStock: z.number().min(0).optional(),
  isPerishable: z.boolean().optional(),
  manufacturingDate: z.date().optional(),
  expiryDate: z.date().optional(),
  businessCategory: z.string().min(2),
  userId: z.number().positive()
});

export const insertSaleSchema = z.object({
  productId: z.number().positive(),
  clientId: z.number().positive(),
  quantity: z.number().positive(),
  totalPrice: z.number().positive(),
  paymentMethod: z.string().optional(),
  businessCategory: z.string().min(2),
  userId: z.number().positive(),
  saleDate: z.date()
});

export const insertClientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  businessCategory: z.string().min(2),
  userId: z.number().positive()
});

export const insertAppointmentSchema = z.object({
  userId: z.number().positive(),
  clientId: z.number().positive(),
  serviceId: z.number().positive(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.string(),
  notes: z.string().optional()
});