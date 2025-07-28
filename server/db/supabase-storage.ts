import { type Storage } from '../storage';
import type {
  User, NewUser, Product, NewProduct, Sale, NewSale, Client, NewClient,
  Appointment, NewAppointment, Transfer, NewTransfer, Branch, NewBranch, 
  FinancialEntry, NewFinancialEntry, Company, NewCompany, UserPermission,
  NewUserPermission
} from './schema';

export class SupabaseStorage implements Storage {
  private db: any;

  constructor() {
    this.db = null; // Will be initialized when needed
  }

  private async getConnection() {
    if (!this.db) {
      const { getDatabase } = await import('./database');
      this.db = getDatabase();
    }
    return this.db;
  }

  // ====================================
  // COMPANY METHODS
  // ====================================

  async getCompanies(): Promise<Company[]> {
    const db = await this.getConnection();
    const { companiesTable } = await import('./schema');
    return db.select().from(companiesTable);
  }

  async getCompaniesByCreator(creatorId: number): Promise<Company[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    return db.select().from(schema.companiesTable)
      .where(eq(schema.companiesTable.createdBy, creatorId));
  }

  async createCompany(company: NewCompany): Promise<Company> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    const result = await db.insert(schema.companiesTable)
      .values(company)
      .returning();
    
    return result[0];
  }

  async updateCompany(id: number, company: Partial<NewCompany>): Promise<Company | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.update(schema.companiesTable)
      .set(company)
      .where(eq(schema.companiesTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteCompany(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    await db.delete(schema.companiesTable)
      .where(eq(schema.companiesTable.id, id));
    
    return true;
  }

  // ====================================
  // BRANCH METHODS
  // ====================================

  async getBranches(companyId?: number): Promise<Branch[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    let query = db.select().from(schema.branchesTable);
    
    if (companyId) {
      query = query.where(eq(schema.branchesTable.companyId, companyId));
    }
    
    return query;
  }

  async getBranchesByCompany(companyId: number): Promise<Branch[]> {
    return this.getBranches(companyId);
  }

  async createBranch(branch: NewBranch): Promise<Branch> {
    const db = await this.getConnection();
    const { branchesTable } = await import('./schema');
    
    const result = await db.insert(branchesTable)
      .values(branch)
      .returning();
    
    return result[0];
  }

  async updateBranch(id: number, branch: Partial<NewBranch>): Promise<Branch | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.update(schema.branchesTable)
      .set(branch)
      .where(eq(schema.branchesTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteBranch(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    await db.delete(schema.branchesTable)
      .where(eq(schema.branchesTable.id, id));
    
    return true;
  }

  // ====================================
  // USER PERMISSION METHODS
  // ====================================

  async getUserPermissions(userId: number): Promise<UserPermission[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    return db.select().from(schema.userPermissionsTable)
      .where(eq(schema.userPermissionsTable.userId, userId));
  }

  async updateUserPermissions(userId: number, permissions: string[]): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    // Delete existing permissions
    await db.delete(schema.userPermissionsTable)
      .where(eq(schema.userPermissionsTable.userId, userId));
    
    // Insert new permissions
    if (permissions.length > 0) {
      const permissionRecords = permissions.map(permission => ({
        userId,
        permission,
        createdAt: new Date()
      }));
      
      await db.insert(schema.userPermissionsTable).values(permissionRecords);
    }
    
    return true;
  }

  // ====================================
  // USER METHODS
  // ====================================

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const db = await this.getConnection();
      if (!db) {
        throw new Error('Supabase not connected');
      }

      const { eq } = await import('drizzle-orm');
      const { usersTable } = await import('./schema');
      
      const result = await db.select().from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      
      console.log(`✅ Supabase: User ${email} found - tables working!`);
      return result[0] || null;
    } catch (error: any) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('📋 Table "users" does not exist in Supabase - execute SQL schema');
      } else {
        console.log('⚠️ Supabase error:', error.message);
      }
      throw error;
    }
  }

  async createUser(user: NewUser): Promise<User> {
    const db = await this.getConnection();
    const { usersTable } = await import('./schema');
    
    const result = await db.insert(usersTable)
      .values(user)
      .returning();
    
    return result[0];
  }

  async getMasterUsers(): Promise<User[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { usersTable } = await import('./schema');
    
    return db.select().from(usersTable)
      .where(eq(usersTable.role, 'master'));
  }

  async getAllUsers(): Promise<User[]> {
    const db = await this.getConnection();
    const { usersTable } = await import('./schema');
    
    return db.select().from(usersTable)
      .order(usersTable.id);
  }

  async updateUserRole(userId: number, role: string): Promise<User | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { usersTable } = await import('./schema');
    
    const result = await db.update(usersTable)
      .set({ role })
      .where(eq(usersTable.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async updateUser(id: number, user: Partial<NewUser>): Promise<User | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    const result = await db.update(schema.usersTable)
      .set(user)
      .where(eq(schema.usersTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    await db.delete(schema.usersTable)
      .where(eq(schema.usersTable.id, id));
    
    return true;
  }

  // ====================================
  // COMPANY METHODS
  // ====================================

  async getCompaniesByCreator(creatorId: number): Promise<Company[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { companiesTable } = await import('./schema');
    
    return db.select().from(companiesTable)
      .where(eq(companiesTable.createdBy, creatorId));
  }

  async createCompany(company: NewCompany): Promise<Company> {
    const db = await this.getConnection();
    const { companiesTable } = await import('./schema');
    
    const result = await db.insert(companiesTable)
      .values(company)
      .returning();
    
    return result[0];
  }

  async updateCompany(id: number, company: Partial<NewCompany>): Promise<Company | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { companiesTable } = await import('./schema');
    
    const result = await db.update(companiesTable)
      .set(company)
      .where(eq(companiesTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteCompany(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { companiesTable } = await import('./schema');
    
    await db.delete(companiesTable)
      .where(eq(companiesTable.id, id));
    
    return true;
  }

  async getCompanies(): Promise<Company[]> {
    const db = await this.getConnection();
    const { companiesTable } = await import('./schema');
    
    return db.select().from(companiesTable)
      .order(companiesTable.id);
  }

  // ====================================
  // BRANCH METHODS
  // ====================================

  async getBranches(companyId?: number): Promise<Branch[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { branchesTable } = await import('./schema');
    
    let query = db.select().from(branchesTable);
    
    if (companyId) {
      query = query.where(eq(branchesTable.companyId, companyId));
    }
    
    return query;
  }

  async getBranchesByCompany(companyId: number): Promise<Branch[]> {
    return this.getBranches(companyId);
  }

  async createBranch(branch: NewBranch): Promise<Branch> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    if (!schema.branchesTable) {
      throw new Error('Branches table not available in current schema');
    }
    
    const result = await db.insert(schema.branchesTable)
      .values(branch)
      .returning();
    
    return result[0];
  }

  async updateBranch(id: number, branch: Partial<NewBranch>): Promise<Branch | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.branchesTable) {
      return null;
    }
    
    const result = await db.update(schema.branchesTable)
      .set(branch)
      .where(eq(schema.branchesTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteBranch(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.branchesTable) {
      return false;
    }
    
    await db.delete(schema.branchesTable)
      .where(eq(schema.branchesTable.id, id));
    
    return true;
  }

  // ====================================
  // USER PERMISSIONS
  // ====================================

  async getUserPermissions(userId: number): Promise<UserPermission[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.userPermissionsTable) {
      return [];
    }
    
    return db.select().from(schema.userPermissionsTable)
      .where(eq(schema.userPermissionsTable.userId, userId));
  }

  async updateUserPermissions(userId: number, permissions: string[]): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.userPermissionsTable) {
      return false;
    }
    
    // Delete existing permissions
    await db.delete(schema.userPermissionsTable)
      .where(eq(schema.userPermissionsTable.userId, userId));
    
    // Insert new permissions
    const newPermissions = permissions.map(section => ({
      userId,
      section,
      canView: true,
      canEdit: true,
      canDelete: false,
      canExport: true
    }));

    await db.insert(schema.userPermissionsTable)
      .values(newPermissions);

    return true;
  }

  // ====================================
  // PRODUCT METHODS
  // ====================================

  async getProducts(branchId?: number, companyId?: number): Promise<Product[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    let query = db.select().from(schema.productsTable);
    
    const conditions = [];
    if (branchId && schema.productsTable.branchId) {
      conditions.push(eq(schema.productsTable.branchId, branchId));
    }
    if (companyId && schema.productsTable.companyId) {
      conditions.push(eq(schema.productsTable.companyId, companyId));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    return query;
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
    
    await db.delete(schema.productsTable)
      .where(eq(schema.productsTable.id, id));
    
    return true;
  }

  // ====================================
  // SALE METHODS
  // ====================================

  async getSales(branchId?: number, companyId?: number): Promise<Sale[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    let query = db.select().from(schema.salesTable);
    
    const conditions = [];
    if (branchId && schema.salesTable.branchId) {
      conditions.push(eq(schema.salesTable.branchId, branchId));
    }
    if (companyId && schema.salesTable.companyId) {
      conditions.push(eq(schema.salesTable.companyId, companyId));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    return query;
  }

  async createSale(sale: NewSale): Promise<Sale> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    const result = await db.insert(schema.salesTable)
      .values(sale)
      .returning();
    
    return result[0];
  }

  // ====================================
  // CLIENT METHODS
  // ====================================

  async getClients(branchId?: number, companyId?: number): Promise<Client[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    let query = db.select().from(schema.clientsTable);
    
    const conditions = [];
    if (branchId && schema.clientsTable.branchId) {
      conditions.push(eq(schema.clientsTable.branchId, branchId));
    }
    if (companyId && schema.clientsTable.companyId) {
      conditions.push(eq(schema.clientsTable.companyId, companyId));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    return query;
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
    
    await db.delete(schema.clientsTable)
      .where(eq(schema.clientsTable.id, id));
    
    return true;
  }

  // ====================================
  // APPOINTMENT METHODS
  // ====================================

  async getAppointments(branchId?: number, companyId?: number): Promise<Appointment[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.appointmentsTable) {
      return [];
    }
    
    let query = db.select().from(schema.appointmentsTable);
    
    const conditions = [];
    if (branchId && schema.appointmentsTable.branchId) {
      conditions.push(eq(schema.appointmentsTable.branchId, branchId));
    }
    if (companyId && schema.appointmentsTable.companyId) {
      conditions.push(eq(schema.appointmentsTable.companyId, companyId));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    return query;
  }

  async createAppointment(appointment: NewAppointment): Promise<Appointment> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    if (!schema.appointmentsTable) {
      throw new Error('Appointments table not available in current schema');
    }
    
    const result = await db.insert(schema.appointmentsTable)
      .values(appointment)
      .returning();
    
    return result[0];
  }

  async updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.appointmentsTable) {
      return null;
    }
    
    const result = await db.update(schema.appointmentsTable)
      .set(appointment)
      .where(eq(schema.appointmentsTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.appointmentsTable) {
      return false;
    }
    
    await db.delete(schema.appointmentsTable)
      .where(eq(schema.appointmentsTable.id, id));
    
    return true;
  }

  // ====================================
  // FINANCIAL ENTRY METHODS
  // ====================================

  async getFinancialEntries(branchId?: number, companyId?: number): Promise<FinancialEntry[]> {
    const db = await this.getConnection();
    const { eq, and } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.financialEntriesTable) {
      return [];
    }
    
    let query = db.select().from(schema.financialEntriesTable);
    
    const conditions = [];
    if (branchId && schema.financialEntriesTable.branchId) {
      conditions.push(eq(schema.financialEntriesTable.branchId, branchId));
    }
    if (companyId && schema.financialEntriesTable.companyId) {
      conditions.push(eq(schema.financialEntriesTable.companyId, companyId));
    }
    
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }
    
    return query;
  }

  async createFinancialEntry(entry: NewFinancialEntry): Promise<FinancialEntry> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    if (!schema.financialEntriesTable) {
      throw new Error('Financial entries table not available in current schema');
    }
    
    const result = await db.insert(schema.financialEntriesTable)
      .values(entry)
      .returning();
    
    return result[0];
  }

  async updateFinancialEntry(id: number, entry: Partial<FinancialEntry>): Promise<FinancialEntry | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.financialEntriesTable) {
      return null;
    }
    
    const result = await db.update(schema.financialEntriesTable)
      .set(entry)
      .where(eq(schema.financialEntriesTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteFinancialEntry(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.financialEntriesTable) {
      return false;
    }
    
    await db.delete(schema.financialEntriesTable)
      .where(eq(schema.financialEntriesTable.id, id));
    
    return true;
  }

  // ====================================
  // TRANSFER METHODS
  // ====================================

  async getTransfers(companyId?: number): Promise<Transfer[]> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.transfersTable) {
      return [];
    }
    
    let query = db.select().from(schema.transfersTable);
    
    if (companyId && schema.transfersTable.companyId) {
      query = query.where(eq(schema.transfersTable.companyId, companyId));
    }
    
    return query;
  }

  async createTransfer(transfer: NewTransfer): Promise<Transfer> {
    const db = await this.getConnection();
    const { schema } = await import('./database');
    
    if (!schema.transfersTable) {
      throw new Error('Transfers table not available in current schema');
    }
    
    const result = await db.insert(schema.transfersTable)
      .values(transfer)
      .returning();
    
    return result[0];
  }

  async updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.transfersTable) {
      return null;
    }
    
    const result = await db.update(schema.transfersTable)
      .set(transfer)
      .where(eq(schema.transfersTable.id, id))
      .returning();
    
    return result[0] || null;
  }

  async deleteTransfer(id: number): Promise<boolean> {
    const db = await this.getConnection();
    const { eq } = await import('drizzle-orm');
    const { schema } = await import('./database');
    
    if (!schema.transfersTable) {
      return false;
    }
    
    await db.delete(schema.transfersTable)
      .where(eq(schema.transfersTable.id, id));
    
    return true;
  }
}