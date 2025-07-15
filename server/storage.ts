// Storage interface for database operations
import { 
  User, InsertUser,
  Product, InsertProduct, 
  Sale, InsertSale,
  Client, InsertClient,
  Appointment, InsertAppointment,
  LoyaltyCampaign, InsertLoyaltyCampaign,
  WhatsAppChat, InsertWhatsAppChat,
  StockMovement, InsertStockMovement,
  BotConfig, InsertBotConfig,
  SupportAgent, InsertSupportAgent,
  IntegrationSettings, InsertIntegrationSettings,
  NotificationSettings, InsertNotificationSettings
} from "@shared/schema";
import { db } from "./db";
import { 
  users, products, sales, clients, appointments, 
  campaigns, whatsappChats, stockMovements, botConfigs, 
  supportAgents, integrationSettings, notificationSettings 
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProducts(userId: number, businessCategory: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Sale operations
  getSales(userId: number, businessCategory: string): Promise<Sale[]>;
  createSale(sale: InsertSale): Promise<Sale>;
  
  // Client operations
  getClients(userId: number, businessCategory: string): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | null>;
  deleteClient(id: number): Promise<boolean>;
  
  // Appointment operations
  getAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | null>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Campaign operations
  getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]>;
  createCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign>;
  
  // WhatsApp Chat operations
  getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]>;
  
  // Stock Movement operations
  getStockMovements(productId: number): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
}

export class DatabaseStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return result[0] || null;
    } catch (error) {
      console.error("Database error in getUserByEmail:", error);
      return null;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createUser:", error);
      throw error;
    }
  }

  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    try {
      return await db.select().from(products)
        .where(and(eq(products.userId, userId), eq(products.businessCategory, businessCategory)))
        .orderBy(desc(products.createdAt));
    } catch (error) {
      console.error("Database error in getProducts:", error);
      return [];
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const result = await db.insert(products).values(product).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | null> {
    try {
      const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error("Database error in updateProduct:", error);
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const result = await db.delete(products).where(eq(products.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Database error in deleteProduct:", error);
      return false;
    }
  }

  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    try {
      return await db.select().from(sales)
        .where(and(eq(sales.userId, userId), eq(sales.businessCategory, businessCategory)))
        .orderBy(desc(sales.saleDate));
    } catch (error) {
      console.error("Database error in getSales:", error);
      return [];
    }
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    try {
      const result = await db.insert(sales).values(sale).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createSale:", error);
      throw error;
    }
  }

  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    try {
      return await db.select().from(clients)
        .where(and(eq(clients.userId, userId), eq(clients.businessCategory, businessCategory)))
        .orderBy(desc(clients.createdAt));
    } catch (error) {
      console.error("Database error in getClients:", error);
      return [];
    }
  }

  async createClient(client: InsertClient): Promise<Client> {
    try {
      const result = await db.insert(clients).values(client).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createClient:", error);
      throw error;
    }
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | null> {
    try {
      const result = await db.update(clients).set(client).where(eq(clients.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error("Database error in updateClient:", error);
      return null;
    }
  }

  async deleteClient(id: number): Promise<boolean> {
    try {
      const result = await db.delete(clients).where(eq(clients.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Database error in deleteClient:", error);
      return false;
    }
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    try {
      return await db.select().from(appointments)
        .where(eq(appointments.userId, userId))
        .orderBy(desc(appointments.startTime));
    } catch (error) {
      console.error("Database error in getAppointments:", error);
      return [];
    }
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    try {
      const result = await db.insert(appointments).values(appointment).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createAppointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | null> {
    try {
      const result = await db.update(appointments).set(appointment).where(eq(appointments.id, id)).returning();
      return result[0] || null;
    } catch (error) {
      console.error("Database error in updateAppointment:", error);
      return null;
    }
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      const result = await db.delete(appointments).where(eq(appointments.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Database error in deleteAppointment:", error);
      return false;
    }
  }

  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    try {
      return await db.select().from(campaigns)
        .where(and(eq(campaigns.userId, userId), eq(campaigns.businessCategory, businessCategory)))
        .orderBy(desc(campaigns.createdAt));
    } catch (error) {
      console.error("Database error in getCampaigns:", error);
      return [];
    }
  }

  async createCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign> {
    try {
      const result = await db.insert(campaigns).values(campaign).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createCampaign:", error);
      throw error;
    }
  }

  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    try {
      return await db.select().from(whatsappChats)
        .where(and(eq(whatsappChats.userId, userId), eq(whatsappChats.businessCategory, businessCategory)))
        .orderBy(desc(whatsappChats.lastActivity));
    } catch (error) {
      console.error("Database error in getWhatsAppChats:", error);
      return [];
    }
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    try {
      return await db.select().from(stockMovements)
        .where(eq(stockMovements.productId, productId))
        .orderBy(desc(stockMovements.movementDate));
    } catch (error) {
      console.error("Database error in getStockMovements:", error);
      return [];
    }
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    try {
      const result = await db.insert(stockMovements).values(movement).returning();
      return result[0];
    } catch (error) {
      console.error("Database error in createStockMovement:", error);
      throw error;
    }
  }
}

// Storage is now managed exclusively by DatabaseManager
// No mock data fallback - database connection is required