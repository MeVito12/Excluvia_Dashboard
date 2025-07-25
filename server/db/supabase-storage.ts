import { eq, and } from 'drizzle-orm';
import { getDatabase, schema } from './database';
import { Storage } from '../storage';
import type {
  User, NewUser, Product, NewProduct, Sale, NewSale, Client, NewClient,
  Appointment, NewAppointment, LoyaltyCampaign, NewLoyaltyCampaign,
  WhatsAppChat, NewWhatsAppChat, StockMovement, NewStockMovement,
  Transfer, NewTransfer, Branch, NewBranch, FinancialEntry, NewFinancialEntry
} from './schema';

export class SupabaseStorage implements Storage {
  private db = getDatabase();

  private ensureConnection() {
    if (!this.db) {
      throw new Error('Banco de dados não está conectado');
    }
    return this.db;
  }

  // Usuários
  async getUserByEmail(email: string): Promise<User | null> {
    const db = this.ensureConnection();
    const result = await db.select().from(schema.usersTable).where(eq(schema.usersTable.email, email)).limit(1);
    return result[0] || null;
  }

  async createUser(user: NewUser): Promise<User> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.usersTable).values(user).returning();
    return result[0];
  }

  // Produtos
  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.productsTable)
      .where(and(
        eq(schema.productsTable.userId, userId),
        eq(schema.productsTable.businessCategory, businessCategory)
      ));
  }

  async createProduct(product: NewProduct): Promise<Product> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.productsTable).values(product).returning();
    return result[0];
  }

  async updateProduct(id: number, product: Partial<NewProduct>): Promise<Product | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.productsTable)
      .set(product)
      .where(eq(schema.productsTable.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const db = this.ensureConnection();
    const result = await db.delete(schema.productsTable)
      .where(eq(schema.productsTable.id, id));
    return result.rowCount > 0;
  }

  // Vendas
  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.salesTable)
      .where(and(
        eq(schema.salesTable.userId, userId),
        eq(schema.salesTable.businessCategory, businessCategory)
      ));
  }

  async createSale(sale: NewSale): Promise<Sale> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.salesTable).values(sale).returning();
    return result[0];
  }

  // Clientes
  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.clientsTable)
      .where(and(
        eq(schema.clientsTable.userId, userId),
        eq(schema.clientsTable.businessCategory, businessCategory)
      ));
  }

  async createClient(client: NewClient): Promise<Client> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.clientsTable).values(client).returning();
    return result[0];
  }

  async updateClient(id: number, client: Partial<NewClient>): Promise<Client | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.clientsTable)
      .set(client)
      .where(eq(schema.clientsTable.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteClient(id: number): Promise<boolean> {
    const db = this.ensureConnection();
    const result = await db.delete(schema.clientsTable)
      .where(eq(schema.clientsTable.id, id));
    return result.rowCount > 0;
  }

  // Agendamentos
  async getAppointments(userId: number): Promise<Appointment[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.appointmentsTable)
      .where(eq(schema.appointmentsTable.userId, userId));
  }

  async createAppointment(appointment: NewAppointment): Promise<Appointment> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.appointmentsTable).values(appointment).returning();
    return result[0];
  }

  async updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.appointmentsTable)
      .set(appointment)
      .where(eq(schema.appointmentsTable.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const db = this.ensureConnection();
    const result = await db.delete(schema.appointmentsTable)
      .where(eq(schema.appointmentsTable.id, id));
    return result.rowCount > 0;
  }

  // Campanhas
  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.loyaltyCampaignsTable)
      .where(and(
        eq(schema.loyaltyCampaignsTable.userId, userId),
        eq(schema.loyaltyCampaignsTable.businessCategory, businessCategory)
      ));
  }

  async createCampaign(campaign: NewLoyaltyCampaign): Promise<LoyaltyCampaign> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.loyaltyCampaignsTable).values(campaign).returning();
    return result[0];
  }

  // WhatsApp
  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.whatsappChatsTable)
      .where(and(
        eq(schema.whatsappChatsTable.userId, userId),
        eq(schema.whatsappChatsTable.businessCategory, businessCategory)
      ));
  }

  // Movimentos de estoque
  async getStockMovements(productId: number): Promise<StockMovement[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.stockMovementsTable)
      .where(eq(schema.stockMovementsTable.productId, productId));
  }

  async createStockMovement(movement: NewStockMovement): Promise<StockMovement> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.stockMovementsTable).values(movement).returning();
    return result[0];
  }

  // Transferências
  async getTransfers(userId: number, businessCategory: string): Promise<Transfer[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.transfersTable)
      .where(and(
        eq(schema.transfersTable.requestedBy, userId),
        eq(schema.transfersTable.businessCategory, businessCategory)
      ));
  }

  async createTransfer(transfer: NewTransfer): Promise<Transfer> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.transfersTable).values(transfer).returning();
    return result[0];
  }

  async updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.transfersTable)
      .set(transfer)
      .where(eq(schema.transfersTable.id, id))
      .returning();
    return result[0] || null;
  }

  // Filiais
  async getBranches(userId: number, businessCategory: string): Promise<Branch[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.branchesTable)
      .where(and(
        eq(schema.branchesTable.userId, userId),
        eq(schema.branchesTable.businessCategory, businessCategory)
      ));
  }

  async createBranch(branch: NewBranch): Promise<Branch> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.branchesTable).values(branch).returning();
    return result[0];
  }

  // Financeiro
  async getFinancialEntries(userId: number, businessCategory: string): Promise<FinancialEntry[]> {
    const db = this.ensureConnection();
    return db.select().from(schema.financialEntriesTable)
      .where(and(
        eq(schema.financialEntriesTable.userId, userId),
        eq(schema.financialEntriesTable.businessCategory, businessCategory)
      ));
  }

  async createFinancialEntry(entry: NewFinancialEntry): Promise<FinancialEntry> {
    const db = this.ensureConnection();
    const result = await db.insert(schema.financialEntriesTable).values(entry).returning();
    return result[0];
  }

  async updateFinancialEntry(id: number, entry: Partial<FinancialEntry>): Promise<FinancialEntry | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.financialEntriesTable)
      .set(entry)
      .where(eq(schema.financialEntriesTable.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteFinancialEntry(id: number): Promise<boolean> {
    const db = this.ensureConnection();
    const result = await db.delete(schema.financialEntriesTable)
      .where(eq(schema.financialEntriesTable.id, id));
    return result.rowCount > 0;
  }

  async payFinancialEntry(id: number, paymentProof: string): Promise<FinancialEntry | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.financialEntriesTable)
      .set({
        status: 'paid',
        paymentDate: new Date(),
        paymentProof
      })
      .where(eq(schema.financialEntriesTable.id, id))
      .returning();
    return result[0] || null;
  }

  async revertFinancialEntry(id: number): Promise<FinancialEntry | null> {
    const db = this.ensureConnection();
    const result = await db.update(schema.financialEntriesTable)
      .set({
        status: 'pending',
        paymentDate: null,
        paymentProof: null
      })
      .where(eq(schema.financialEntriesTable.id, id))
      .returning();
    return result[0] || null;
  }
}