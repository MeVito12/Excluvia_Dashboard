// Interface para operações de dados
import { 
  User, NewUser,
  Product, NewProduct, 
  Sale, NewSale,
  Client, NewClient,
  Appointment, NewAppointment,
  LoyaltyCampaign, NewLoyaltyCampaign,
  WhatsAppChat, NewWhatsAppChat,
  StockMovement, NewStockMovement
} from "@shared/schema";

export interface Storage {
  // Usuários
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: NewUser): Promise<User>;
  
  // Produtos
  getProducts(userId: number, businessCategory: string): Promise<Product[]>;
  createProduct(product: NewProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<NewProduct>): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Vendas
  getSales(userId: number, businessCategory: string): Promise<Sale[]>;
  createSale(sale: NewSale): Promise<Sale>;
  
  // Clientes
  getClients(userId: number, businessCategory: string): Promise<Client[]>;
  createClient(client: NewClient): Promise<Client>;
  updateClient(id: number, client: Partial<NewClient>): Promise<Client | null>;
  deleteClient(id: number): Promise<boolean>;
  
  // Agendamentos
  getAppointments(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: NewAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Campanhas
  getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]>;
  createCampaign(campaign: NewLoyaltyCampaign): Promise<LoyaltyCampaign>;
  
  // WhatsApp
  getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]>;
  
  // Movimentos de estoque
  getStockMovements(productId: number): Promise<StockMovement[]>;
  createStockMovement(movement: NewStockMovement): Promise<StockMovement>;
}



// Sistema de armazenamento preparado para dados reais das empresas
export class MemStorage implements Storage {
  // Sistema de usuários master para gerenciamento
  private users: User[] = [
    { id: 1, email: "master@sistema.com", name: "Administrador Master", businessCategory: "salao", userType: "master", createdAt: new Date() }
  ];
  
  // Arrays vazios aguardando dados reais das empresas via API
  private products: Product[] = [];
  private sales: Sale[] = [];
  private clients: Client[] = [];
  private appointments: Appointment[] = [];
  private campaigns: LoyaltyCampaign[] = [];
  private whatsappChats: WhatsAppChat[] = [];
  private stockMovements: StockMovement[] = [];
  
  // Contadores para IDs únicos quando dados reais chegarem
  private nextId = { user: 2, product: 1, sale: 1, client: 1, appointment: 1, campaign: 1, chat: 1, movement: 1 };

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async createUser(user: NewUser): Promise<User> {
    const newUser: User = { ...user, id: this.nextId.user++, createdAt: new Date() };
    this.users.push(newUser);
    return newUser;
  }

  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    return this.products.filter(p => p.userId === userId && p.businessCategory === businessCategory);
  }

  async createProduct(product: NewProduct): Promise<Product> {
    const newProduct: Product = { ...product, id: this.nextId.product++, createdAt: new Date() };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<NewProduct>): Promise<Product | null> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    return this.sales.filter(s => s.userId === userId && s.businessCategory === businessCategory);
  }

  async createSale(sale: NewSale): Promise<Sale> {
    const newSale: Sale = { ...sale, id: this.nextId.sale++ };
    this.sales.push(newSale);
    return newSale;
  }

  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    return this.clients.filter(c => c.userId === userId && c.businessCategory === businessCategory);
  }

  async createClient(client: NewClient): Promise<Client> {
    const newClient: Client = { ...client, id: this.nextId.client++, createdAt: new Date() };
    this.clients.push(newClient);
    return newClient;
  }

  async updateClient(id: number, client: Partial<NewClient>): Promise<Client | null> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.clients[index] = { ...this.clients[index], ...client };
    return this.clients[index];
  }

  async deleteClient(id: number): Promise<boolean> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.clients.splice(index, 1);
    return true;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    return this.appointments.filter(a => a.userId === userId);
  }

  async createAppointment(appointment: NewAppointment): Promise<Appointment> {
    const newAppointment: Appointment = { ...appointment, id: this.nextId.appointment++ };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.appointments[index] = { ...this.appointments[index], ...appointment };
    return this.appointments[index];
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.appointments.splice(index, 1);
    return true;
  }

  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    return this.campaigns.filter(c => c.userId === userId && c.businessCategory === businessCategory);
  }

  async createCampaign(campaign: NewLoyaltyCampaign): Promise<LoyaltyCampaign> {
    const newCampaign: LoyaltyCampaign = { ...campaign, id: this.nextId.campaign++, createdAt: new Date() };
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    return this.whatsappChats.filter(c => c.userId === userId && c.businessCategory === businessCategory);
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    return this.stockMovements.filter(m => m.productId === productId);
  }

  async createStockMovement(movement: NewStockMovement): Promise<StockMovement> {
    const newMovement: StockMovement = { ...movement, id: this.nextId.movement++ };
    this.stockMovements.push(newMovement);
    return newMovement;
  }
}