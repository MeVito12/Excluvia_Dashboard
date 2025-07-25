// Interface para operações de dados
import { 
  User, NewUser,
  Product, NewProduct, 
  Sale, NewSale,
  Client, NewClient,
  Appointment, NewAppointment,
  LoyaltyCampaign, NewLoyaltyCampaign,
  WhatsAppChat, NewWhatsAppChat,
  StockMovement, NewStockMovement,
  Transfer, NewTransfer,
  Branch, NewBranch
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
  
  // Transferências
  getTransfers(userId: number, businessCategory: string): Promise<Transfer[]>;
  createTransfer(transfer: NewTransfer): Promise<Transfer>;
  updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null>;
  
  // Filiais
  getBranches(userId: number, businessCategory: string): Promise<Branch[]>;
  createBranch(branch: NewBranch): Promise<Branch>;
}



// Armazenamento em memória
export class MemStorage implements Storage {
  private users: User[] = [
    { id: 1, email: "master@sistema.com", name: "Administrador Master", businessCategory: "salao", userType: "master", createdAt: new Date() },
    { id: 2, email: "demo@example.com", name: "Usuário Demo", businessCategory: "salao", userType: "regular", allowedSections: ["dashboard", "graficos", "estoque", "atendimento"], createdAt: new Date() },

  ];
  
