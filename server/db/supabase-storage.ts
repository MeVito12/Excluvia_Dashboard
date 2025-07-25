import { type Storage } from '../storage';
import type {
  User, NewUser, Product, NewProduct, Sale, NewSale, Client, NewClient,
  Appointment, NewAppointment, LoyaltyCampaign, NewLoyaltyCampaign,
  WhatsAppChat, NewWhatsAppChat, StockMovement, NewStockMovement,
  Transfer, NewTransfer, Branch, NewBranch, FinancialEntry, NewFinancialEntry,
  Company, NewCompany, UserRole, NewUserRole, UserHierarchy, NewUserHierarchy,
  UserWithHierarchy, TransferWithDetails
} from '@shared/schema';

export class SupabaseStorage implements Storage {
  private db: any;

  constructor() {
    try {
      // Import dinâmico para evitar erro de require
      this.db = null; // Será inicializado quando necessário
    } catch (error) {
      console.error('Erro ao inicializar Supabase:', error);
      this.db = null;
    }
  }

  private async getConnection() {
    if (!this.db) {
      const { getDatabase } = await import('./database');
      this.db = getDatabase();
    }
    return this.db;
  }

  private ensureConnection() {
    if (!this.db) {
      throw new Error('Banco Supabase não está conectado');
    }
    return this.db;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = await this.getConnection();
      if (!db) {
        throw new Error('Supabase não conectado');
      }

      // Teste básico de existência da tabela users
      const { eq } = await import('drizzle-orm');
      const { schema } = await import('./database');
      
      const result = await db.select().from(schema.usersTable)
        .where(eq(schema.usersTable.email, email))
        .limit(1);
      
      console.log(`✅ Supabase: Usuário ${email} encontrado - tabelas funcionando!`);
      return result[0] || null;
    } catch (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('📋 Tabela "users" não existe no Supabase - execute o SQL schema');
      } else {
        console.log('⚠️ Erro Supabase:', error.message);
      }
      throw error; // Forçar fallback para MemStorage
    }
  }

  async createUser(user: NewUser): Promise<User> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    const result = await db.insert(schema.usersTable)
      .values(user)
      .returning();
    
    return result[0];
  }

  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.productsTable)
      .where(and(
        eq(schema.productsTable.userId, userId),
        eq(schema.productsTable.businessCategory, businessCategory)
      ));
    
    return result;
  }

  async createProduct(product: NewProduct): Promise<Product> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    const result = await db.insert(schema.productsTable)
      .values(product)
      .returning();
    
    return result[0];
  }

  async updateProduct(id: number, product: Partial<NewProduct>): Promise<Product | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.update(schema.productsTable)
      .set(product)
      .where(eq(schema.productsTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.delete(schema.productsTable)
      .where(eq(schema.productsTable.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.salesTable)
      .where(and(
        eq(schema.salesTable.userId, userId),
        eq(schema.salesTable.businessCategory, businessCategory)
      ));
    
    return result;
  }

  async createSale(sale: NewSale): Promise<Sale> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    const result = await db.insert(schema.salesTable)
      .values(sale)
      .returning();
    
    return result[0];
  }

  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.clientsTable)
      .where(and(
        eq(schema.clientsTable.userId, userId),
        eq(schema.clientsTable.businessCategory, businessCategory)
      ));
    
    return result;
  }

  async createClient(client: NewClient): Promise<Client> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    const result = await db.insert(schema.clientsTable)
      .values(client)
      .returning();
    
    return result[0];
  }

  async updateClient(id: number, client: Partial<NewClient>): Promise<Client | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.update(schema.clientsTable)
      .set(client)
      .where(eq(schema.clientsTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteClient(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.delete(schema.clientsTable)
      .where(eq(schema.clientsTable.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.appointmentsTable)
      .where(eq(schema.appointmentsTable.userId, userId));
    
    return result;
  }

  async createAppointment(appointment: NewAppointment): Promise<Appointment> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async deleteAppointment(id: number): Promise<boolean> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async createCampaign(campaign: NewLoyaltyCampaign): Promise<LoyaltyCampaign> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async createStockMovement(movement: NewStockMovement): Promise<StockMovement> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async getTransfers(userId: number, businessCategory: string): Promise<Transfer[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.transfersTable)
      .where(eq(schema.transfersTable.userId, userId));
    
    return result;
  }

  async createTransfer(transfer: NewTransfer): Promise<Transfer> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async getBranches(userId: number, businessCategory: string): Promise<Branch[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.branchesTable)
      .where(eq(schema.branchesTable.userId, userId));
    
    return result;
  }

  async createBranch(branch: NewBranch): Promise<Branch> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async getFinancialEntries(userId: number, businessCategory: string): Promise<FinancialEntry[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.select().from(schema.financialEntriesTable)
      .where(and(
        eq(schema.financialEntriesTable.userId, userId),
        eq(schema.financialEntriesTable.businessCategory, businessCategory)
      ));
    
    return result;
  }

  async createFinancialEntry(entry: NewFinancialEntry): Promise<FinancialEntry> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async updateFinancialEntry(id: number, entry: Partial<FinancialEntry>): Promise<FinancialEntry | null> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async deleteFinancialEntry(id: number): Promise<boolean> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async payFinancialEntry(id: number, paymentProof: string): Promise<FinancialEntry | null> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }

  async revertFinancialEntry(id: number): Promise<FinancialEntry | null> {
    throw new Error('Implementação Supabase em desenvolvimento');
  }
}