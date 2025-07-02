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
  type InsertClient,
  type WhatsAppChat,
  type InsertWhatsAppChat,
  type BotConfig,
  type InsertBotConfig,
  type LoyaltyCampaign,
  type InsertLoyaltyCampaign,
  type SupportAgent,
  type InsertSupportAgent
} from "@shared/schema";

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
  
  // WhatsApp Chat operations
  getWhatsAppChats(): Promise<WhatsAppChat[]>;
  getWhatsAppChat(id: number): Promise<WhatsAppChat | undefined>;
  getActiveChats(): Promise<WhatsAppChat[]>;
  createWhatsAppChat(chat: InsertWhatsAppChat): Promise<WhatsAppChat>;
  updateWhatsAppChat(id: number, chat: Partial<InsertWhatsAppChat>): Promise<WhatsAppChat>;
  markChatAsRead(id: number): Promise<void>;
  
  // Bot Configuration operations
  getBotConfigs(): Promise<BotConfig[]>;
  getBotConfig(id: number): Promise<BotConfig | undefined>;
  getActiveBotConfig(): Promise<BotConfig | undefined>;
  createBotConfig(config: InsertBotConfig): Promise<BotConfig>;
  updateBotConfig(id: number, config: Partial<InsertBotConfig>): Promise<BotConfig>;
  
  // Loyalty Campaign operations
  getLoyaltyCampaigns(): Promise<LoyaltyCampaign[]>;
  getLoyaltyCampaign(id: number): Promise<LoyaltyCampaign | undefined>;
  getActiveCampaigns(): Promise<LoyaltyCampaign[]>;
  createLoyaltyCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign>;
  updateLoyaltyCampaign(id: number, campaign: Partial<InsertLoyaltyCampaign>): Promise<LoyaltyCampaign>;
  deleteLoyaltyCampaign(id: number): Promise<void>;
  
  // Support Agent operations
  getSupportAgents(): Promise<SupportAgent[]>;
  getSupportAgent(id: number): Promise<SupportAgent | undefined>;
  getOnlineAgents(): Promise<SupportAgent[]>;
  createSupportAgent(agent: InsertSupportAgent): Promise<SupportAgent>;
  updateSupportAgent(id: number, agent: Partial<InsertSupportAgent>): Promise<SupportAgent>;
  updateAgentStatus(id: number, status: 'online' | 'offline' | 'busy' | 'away'): Promise<SupportAgent>;
}

export class SupabaseMultiStorage implements IStorage {
  private databases: Map<string, any> = new Map();