  private products: Product[] = [
    // Produtos para Salão
    { id: 1, userId: 1, businessCategory: "salao", name: "Corte de Cabelo", description: "Corte masculino tradicional", price: 35.00, stock: 0, createdAt: new Date() },
    { id: 2, userId: 1, businessCategory: "salao", name: "Escova Progressiva", description: "Tratamento alisante", price: 180.00, stock: 0, createdAt: new Date() },
    { id: 3, userId: 1, businessCategory: "salao", name: "Coloração", description: "Tintura completa", price: 120.00, stock: 0, createdAt: new Date() },
    { id: 4, userId: 1, businessCategory: "salao", name: "Manicure", description: "Cuidados com as unhas", price: 25.00, stock: 0, createdAt: new Date() },
    
    // Produtos para Alimentício
    { id: 5, userId: 1, businessCategory: "alimenticio", name: "Pizza Margherita", description: "Pizza tradicional com tomate e mussarela", price: 35.00, stock: 25, minStock: 10, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 2), createdAt: new Date() },
    { id: 6, userId: 1, businessCategory: "alimenticio", name: "Hambúrguer Artesanal", description: "Hambúrguer com carne artesanal", price: 28.00, stock: 15, minStock: 8, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 1), createdAt: new Date() },
    { id: 7, userId: 1, businessCategory: "alimenticio", name: "Refrigerante Lata", description: "Refrigerante lata 350ml", price: 5.50, stock: 120, minStock: 50, isPerishable: false, createdAt: new Date() },
    { id: 8, userId: 1, businessCategory: "alimenticio", name: "Açúcar Cristal", description: "Açúcar cristal 1kg", price: 4.90, stock: 8, minStock: 20, isPerishable: false, createdAt: new Date() },
    
    // Produtos para Pet
    { id: 9, userId: 1, businessCategory: "pet", name: "Ração Premium Golden", description: "Ração para cães adultos", price: 89.90, stock: 45, minStock: 15, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 240), createdAt: new Date() },
    { id: 10, userId: 1, businessCategory: "pet", name: "Vacina V10 Cães", description: "Vacina múltipla para cães", price: 85.00, stock: 8, minStock: 5, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 60), createdAt: new Date() },
    { id: 11, userId: 1, businessCategory: "pet", name: "Coleira Antipulgas", description: "Coleira com proteção antipulgas", price: 35.50, stock: 2, minStock: 10, isPerishable: false, createdAt: new Date() },
    
    // Produtos para Farmácia
    { id: 12, userId: 1, businessCategory: "farmacia", name: "Dipirona 500mg", description: "Analgésico e antitérmico", price: 15.90, stock: 250, minStock: 80, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 330), createdAt: new Date() },
    { id: 13, userId: 1, businessCategory: "farmacia", name: "Amoxicilina 500mg", description: "Antibiótico de amplo espectro", price: 28.00, stock: 95, minStock: 30, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 200), createdAt: new Date() },
    
    // Produtos para Vendas/Loja
    { id: 14, userId: 1, businessCategory: "vendas", name: "Smartphone Galaxy S24", description: "Smartphone Samsung Galaxy", price: 2899.99, stock: 12, minStock: 5, isPerishable: false, createdAt: new Date() },
    { id: 15, userId: 1, businessCategory: "vendas", name: "Notebook Dell Inspiron", description: "Notebook Dell Core i5", price: 2350.00, stock: 8, minStock: 3, isPerishable: false, createdAt: new Date() },
    { id: 16, userId: 1, businessCategory: "vendas", name: "Camiseta Polo", description: "Camiseta polo masculina", price: 89.99, stock: 45, minStock: 20, isPerishable: false, createdAt: new Date() },
    
    // Produtos para Estética
    { id: 17, userId: 1, businessCategory: "estetica", name: "Ácido Hialurônico", description: "Preenchimento facial", price: 320.00, stock: 15, minStock: 8, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 180), createdAt: new Date() },
    { id: 18, userId: 1, businessCategory: "estetica", name: "Botox", description: "Toxina botulínica tipo A", price: 280.00, stock: 12, minStock: 6, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 150), createdAt: new Date() },
    

    { id: 19, userId: 1, businessCategory: "alimenticio", name: "Arroz Branco Tipo 1", description: "Arroz branco longo fino 5kg", price: 18.90, stock: 150, minStock: 50, isPerishable: false, createdAt: new Date() },
    { id: 20, userId: 1, businessCategory: "alimenticio", name: "Feijão Preto", description: "Feijão preto 1kg", price: 8.50, stock: 200, minStock: 80, isPerishable: false, createdAt: new Date() },
    { id: 21, userId: 1, businessCategory: "alimenticio", name: "Óleo de Soja", description: "Óleo de soja 900ml", price: 5.90, stock: 85, minStock: 30, isPerishable: false, createdAt: new Date() },
    { id: 22, userId: 1, businessCategory: "alimenticio", name: "Açúcar Cristal", description: "Açúcar cristal 1kg", price: 4.50, stock: 12, minStock: 40, isPerishable: false, createdAt: new Date() },
    { id: 23, userId: 1, businessCategory: "alimenticio", name: "Sal Refinado", description: "Sal refinado iodado 1kg", price: 2.80, stock: 95, minStock: 25, isPerishable: false, createdAt: new Date() },
    { id: 24, userId: 1, businessCategory: "alimenticio", name: "Macarrão Espaguete", description: "Macarrão espaguete 500g", price: 3.20, stock: 0, minStock: 60, isPerishable: false, createdAt: new Date() },
    { id: 25, userId: 1, businessCategory: "alimenticio", name: "Leite Integral", description: "Leite integral UHT 1L", price: 4.90, stock: 240, minStock: 100, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 15), createdAt: new Date() },
    { id: 26, userId: 1, businessCategory: "alimenticio", name: "Pão de Forma", description: "Pão de forma tradicional", price: 6.80, stock: 45, minStock: 20, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 3), createdAt: new Date() },
    { id: 27, userId: 1, businessCategory: "alimenticio", name: "Ovos Brancos", description: "Ovos brancos cartela 12 unidades", price: 8.90, stock: 8, minStock: 30, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 10), createdAt: new Date() },
    { id: 28, userId: 1, businessCategory: "alimenticio", name: "Frango Congelado", description: "Frango inteiro congelado 1,5kg", price: 12.90, stock: 25, minStock: 15, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 90), createdAt: new Date() },
    { id: 29, userId: 1, businessCategory: "alimenticio", name: "Banana Prata", description: "Banana prata por kg", price: 5.80, stock: 18, minStock: 25, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 5), createdAt: new Date() },
    { id: 30, userId: 1, businessCategory: "alimenticio", name: "Tomate", description: "Tomate salada por kg", price: 7.90, stock: 22, minStock: 15, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 4), createdAt: new Date() },
    { id: 31, userId: 1, businessCategory: "alimenticio", name: "Cebola", description: "Cebola comum por kg", price: 4.20, stock: 35, minStock: 20, isPerishable: true, expiryDate: new Date(Date.now() + 86400000 * 7), createdAt: new Date() },
    { id: 32, userId: 1, businessCategory: "alimenticio", name: "Detergente", description: "Detergente líquido 500ml", price: 2.90, stock: 65, minStock: 25, isPerishable: false, createdAt: new Date() },
    { id: 33, userId: 1, businessCategory: "alimenticio", name: "Papel Higiênico", description: "Papel higiênico 4 rolos", price: 8.50, stock: 0, minStock: 40, isPerishable: false, createdAt: new Date() },
    { id: 34, userId: 1, businessCategory: "alimenticio", name: "Sabão em Pó", description: "Sabão em pó 1kg", price: 12.90, stock: 28, minStock: 15, isPerishable: false, createdAt: new Date() }
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
  
  private branches: Branch[] = [
    { id: 1, name: "Filial Centro", address: "Rua Augusta, 123 - Centro", managerId: 1, businessCategory: "alimenticio", isActive: true, createdAt: new Date() },
    { id: 2, name: "Filial Norte", address: "Av. Paulista, 456 - Bela Vista", managerId: 1, businessCategory: "alimenticio", isActive: true, createdAt: new Date() },
    { id: 3, name: "Filial Sul", address: "Rua da Consolação, 789 - Consolação", managerId: 1, businessCategory: "alimenticio", isActive: true, createdAt: new Date() },
    { id: 4, name: "Filial Leste", address: "Av. Ipiranga, 321 - República", managerId: 1, businessCategory: "alimenticio", isActive: true, createdAt: new Date() },
    { id: 5, name: "Filial Oeste", address: "Rua Barão de Itapetininga, 654 - República", managerId: 1, businessCategory: "alimenticio", isActive: true, createdAt: new Date() }
  ];
  
  private transfers: Transfer[] = [
    { id: 1, productId: 19, fromBranchId: 1, toBranchId: 2, quantity: 20, status: 'sent', transferDate: new Date(Date.now() - 86400000), businessCategory: "alimenticio", userId: 1, notes: "Transferência de estoque baixo" },
    { id: 2, productId: 22, fromBranchId: 2, toBranchId: 3, quantity: 15, status: 'received', transferDate: new Date(Date.now() - 172800000), receivedDate: new Date(Date.now() - 86400000), businessCategory: "alimenticio", userId: 1, notes: "Solicitação da filial Sul" },
    { id: 3, productId: 25, fromBranchId: 1, toBranchId: 4, quantity: 30, status: 'pending', transferDate: new Date(), businessCategory: "alimenticio", userId: 1, notes: "Transferência urgente" },
    { id: 4, productId: 27, fromBranchId: 3, toBranchId: 1, quantity: 10, status: 'returned', transferDate: new Date(Date.now() - 259200000), returnDate: new Date(Date.now() - 172800000), businessCategory: "alimenticio", userId: 1, notes: "Produto próximo ao vencimento" }
  ];
  
  private nextId = { user: 3, product: 35, sale: 4, client: 4, appointment: 3, campaign: 2, chat: 2, movement: 1, transfer: 5, branch: 6 };

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

  // Métodos para transferências
  async getTransfers(userId: number, businessCategory: string): Promise<Transfer[]> {
    return this.transfers.filter(t => t.userId === userId && t.businessCategory === businessCategory);
  }

  async createTransfer(transfer: NewTransfer): Promise<Transfer> {
    const newTransfer: Transfer = { ...transfer, id: this.nextId.transfer++ };
    this.transfers.push(newTransfer);
    return newTransfer;
  }

  async updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null> {
    const index = this.transfers.findIndex(t => t.id === id);
    if (index === -1) return null;
    this.transfers[index] = { ...this.transfers[index], ...transfer };
    return this.transfers[index];
  }

  // Métodos para filiais
  async getBranches(userId: number, businessCategory: string): Promise<Branch[]> {
    return this.branches.filter(b => b.businessCategory === businessCategory && b.isActive);
  }

  async createBranch(branch: NewBranch): Promise<Branch> {
    const newBranch: Branch = { ...branch, id: this.nextId.branch++, createdAt: new Date() };
    this.branches.push(newBranch);
    return newBranch;
  }
}