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
    // Mock data diversificado para agendamentos até integração Supabase estar completa
    const mockAppointments = [
      // Pet Shop / Veterinário
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
      },
      {
        id: 2,
        userId: 1,
        title: 'Cirurgia - Gata Mimi',
        description: 'Castração da gata Mimi',
        startTime: new Date('2024-07-02T14:30:00'),
        endTime: new Date('2024-07-02T16:00:00'),
        location: 'Hospital Veterinário Central',
        clientName: 'Carlos Santos',
        clientEmail: 'carlos.santos@email.com',
        clientPhone: '(21) 98888-2222',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-06-30T10:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Médico / Saúde
      {
        id: 3,
        userId: 1,
        title: 'Consulta Cardiologia',
        description: 'Consulta de acompanhamento cardiológico',
        startTime: new Date('2024-07-01T15:00:00'),
        endTime: new Date('2024-07-01T16:00:00'),
        location: 'Hospital São Lucas',
        clientName: 'Maria Silva',
        clientEmail: 'maria.silva@email.com',
        clientPhone: '(31) 97777-3333',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-06-29T14:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        userId: 1,
        title: 'Exame de Rotina',
        description: 'Check-up anual completo',
        startTime: new Date('2024-07-03T09:00:00'),
        endTime: new Date('2024-07-03T10:30:00'),
        location: 'Clínica Dr. Carlos Mendes',
        clientName: 'João Pereira',
        clientEmail: 'joao.pereira@email.com',
        clientPhone: '(11) 96666-4444',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-06-28T16:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Alimentício / Restaurante
      {
        id: 5,
        userId: 1,
        title: 'Entrega Ingredientes',
        description: 'Entrega semanal de ingredientes frescos',
        startTime: new Date('2024-07-01T08:00:00'),
        endTime: new Date('2024-07-01T09:00:00'),
        location: 'Restaurante Bella Vista',
        clientName: 'Restaurante Bella Vista',
        clientEmail: 'pedidos@bellavista.com.br',
        clientPhone: '(48) 95555-5555',
        status: 'completed' as const,
        scheduledAt: new Date('2024-06-25T12:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tecnologia
      {
        id: 6,
        userId: 1,
        title: 'Suporte Técnico',
        description: 'Manutenção preventiva dos sistemas',
        startTime: new Date('2024-07-02T13:00:00'),
        endTime: new Date('2024-07-02T17:00:00'),
        location: 'TechFix Informática',
        clientName: 'TechFix Informática',
        clientEmail: 'vendas@techfix.com.br',
        clientPhone: '(51) 94444-6666',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-06-27T09:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        userId: 1,
        title: 'Instalação iPhone',
        description: 'Configuração e transferência de dados do iPhone 15 Pro',
        startTime: new Date('2024-06-30T16:00:00'),
        endTime: new Date('2024-06-30T17:00:00'),
        location: 'Loja TechStore',
        clientName: 'Pedro Santos Silva',
        clientEmail: 'pedro.santos@email.com',
        clientPhone: '(11) 93333-7777',
        status: 'completed' as const,
        scheduledAt: new Date('2024-06-29T11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Mais agendamentos veterinários
      {
        id: 8,
        userId: 1,
        title: 'Vacinação V10 - Thor',
        description: 'Aplicação de vacina múltipla canina (V10)',
        startTime: new Date('2024-07-04T09:30:00'),
        endTime: new Date('2024-07-04T10:00:00'),
        location: 'Pet Clinic Center',
        clientName: 'Roberto Lima',
        clientEmail: 'roberto.lima@email.com',
        clientPhone: '(85) 97777-8888',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-01T14:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        userId: 1,
        title: 'Emergência - Luna',
        description: 'Atendimento de emergência - possível intoxicação',
        startTime: new Date('2024-07-05T20:00:00'),
        endTime: new Date('2024-07-05T22:00:00'),
        location: 'Hospital Veterinário 24h',
        clientName: 'Família Souza',
        clientEmail: 'emergencia.souza@email.com',
        clientPhone: '(62) 96666-9999',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-05T19:45:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        userId: 1,
        title: 'Banho e Tosa - Buddy',
        description: 'Banho medicinal e tosa higiênica',
        startTime: new Date('2024-07-06T11:00:00'),
        endTime: new Date('2024-07-06T12:30:00'),
        location: 'Pet Shop Amigo Fiel',
        clientName: 'Joana Costa',
        clientEmail: 'joana.costa@email.com',
        clientPhone: '(41) 95555-0000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-02T16:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Mais agendamentos médicos
      {
        id: 11,
        userId: 1,
        title: 'Fisioterapia - Reabilitação',
        description: 'Sessão de fisioterapia pós-cirurgia de joelho',
        startTime: new Date('2024-07-07T14:00:00'),
        endTime: new Date('2024-07-07T15:00:00'),
        location: 'Clínica de Fisioterapia Movimento',
        clientName: 'Paulo Ferreira',
        clientEmail: 'paulo.ferreira@email.com',
        clientPhone: '(47) 94444-1111',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-04T09:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        userId: 1,
        title: 'Consulta Oftalmológica',
        description: 'Avaliação para prescrição de óculos',
        startTime: new Date('2024-07-08T10:30:00'),
        endTime: new Date('2024-07-08T11:30:00'),
        location: 'Clínica Oftalmológica Visão Clara',
        clientName: 'Julia Martins',
        clientEmail: 'julia.martins@email.com',
        clientPhone: '(84) 93333-2222',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-05T15:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 13,
        userId: 1,
        title: 'Cirurgia Plástica',
        description: 'Rinoplastia - consulta pré-operatória',
        startTime: new Date('2024-07-09T08:00:00'),
        endTime: new Date('2024-07-09T09:00:00'),
        location: 'Clínica Dr. Aesthetic',
        clientName: 'Camila Rodriguez',
        clientEmail: 'camila.rodriguez@email.com',
        clientPhone: '(19) 92222-3333',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-06T11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Vendas - Agendamentos comerciais extensos
      {
        id: 14,
        userId: 1,
        title: 'Reunião de Vendas - MacBook Air M3',
        description: 'Apresentação e negociação de MacBook Air M3 para empresa',
        startTime: new Date('2024-07-03T14:00:00'),
        endTime: new Date('2024-07-03T15:30:00'),
        location: 'Digital Solutions Corp - Sala de Reuniões',
        clientName: 'Digital Solutions Corp',
        clientEmail: 'compras@digitalsolutions.com.br',
        clientPhone: '(11) 94000-1000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-01T10:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 15,
        userId: 1,
        title: 'Apresentação Samsung Galaxy S24',
        description: 'Demonstração técnica Samsung Galaxy S24 Ultra para revendedor',
        startTime: new Date('2024-07-03T09:00:00'),
        endTime: new Date('2024-07-03T10:00:00'),
        location: 'MegaTech Distribuidora',
        clientName: 'MegaTech Distribuidora',
        clientEmail: 'vendas@megatech.com.br',
        clientPhone: '(11) 95000-2000',
        status: 'confirmed' as const,
        scheduledAt: new Date('2024-07-01T14:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 16,
        userId: 1,
        title: 'Follow-up Venda PlayStation 5',
        description: 'Acompanhamento da venda de PlayStation 5 para loja de games',
        startTime: new Date('2024-07-03T16:00:00'),
        endTime: new Date('2024-07-03T16:30:00'),
        location: 'GameZone Loja de Games',
        clientName: 'GameZone Loja de Games',
        clientEmail: 'compras@gamezone.com.br',
        clientPhone: '(41) 96000-3000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-02T11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 17,
        userId: 1,
        title: 'Negociação Smart TV Samsung',
        description: 'Negociação de preços para 8 Smart TVs Samsung 65" para hotel',
        startTime: new Date('2024-07-04T10:00:00'),
        endTime: new Date('2024-07-04T11:30:00'),
        location: 'Hotel Presidente - Administração',
        clientName: 'Hotel Presidente',
        clientEmail: 'suprimentos@presidente.com.br',
        clientPhone: '(61) 97000-4000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-02T15:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 18,
        userId: 1,
        title: 'Entrega iPads - Escola Técnica',
        description: 'Entrega e configuração de 15 iPads Pro para escola',
        startTime: new Date('2024-07-04T14:00:00'),
        endTime: new Date('2024-07-04T17:00:00'),
        location: 'Escola Técnica Moderna - Laboratório',
        clientName: 'Escola Técnica Moderna',
        clientEmail: 'ti@tecnicamoderna.edu.br',
        clientPhone: '(31) 98000-5000',
        status: 'confirmed' as const,
        scheduledAt: new Date('2024-07-01T09:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 19,
        userId: 1,
        title: 'Reunião Monitores LG UltraWide',
        description: 'Apresentação de monitores LG UltraWide para agência',
        startTime: new Date('2024-07-05T11:00:00'),
        endTime: new Date('2024-07-05T12:00:00'),
        location: 'Agência de Publicidade Criativa',
        clientName: 'Agência de Publicidade Criativa',
        clientEmail: 'equipamentos@criativa.com.br',
        clientPhone: '(48) 99000-6000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-03T16:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 20,
        userId: 1,
        title: 'Pós-venda Xbox Series X',
        description: 'Suporte pós-venda e configuração Xbox Series X',
        startTime: new Date('2024-07-05T15:00:00'),
        endTime: new Date('2024-07-05T16:00:00'),
        location: 'Residência do Cliente',
        clientName: 'Roberto Silva Junior',
        clientEmail: 'roberto.junior@email.com',
        clientPhone: '(85) 92000-7000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-04T10:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        userId: 1,
        title: 'Apresentação Tênis Adidas Corporate',
        description: 'Apresentação linha corporativa Adidas para revendedor',
        startTime: new Date('2024-07-06T09:30:00'),
        endTime: new Date('2024-07-06T11:00:00'),
        location: 'SportMax Artigos Esportivos',
        clientName: 'SportMax Artigos Esportivos',
        clientEmail: 'vendas@sportmax.com.br',
        clientPhone: '(62) 93000-8000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-04T14:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 22,
        userId: 1,
        title: 'Negociação Cafeteiras Nespresso',
        description: 'Negociação de 12 cafeteiras Nespresso para escritórios',
        startTime: new Date('2024-07-06T14:00:00'),
        endTime: new Date('2024-07-06T15:00:00'),
        location: 'Café Central Escritórios - Sede',
        clientName: 'Café Central Escritórios',
        clientEmail: 'compras@cafecentral.com.br',
        clientPhone: '(11) 94000-9000',
        status: 'confirmed' as const,
        scheduledAt: new Date('2024-07-05T09:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 23,
        userId: 1,
        title: 'Entrega Aspiradores Robô',
        description: 'Entrega e instalação de 4 aspiradores robô iRobot',
        startTime: new Date('2024-07-07T10:00:00'),
        endTime: new Date('2024-07-07T12:00:00'),
        location: 'Condomínio Residencial Jardins',
        clientName: 'Condomínio Residencial Jardins',
        clientEmail: 'administracao@jardins.com.br',
        clientPhone: '(13) 95000-0100',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-05T16:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 24,
        userId: 1,
        title: 'Follow-up Air Fryer Philips',
        description: 'Acompanhamento venda de 25 Air Fryers para revendedor',
        startTime: new Date('2024-07-07T14:30:00'),
        endTime: new Date('2024-07-07T15:00:00'),
        location: 'Casa & Decoração Ltda',
        clientName: 'Casa & Decoração Ltda',
        clientEmail: 'compras@casadecoração.com.br',
        clientPhone: '(19) 96000-0200',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-06T11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 25,
        userId: 1,
        title: 'Reunião Ferramentas Bosch',
        description: 'Apresentação kit ferramentas Bosch para construtora',
        startTime: new Date('2024-07-08T08:00:00'),
        endTime: new Date('2024-07-08T09:30:00'),
        location: 'Construtora Moderna - Escritório',
        clientName: 'Construtora Moderna',
        clientEmail: 'suprimentos@moderna.com.br',
        clientPhone: '(16) 97000-0300',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-06T15:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 26,
        userId: 1,
        title: 'Apresentação Livros Educacionais',
        description: 'Apresentação acervo livros para livraria',
        startTime: new Date('2024-07-08T15:00:00'),
        endTime: new Date('2024-07-08T16:00:00'),
        location: 'Livraria Conhecimento',
        clientName: 'Livraria Conhecimento',
        clientEmail: 'compras@conhecimento.com.br',
        clientPhone: '(27) 98000-0400',
        status: 'confirmed' as const,
        scheduledAt: new Date('2024-07-07T10:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 27,
        userId: 1,
        title: 'Negociação Kindle Paperwhite',
        description: 'Negociação 30 Kindles Paperwhite para universidade',
        startTime: new Date('2024-07-09T10:00:00'),
        endTime: new Date('2024-07-09T11:30:00'),
        location: 'Universidade Federal TechnoSul',
        clientName: 'Universidade Federal TechnoSul',
        clientEmail: 'licitacoes@technosul.edu.br',
        clientPhone: '(53) 99000-0500',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-07T14:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 28,
        userId: 1,
        title: 'Pós-venda iPhone 15 Pro Max',
        description: 'Suporte técnico e configuração iPhone 15 Pro Max',
        startTime: new Date('2024-07-09T16:00:00'),
        endTime: new Date('2024-07-09T17:00:00'),
        location: 'Escritório do Cliente',
        clientName: 'Pedro Santos Silva',
        clientEmail: 'pedro.santos@email.com',
        clientPhone: '(11) 91000-0600',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-08T12:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 29,
        userId: 1,
        title: 'Reunião Notebook Dell Corporate',
        description: 'Apresentação linha Dell Inspiron para TechFix',
        startTime: new Date('2024-07-10T09:00:00'),
        endTime: new Date('2024-07-10T10:30:00'),
        location: 'TechFix Informática Ltda',
        clientName: 'TechFix Informática Ltda',
        clientEmail: 'vendas@techfix.com.br',
        clientPhone: '(51) 92000-0700',
        status: 'confirmed' as const,
        scheduledAt: new Date('2024-07-08T16:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 30,
        userId: 1,
        title: 'Follow-up Galaxy S24 Ultra',
        description: 'Acompanhamento venda Samsung Galaxy S24 Ultra',
        startTime: new Date('2024-07-10T14:00:00'),
        endTime: new Date('2024-07-10T14:30:00'),
        location: 'Residência da Cliente',
        clientName: 'Maria Fernanda Costa',
        clientEmail: 'mf.costa@gmail.com',
        clientPhone: '(21) 93000-0800',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-09T11:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 31,
        userId: 1,
        title: 'Entrega Equipamentos Startup',
        description: 'Entrega equipamentos tecnológicos para startup',
        startTime: new Date('2024-07-11T11:00:00'),
        endTime: new Date('2024-07-11T13:00:00'),
        location: 'Startup InnovaTech - Sede',
        clientName: 'Startup InnovaTech',
        clientEmail: 'compras@innovatech.com.br',
        clientPhone: '(48) 94000-0900',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-09T15:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 32,
        userId: 1,
        title: 'Apresentação AirPods Pro Corporate',
        description: 'Demonstração AirPods Pro para academia fitness',
        startTime: new Date('2024-07-11T15:30:00'),
        endTime: new Date('2024-07-11T16:30:00'),
        location: 'Academia Fit Life',
        clientName: 'Academia Fit Life',
        clientEmail: 'compras@fitlife.com.br',
        clientPhone: '(81) 95000-1000',
        status: 'scheduled' as const,
        scheduledAt: new Date('2024-07-10T10:00:00'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    return mockAppointments;
  }

  async getAppointmentsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Appointment[]> {
    throw new Error('Date range appointments will be implemented with Supabase integration');
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    throw new Error('Single appointment operations will be implemented with Supabase integration');
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
    const mockIntegrations = [
      {
        id: 1,
        userId: 1,
        platform: 'google_calendar' as const,
        accessToken: 'mock_google_token',
        refreshToken: 'mock_google_refresh',
        expiresAt: new Date('2024-12-31'),
        isActive: true,
        settings: {
          calendarId: 'primary',
          syncEnabled: true,
          autoCreateEvents: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    return mockIntegrations;
  }

  async getIntegrationSettingsByPlatform(userId: number, platform: string): Promise<IntegrationSettings | undefined> {
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async createIntegrationSettings(settings: InsertIntegrationSettings): Promise<IntegrationSettings> {
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async updateIntegrationSettings(id: number, settings: Partial<InsertIntegrationSettings>): Promise<IntegrationSettings> {
    throw new Error('Integration settings will be implemented with Supabase integration');
  }

  async getNotificationSettings(userId: number): Promise<NotificationSettings | undefined> {
    const mockNotificationSettings = {
      id: 1,
      userId: 1,
      emailEnabled: true,
      emailAddress: 'admin@empresa.com',
      telegramEnabled: true,
      telegramChatId: '-123456789',
      whatsappEnabled: false,
      whatsappNumber: '',
      defaultReminderTime: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return mockNotificationSettings;
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    throw new Error('Notification settings will be implemented with Supabase integration');
  }

  async updateNotificationSettings(id: number, settings: Partial<InsertNotificationSettings>): Promise<NotificationSettings> {
    throw new Error('Notification settings will be implemented with Supabase integration');
  }

  // Implementações restantes das outras operações...
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
