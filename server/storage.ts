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



// Armazenamento em memória
export class MemStorage implements Storage {
  private users: User[] = [
    { id: 1, email: "master@sistema.com", name: "Administrador Master", businessCategory: "salao", userType: "master", createdAt: new Date() },
    { id: 2, email: "demo@example.com", name: "Usuário Demo", businessCategory: "salao", userType: "regular", allowedSections: ["dashboard", "graficos", "estoque", "atendimento"], createdAt: new Date() }
  ];
  
  private products: Product[] = [
    { id: 1, userId: 1, businessCategory: "salao", name: "Corte de Cabelo", description: "Corte masculino tradicional", price: 35.00, stock: 0, createdAt: new Date() },
    { id: 2, userId: 1, businessCategory: "salao", name: "Escova Progressiva", description: "Tratamento alisante", price: 180.00, stock: 0, createdAt: new Date() },
    { id: 3, userId: 1, businessCategory: "salao", name: "Coloração", description: "Tintura completa", price: 120.00, stock: 0, createdAt: new Date() },
    { id: 4, userId: 1, businessCategory: "salao", name: "Manicure", description: "Cuidados com as unhas", price: 25.00, stock: 0, createdAt: new Date() }
  ];
  
  private sales: Sale[] = [
    { id: 1, userId: 1, businessCategory: "salao", productId: 1, clientId: 1, quantity: 1, totalPrice: 35.00, saleDate: new Date(Date.now() - 86400000) },
    { id: 2, userId: 1, businessCategory: "salao", productId: 2, clientId: 2, quantity: 1, totalPrice: 180.00, saleDate: new Date(Date.now() - 172800000) },
    { id: 3, userId: 1, businessCategory: "salao", productId: 3, clientId: 1, quantity: 1, totalPrice: 120.00, saleDate: new Date() }
  ];
  
  private clients: Client[] = [
    { id: 1, userId: 1, businessCategory: "salao", name: "Maria Silva", email: "maria@email.com", phone: "11999999999", createdAt: new Date() },
    { id: 2, userId: 1, businessCategory: "salao", name: "João Santos", email: "joao@email.com", phone: "11888888888", createdAt: new Date() },
    { id: 3, userId: 1, businessCategory: "salao", name: "Ana Costa", email: "ana@email.com", phone: "11777777777", createdAt: new Date() }
  ];
  
  private appointments: Appointment[] = [
    { id: 1, userId: 1, clientId: 1, serviceId: 1, startTime: new Date(Date.now() + 86400000), endTime: new Date(Date.now() + 90000000), status: "agendado", notes: "Cliente preferencial" },
    { id: 2, userId: 1, clientId: 2, serviceId: 2, startTime: new Date(Date.now() + 172800000), endTime: new Date(Date.now() + 183600000), status: "agendado", notes: "Primeira vez no salão" }
  ];
  
  private campaigns: LoyaltyCampaign[] = [
    { id: 1, userId: 1, businessCategory: "salao", name: "Desconto Verão", description: "20% de desconto em cortes", discountPercentage: 20, isActive: true, createdAt: new Date() }
  ];
  
  private whatsappChats: WhatsAppChat[] = [
    { id: 1, userId: 1, businessCategory: "salao", contactName: "Maria Silva", contactPhone: "11999999999", lastMessage: "Obrigada pelo atendimento!", lastActivity: new Date(), isActive: true }
  ];
  
  private stockMovements: StockMovement[] = [];
  
  private nextId = { user: 2, product: 5, sale: 4, client: 4, appointment: 3, campaign: 2, chat: 2, movement: 1 };

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