  async getUser(id: number): Promise<User | undefined> {
    throw new Error('User operations will be implemented with Supabase integration');
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error('User operations will be implemented with Supabase integration');
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    throw new Error('User operations will be implemented with Supabase integration');
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    // Mock data simples para demonstração
    return [
      {
        id: 1,
        userId: 1,
        title: 'Consulta Veterinária - Rex',
        description: 'Consulta de rotina e vacinação do cachorro Rex',
        startTime: new Date('2024-07-01T10:00:00'),
        endTime: new Date('2024-07-01T11:00:00'),
        location: 'Clínica Veterinária Bichos & Cia',
        clientName: 'Ana Maria Oliveira',
        clientEmail: 'ana.oliveira@email.com',
        clientPhone: '(11) 99999-1111',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-06-30T12:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getAppointmentsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Appointment[]> {
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async deleteAppointment(id: number): Promise<void> {
    throw new Error('Appointment operations will be implemented with Supabase integration');
  }

  async getReminders(appointmentId: number): Promise<Reminder[]> {
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async getPendingReminders(): Promise<Reminder[]> {
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async markReminderSent(id: number): Promise<void> {
    throw new Error('Reminder operations will be implemented with Supabase integration');
  }

  async getIntegrationSettings(userId: number): Promise<IntegrationSettings[]> {
    return [
      {
        id: 1,
        userId: 1,
        platform: 'google_calendar',
        accessToken: 'mock_token',
        refreshToken: 'mock_refresh',
        calendarId: 'primary',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getIntegrationSettingsByPlatform(userId: number, platform: string): Promise<IntegrationSettings | undefined> {
    throw new Error('Integration operations will be implemented with Supabase integration');
  }

  async createIntegrationSettings(settings: InsertIntegrationSettings): Promise<IntegrationSettings> {
    throw new Error('Integration operations will be implemented with Supabase integration');
  }

  async updateIntegrationSettings(id: number, settings: Partial<InsertIntegrationSettings>): Promise<IntegrationSettings> {
    throw new Error('Integration operations will be implemented with Supabase integration');
  }

  async getNotificationSettings(userId: number): Promise<NotificationSettings | undefined> {
    return {
      id: 1,
      userId: 1,
      emailEnabled: true,
      telegramEnabled: false,
      telegramChatId: null,
      emailAddress: 'user@example.com',
      reminderMinutesBefore: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    throw new Error('Notification operations will be implemented with Supabase integration');
  }

  async updateNotificationSettings(id: number, settings: Partial<InsertNotificationSettings>): Promise<NotificationSettings> {
    throw new Error('Notification operations will be implemented with Supabase integration');
  }

  // Implementações básicas para as outras operações
  async getProducts(): Promise<Product[]> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async getProduct(id: number): Promise<Product | undefined> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async getProductBySku(sku: string): Promise<Product | undefined> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async createProduct(product: InsertProduct): Promise<Product> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async deleteProduct(id: number): Promise<void> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async getLowStockProducts(): Promise<Product[]> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async getExpiringProducts(days: number): Promise<Product[]> { throw new Error('Product operations will be implemented with Supabase integration'); }
  async getSales(): Promise<Sale[]> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async getSale(id: number): Promise<Sale | undefined> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async getSalesByProduct(productId: number): Promise<Sale[]> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async createSale(sale: InsertSale): Promise<Sale> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async updateSale(id: number, sale: Partial<InsertSale>): Promise<Sale> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async deleteSale(id: number): Promise<void> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async getDailySales(date: Date): Promise<Sale[]> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async getWeeklySales(startDate: Date): Promise<Sale[]> { throw new Error('Sale operations will be implemented with Supabase integration'); }
  async getStockMovements(productId?: number): Promise<StockMovement[]> { throw new Error('Stock operations will be implemented with Supabase integration'); }
  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> { throw new Error('Stock operations will be implemented with Supabase integration'); }
  async getStockMovementsByDateRange(startDate: Date, endDate: Date): Promise<StockMovement[]> { throw new Error('Stock operations will be implemented with Supabase integration'); }
  async getClients(): Promise<Client[]> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async getClient(id: number): Promise<Client | undefined> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async getClientByEmail(email: string): Promise<Client | undefined> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async createClient(client: InsertClient): Promise<Client> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async deleteClient(id: number): Promise<void> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async getInactiveClients(days: number): Promise<Client[]> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async getNewClients(days: number): Promise<Client[]> { throw new Error('Client operations will be implemented with Supabase integration'); }
  async getWhatsAppChats(): Promise<WhatsAppChat[]> { throw new Error('WhatsApp operations will be implemented with Supabase integration'); }
  async getWhatsAppChat(id: number): Promise<WhatsAppChat | undefined> { throw new Error('WhatsApp operations will be implemented with Supabase integration'); }
  async getActiveChats(): Promise<WhatsAppChat[]> { throw new Error('WhatsApp operations will be implemented with Supabase integration'); }
  async createWhatsAppChat(chat: InsertWhatsAppChat): Promise<WhatsAppChat> { throw new Error('WhatsApp operations will be implemented with Supabase integration'); }
  async updateWhatsAppChat(id: number, chat: Partial<InsertWhatsAppChat>): Promise<WhatsAppChat> { throw new Error('WhatsApp operations will be implemented with Supabase integration'); }
  async markChatAsRead(id: number): Promise<void> { throw new Error('WhatsApp operations will be implemented with Supabase integration'); }
  async getBotConfigs(): Promise<BotConfig[]> { throw new Error('Bot operations will be implemented with Supabase integration'); }
  async getBotConfig(id: number): Promise<BotConfig | undefined> { throw new Error('Bot operations will be implemented with Supabase integration'); }
  async getActiveBotConfig(): Promise<BotConfig | undefined> { throw new Error('Bot operations will be implemented with Supabase integration'); }
  async createBotConfig(config: InsertBotConfig): Promise<BotConfig> { throw new Error('Bot operations will be implemented with Supabase integration'); }
  async updateBotConfig(id: number, config: Partial<InsertBotConfig>): Promise<BotConfig> { throw new Error('Bot operations will be implemented with Supabase integration'); }
  async getLoyaltyCampaigns(): Promise<LoyaltyCampaign[]> { throw new Error('Loyalty operations will be implemented with Supabase integration'); }
  async getLoyaltyCampaign(id: number): Promise<LoyaltyCampaign | undefined> { throw new Error('Loyalty operations will be implemented with Supabase integration'); }
  async getActiveCampaigns(): Promise<LoyaltyCampaign[]> { throw new Error('Loyalty operations will be implemented with Supabase integration'); }
  async createLoyaltyCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign> { throw new Error('Loyalty operations will be implemented with Supabase integration'); }
  async updateLoyaltyCampaign(id: number, campaign: Partial<InsertLoyaltyCampaign>): Promise<LoyaltyCampaign> { throw new Error('Loyalty operations will be implemented with Supabase integration'); }
  async deleteLoyaltyCampaign(id: number): Promise<void> { throw new Error('Loyalty operations will be implemented with Supabase integration'); }
  async getSupportAgents(): Promise<SupportAgent[]> { throw new Error('Support operations will be implemented with Supabase integration'); }
  async getSupportAgent(id: number): Promise<SupportAgent | undefined> { throw new Error('Support operations will be implemented with Supabase integration'); }
  async getOnlineAgents(): Promise<SupportAgent[]> { throw new Error('Support operations will be implemented with Supabase integration'); }
  async createSupportAgent(agent: InsertSupportAgent): Promise<SupportAgent> { throw new Error('Support operations will be implemented with Supabase integration'); }
  async updateSupportAgent(id: number, agent: Partial<InsertSupportAgent>): Promise<SupportAgent> { throw new Error('Support operations will be implemented with Supabase integration'); }
  async updateAgentStatus(id: number, status: 'online' | 'offline' | 'busy' | 'away'): Promise<SupportAgent> { throw new Error('Support operations will be implemented with Supabase integration'); }
}

export const storage = new SupabaseMultiStorage();