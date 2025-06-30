import { 
  type User, 
  type InsertUser,
  type Appointment,
  type InsertAppointment,
  type Reminder,
  type InsertReminder,
  type IntegrationSettings,
  type InsertIntegrationSettings,
  type NotificationSettings,
  type InsertNotificationSettings,
  type Product,
  type InsertProduct,
  type Sale,
  type InsertSale,
  type StockMovement,
  type InsertStockMovement,
  type Client,
  type InsertClient
} from "@shared/schema";
import { DatabaseConfig, databases } from "./db";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment operations
  getAppointments(userId: number): Promise<Appointment[]>;
  getAppointmentsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  
  // Reminder operations
  getReminders(appointmentId: number): Promise<Reminder[]>;
  getPendingReminders(): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  markReminderSent(id: number): Promise<void>;
  
  // Integration settings
  getIntegrationSettings(userId: number): Promise<IntegrationSettings[]>;
  getIntegrationSettingsByPlatform(userId: number, platform: string): Promise<IntegrationSettings | undefined>;
  createIntegrationSettings(settings: InsertIntegrationSettings): Promise<IntegrationSettings>;
  updateIntegrationSettings(id: number, settings: Partial<InsertIntegrationSettings>): Promise<IntegrationSettings>;
  
  // Notification settings
  getNotificationSettings(userId: number): Promise<NotificationSettings | undefined>;
  createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  updateNotificationSettings(id: number, settings: Partial<InsertNotificationSettings>): Promise<NotificationSettings>;
  
  // Product/Inventory operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getLowStockProducts(): Promise<Product[]>;
  getExpiringProducts(days: number): Promise<Product[]>;
  
  // Sale operations
  getSales(): Promise<Sale[]>;
  getSale(id: number): Promise<Sale | undefined>;
  getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]>;
  getSalesByProduct(productId: number): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale>;
  deleteSale(id: number): Promise<void>;
  getDailySales(date: Date): Promise<Sale[]>;
  getWeeklySales(startDate: Date): Promise<Sale[]>;
  
  // Stock Movement operations
  getStockMovements(productId?: number): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  getStockMovementsByDateRange(startDate: Date, endDate: Date): Promise<StockMovement[]>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: number): Promise<void>;
  getInactiveClients(days: number): Promise<Client[]>;
  getNewClients(days: number): Promise<Client[]>;
}

// Supabase Multi-Database Storage Implementation
// This class will be configured to read from multiple Supabase databases
export class SupabaseMultiStorage implements IStorage {
  
  // This will be implemented to connect to multiple Supabase databases
  private async getDatabase(databaseId?: string) {
    // Implementation for selecting the appropriate Supabase database
    // Will return the specific database connection based on databaseId
    throw new Error('Supabase multi-database connection not yet implemented');
  }

