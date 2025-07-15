// Mock storage implementation that returns the existing mock data
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
import { IStorage } from "./storage";

// Convert existing mock data to database format
const mockUsers: User[] = [
  { id: 1, username: "farmacia", password: "demo123", businessCategory: "farmacia", createdAt: new Date(), updatedAt: new Date() },
  { id: 2, username: "pet", password: "demo123", businessCategory: "pet", createdAt: new Date(), updatedAt: new Date() },
  { id: 3, username: "medico", password: "demo123", businessCategory: "medico", createdAt: new Date(), updatedAt: new Date() },
  { id: 4, username: "alimenticio", password: "demo123", businessCategory: "alimenticio", createdAt: new Date(), updatedAt: new Date() },
  { id: 5, username: "vendas", password: "demo123", businessCategory: "vendas", createdAt: new Date(), updatedAt: new Date() },
  { id: 6, username: "design", password: "demo123", businessCategory: "design", createdAt: new Date(), updatedAt: new Date() },
  { id: 7, username: "sites", password: "demo123", businessCategory: "sites", createdAt: new Date(), updatedAt: new Date() },
];

let mockProducts: Product[] = [];
let mockSales: Sale[] = [];
let mockClients: Client[] = [];
let mockAppointments: Appointment[] = [];
let mockCampaigns: LoyaltyCampaign[] = [];
let mockWhatsAppChats: WhatsAppChat[] = [];
let mockStockMovements: StockMovement[] = [];

// Generate unique IDs
let nextId = 1;
const generateId = () => nextId++;

export class MockStorage implements IStorage {
  async getUserByUsername(username: string): Promise<User | null> {
    return mockUsers.find(user => user.username === username) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  }

  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    return mockProducts.filter(p => p.userId === userId && p.businessCategory === businessCategory);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProducts.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | null> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = { ...mockProducts[index], ...product, updatedAt: new Date() };
    return mockProducts[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  }

  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    return mockSales.filter(s => s.userId === userId && s.businessCategory === businessCategory);
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    const newSale: Sale = {
      ...sale,
      id: generateId(),
      createdAt: new Date()
    };
    mockSales.push(newSale);
    return newSale;
  }

  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    return mockClients.filter(c => c.userId === userId && c.businessCategory === businessCategory);
  }

  async createClient(client: InsertClient): Promise<Client> {
    const newClient: Client = {
      ...client,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockClients.push(newClient);
    return newClient;
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | null> {
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    mockClients[index] = { ...mockClients[index], ...client, updatedAt: new Date() };
    return mockClients[index];
  }

  async deleteClient(id: number): Promise<boolean> {
    const index = mockClients.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    mockClients.splice(index, 1);
    return true;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return mockAppointments.filter(a => a.userId === userId);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockAppointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | null> {
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    mockAppointments[index] = { ...mockAppointments[index], ...appointment, updatedAt: new Date() };
    return mockAppointments[index];
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) return false;
    
    mockAppointments.splice(index, 1);
    return true;
  }

  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    return mockCampaigns.filter(c => c.userId === userId && c.businessCategory === businessCategory);
  }

  async createCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign> {
    const newCampaign: LoyaltyCampaign = {
      ...campaign,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockCampaigns.push(newCampaign);
    return newCampaign;
  }

  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    return mockWhatsAppChats.filter(w => w.userId === userId && w.businessCategory === businessCategory);
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    return mockStockMovements.filter(s => s.productId === productId);
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const newMovement: StockMovement = {
      ...movement,
      id: generateId(),
      createdAt: new Date()
    };
    mockStockMovements.push(newMovement);
    return newMovement;
  }
}

// Initialize with some mock data to populate the arrays
function initializeMockData() {
  // Example data for farmacia (user id 1)
  mockProducts.push({
    id: 1,
    name: "Paracetamol 500mg",
    category: "medicamentos",
    sku: "PAR500",
    stock: 50,
    minStock: 10,
    price: "8.50",
    isPerishable: true,
    manufacturingDate: new Date("2024-06-01"),
    expiryDate: new Date("2026-06-01"),
    businessCategory: "farmacia",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  mockClients.push({
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123",
    businessCategory: "farmacia",
    totalSpent: "150.75",
    lastPurchase: new Date("2024-12-01"),
    isActive: true,
    notes: "Cliente regular",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  mockAppointments.push({
    id: 1,
    title: "Consulta de rotina",
    description: "Consulta médica de rotina",
    startTime: new Date("2025-01-20T10:00:00"),
    endTime: new Date("2025-01-20T10:30:00"),
    location: "Consultório 1",
    clientName: "Maria Silva",
    clientEmail: "maria@email.com",
    clientPhone: "(11) 98765-4321",
    status: "scheduled",
    userId: 1,
    scheduledAt: new Date("2025-01-20T10:00:00"),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

// Initialize mock data
initializeMockData();

export const mockStorage = new MockStorage();