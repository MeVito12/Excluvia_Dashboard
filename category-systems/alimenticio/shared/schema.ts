import { z } from "zod";

// ====================================
// SISTEMA ALIMENTÍCIO - ENTIDADES ESPECÍFICAS
// ====================================

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  deliveryRadius?: number; // raio de entrega em km
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
  role: 'admin' | 'manager' | 'waiter' | 'kitchen' | 'delivery';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Ingredientes
export interface Ingredient {
  id: number;
  name: string;
  unit: string; // kg, l, un, etc.
  category: string;
  currentStock: number;
  minimumStock: number;
  costPerUnit: number;
  supplierId?: number;
  expiryDate?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pratos/Produtos do cardápio
export interface Dish {
  id: number;
  name: string;
  description?: string;
  category: string; // entrada, prato principal, sobremesa, bebida, etc.
  price: number;
  preparationTime: number; // em minutos
  calories?: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  hasGluten: boolean;
  hasLactose: boolean;
  imageUrl?: string;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Receitas (ingredientes do prato)
export interface Recipe {
  id: number;
  dishId: number;
  ingredientId: number;
  quantity: number;
  unit: string;
  createdAt: string;
}

// Mesas
export interface Table {
  id: number;
  number: string;
  capacity: number;
  location?: string; // salão, varanda, etc.
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Clientes
export interface Client {
  id: number;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  preferredDeliveryAddress?: string;
  observations?: string;
  loyaltyPoints?: number;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pedidos
export interface Order {
  id: number;
  clientId?: number;
  tableId?: number;
  userId: number; // garçom/atendente
  type: 'dine_in' | 'delivery' | 'takeout';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  total: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  deliveryAddress?: string;
  estimatedTime?: number;
  specialInstructions?: string;
  companyId: number;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  dishId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  createdAt: string;
}

// Reservas
export interface Reservation {
  id: number;
  clientId: number;
  tableId?: number;
  reservationDate: string;
  reservationTime: string;
  numberOfPeople: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  specialRequests?: string;
  companyId: number;
  createdAt: string;
  updatedAt: string;
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
  category: string; // carnes, verduras, bebidas, etc.
  isActive: boolean;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

// Movimento de estoque
export interface StockMovement {
  id: number;
  ingredientId: number;
  type: 'entry' | 'exit' | 'adjustment' | 'waste';
  quantity: number;
  reason?: string;
  orderId?: number; // se foi usado em um pedido
  userId: number;
  companyId: number;
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
  orderId?: number;
  supplierId?: number;
  userId: number;
  companyId: number;
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// Esquemas de validação Zod
export const dishSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.number().min(0, "Preço deve ser positivo"),
  preparationTime: z.number().min(1, "Tempo de preparo deve ser positivo"),
  isVegetarian: z.boolean(),
  isVegan: z.boolean(),
  hasGluten: z.boolean(),
  hasLactose: z.boolean()
});

export const orderSchema = z.object({
  clientId: z.number().optional(),
  tableId: z.number().optional(),
  type: z.enum(['dine_in', 'delivery', 'takeout']),
  deliveryAddress: z.string().optional(),
  specialInstructions: z.string().optional(),
  items: z.array(z.object({
    dishId: z.number(),
    quantity: z.number().min(1, "Quantidade deve ser positiva"),
    specialInstructions: z.string().optional()
  })).min(1, "Pelo menos um item é obrigatório")
});

export const clientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "Telefone é obrigatório"),
  address: z.string().optional(),
  preferredDeliveryAddress: z.string().optional(),
  observations: z.string().optional()
});

export const ingredientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  currentStock: z.number().min(0, "Estoque deve ser positivo"),
  minimumStock: z.number().min(0, "Estoque mínimo deve ser positivo"),
  costPerUnit: z.number().min(0, "Custo deve ser positivo")
});

export type DishInsert = z.infer<typeof dishSchema>;
export type OrderInsert = z.infer<typeof orderSchema>;
export type ClientInsert = z.infer<typeof clientSchema>;
export type IngredientInsert = z.infer<typeof ingredientSchema>;