  async getUser(id: number): Promise<User | undefined> {
    // Implementation will query from appropriate Supabase database
    throw new Error('User operations will be implemented with Supabase integration');
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Implementation will query from appropriate Supabase database
    throw new Error('User operations will be implemented with Supabase integration');
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Implementation will create user in appropriate Supabase database
    throw new Error('User operations will be implemented with Supabase integration');
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    // Implementation will query appointments from appropriate Supabase database
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async getAppointmentsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Appointment[]> {
    // Implementation will query appointments by date range from Supabase
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    // Implementation will query specific appointment from Supabase
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    // Implementation will create appointment in appropriate Supabase database
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    // Implementation will update appointment in Supabase
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async deleteAppointment(id: number): Promise<void> {
    // Implementation will delete appointment from Supabase
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async getReminders(appointmentId: number): Promise<Reminder[]> {
    // Implementation will query reminders from Supabase
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async getPendingReminders(): Promise<Reminder[]> {
    // Implementation will query pending reminders from Supabase
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    // Implementation will create reminder in Supabase
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async markReminderSent(id: number): Promise<void> {
    // Implementation will mark reminder as sent in Supabase
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async getIntegrationSettings(userId: number): Promise<IntegrationSettings[]> {
    // Implementation will query integration settings from Supabase
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async getIntegrationSettingsByPlatform(userId: number, platform: string): Promise<IntegrationSettings | undefined> {
    // Implementation will query platform-specific integration settings from Supabase
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async createIntegrationSettings(settings: InsertIntegrationSettings): Promise<IntegrationSettings> {
    // Implementation will create integration settings in Supabase
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async updateIntegrationSettings(id: number, settings: Partial<InsertIntegrationSettings>): Promise<IntegrationSettings> {
    // Implementation will update integration settings in Supabase
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async getNotificationSettings(userId: number): Promise<NotificationSettings | undefined> {
    // Implementation will query notification settings from Supabase
    throw new Error('Notification settings will be implemented with Supabase integration');
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    // Implementation will create notification settings in Supabase
    throw new Error('Notification settings will be implemented with Supabase integration');
  }

  async updateNotificationSettings(id: number, settings: Partial<InsertNotificationSettings>): Promise<NotificationSettings> {
    // Implementation will update notification settings in Supabase
    throw new Error('Notification settings will be implemented with Supabase integration');
  }

  // Product/Inventory operations
  async getProducts(): Promise<Product[]> {
    // Implementation will query products from Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async getProduct(id: number): Promise<Product | undefined> {
    // Implementation will query specific product from Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    // Implementation will query product by SKU from Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    // Implementation will create product in Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    // Implementation will update product in Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async deleteProduct(id: number): Promise<void> {
    // Implementation will delete product from Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async getLowStockProducts(): Promise<Product[]> {
    // Implementation will query products with low stock from Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  async getExpiringProducts(days: number): Promise<Product[]> {
    // Implementation will query products expiring within specified days from Supabase
    throw new Error('Product operations will be implemented with Supabase integration');
  }

  // Sale operations
  async getSales(): Promise<Sale[]> {
    // Implementation will query sales from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async getSale(id: number): Promise<Sale | undefined> {
    // Implementation will query specific sale from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    // Implementation will query sales by date range from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async getSalesByProduct(productId: number): Promise<Sale[]> {
    // Implementation will query sales by product from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    // Implementation will create sale in Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale> {
    // Implementation will update sale in Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async deleteSale(id: number): Promise<void> {
    // Implementation will delete sale from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async getDailySales(date: Date): Promise<Sale[]> {
    // Implementation will query daily sales from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  async getWeeklySales(startDate: Date): Promise<Sale[]> {
    // Implementation will query weekly sales from Supabase
    throw new Error('Sale operations will be implemented with Supabase integration');
  }

  // Stock Movement operations
  async getStockMovements(productId?: number): Promise<StockMovement[]> {
    // Implementation will query stock movements from Supabase
    throw new Error('Stock movement operations will be implemented with Supabase integration');
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    // Implementation will create stock movement in Supabase
    throw new Error('Stock movement operations will be implemented with Supabase integration');
  }

  async getStockMovementsByDateRange(startDate: Date, endDate: Date): Promise<StockMovement[]> {
    // Implementation will query stock movements by date range from Supabase
    throw new Error('Stock movement operations will be implemented with Supabase integration');
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    // Implementation will query clients from Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async getClient(id: number): Promise<Client | undefined> {
    // Implementation will query specific client from Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    // Implementation will query client by email from Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async createClient(client: InsertClient): Promise<Client> {
    // Implementation will create client in Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> {
    // Implementation will update client in Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async deleteClient(id: number): Promise<void> {
    // Implementation will delete client from Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async getInactiveClients(days: number): Promise<Client[]> {
    // Implementation will query inactive clients from Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }

  async getNewClients(days: number): Promise<Client[]> {
    // Implementation will query new clients from Supabase
    throw new Error('Client operations will be implemented with Supabase integration');
  }
}

export const storage = new SupabaseMultiStorage();