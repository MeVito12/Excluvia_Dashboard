// Interface para operações de dados com nova hierarquia
import { 
  User, NewUser,
  Company, NewCompany,
  Branch, NewBranch,
  Product, NewProduct, 
  Sale, NewSale,
  Client, NewClient,
  Appointment, NewAppointment,
  FinancialEntry, NewFinancialEntry,
  Transfer, NewTransfer,
  MoneyTransfer, NewMoneyTransfer,
  UserPermission
} from "@shared/schema";

export interface Storage {
  // ====================================
  // HIERARQUIA EMPRESARIAL
  // ====================================
  
  // Usuários
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: NewUser): Promise<User>;
  getMasterUsers(): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  getUsersByCompany(companyId: number): Promise<User[]>;
  updateUserRole(userId: number, role: string): Promise<User | null>;
  updateUser(id: number, user: Partial<NewUser>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  
  // Empresas
  getCompanies(): Promise<Company[]>;
  getCompaniesByCreator(creatorId: number): Promise<Company[]>;
  getCompanyById(id: number): Promise<Company | null>;
  createCompany(company: NewCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<NewCompany>): Promise<Company | null>;
  deleteCompany(id: number): Promise<boolean>;
  
  // Filiais
  getBranches(companyId?: number): Promise<Branch[]>;
  getBranchesByCompany(companyId: number): Promise<Branch[]>;
  createBranch(branch: NewBranch): Promise<Branch>;
  updateBranch(id: number, branch: Partial<NewBranch>): Promise<Branch | null>;
  deleteBranch(id: number): Promise<boolean>;
  
  // Permissões
  getUserPermissions(userId: number): Promise<UserPermission[]>;
  updateUserPermissions(userId: number, permissions: string[]): Promise<boolean>;
  
  // ====================================
  // OPERAÇÕES DE NEGÓCIO
  // ====================================
  
  // Produtos
  getProducts(branchId?: number, companyId?: number): Promise<Product[]>;
  createProduct(product: NewProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<NewProduct>): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Vendas
  getSales(branchId?: number, companyId?: number): Promise<Sale[]>;
  createSale(sale: NewSale): Promise<Sale>;
  
  // Clientes
  getClients(branchId?: number, companyId?: number): Promise<Client[]>;
  createClient(client: NewClient): Promise<Client>;
  updateClient(id: number, client: Partial<NewClient>): Promise<Client | null>;
  deleteClient(id: number): Promise<boolean>;
  
  // Agendamentos
  getAppointments(branchId?: number, companyId?: number): Promise<Appointment[]>;
  createAppointment(appointment: NewAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Financeiro
  getFinancialEntries(branchId?: number, companyId?: number): Promise<FinancialEntry[]>;
  createFinancialEntry(entry: NewFinancialEntry): Promise<FinancialEntry>;
  updateFinancialEntry(id: number, entry: Partial<FinancialEntry>): Promise<FinancialEntry | null>;
  deleteFinancialEntry(id: number): Promise<boolean>;
  
  // Transferências
  getTransfers(companyId?: number): Promise<Transfer[]>;
  createTransfer(transfer: NewTransfer): Promise<Transfer>;
  updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null>;
  deleteTransfer(id: number): Promise<boolean>;
  
  // Transferências de Dinheiro
  getMoneyTransfers(companyId?: number): Promise<MoneyTransfer[]>;
  createMoneyTransfer(transfer: NewMoneyTransfer): Promise<MoneyTransfer>;
  updateMoneyTransfer(id: number, transfer: Partial<MoneyTransfer>): Promise<MoneyTransfer | null>;
  deleteMoneyTransfer(id: number): Promise<boolean>;
}

// ====================================
// IMPLEMENTAÇÃO SUPABASE COM NOVA HIERARQUIA
// ====================================

export class SupabaseStorage implements Storage {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.VITE_SUPABASE_URL!;
    // Use service role key for backend operations (full access)
    this.apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
  }

  private async request(path: string, options: RequestInit = {}, companyId?: number): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    // Se companyId fornecido, definir contexto RLS
    if (companyId) {
      headers['rls-company-id'] = companyId.toString();
    }

    const response = await fetch(`${this.baseUrl}/rest/v1/${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Método para definir contexto RLS via SQL
  private async setRLSContext(companyId: number): Promise<void> {
    if (companyId) {
      await this.request(`rpc/set_config`, {
        method: 'POST',
        body: JSON.stringify({
          setting_name: 'rls.company_id',
          setting_value: companyId.toString(),
          is_local: true
        })
      });
    }
  }

  // ====================================
  // USUÁRIOS
  // ====================================

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.request(`users?email=eq.${email}&select=*`);
    return users[0] || null;
  }

  async createUser(user: NewUser): Promise<User> {
    const [created] = await this.request('users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return created;
  }

  async updateUser(id: number, user: Partial<NewUser>): Promise<User | null> {
    const [updated] = await this.request(`users?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),
    });
    return updated || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.request(`users?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  async getUsersByCompany(companyId: number): Promise<User[]> {
    return this.request(`users?company_id=eq.${companyId}&select=*`);
  }

  async getMasterUsers(): Promise<User[]> {
    return this.request(`users?role=eq.master&select=*`);
  }

  async getAllUsers(): Promise<User[]> {
    return this.request(`users?select=*`);
  }

  async updateUserRole(id: number, role: string): Promise<User | null> {
    const [updated] = await this.request(`users?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
    return updated || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const users = await this.request(`users?id=eq.${id}&select=*`);
    return users[0] || null;
  }

  // ====================================
  // EMPRESAS
  // ====================================

  async getCompanies(): Promise<Company[]> {
    return this.request('companies?select=*&order=name.asc');
  }

  async getCompaniesByCreator(creatorId: number): Promise<Company[]> {
    return this.request(`companies?created_by=eq.${creatorId}&select=*&order=name.asc`);
  }

  async getCompanyById(id: number): Promise<Company | null> {
    const companies = await this.request(`companies?id=eq.${id}&select=*`);
    return companies[0] || null;
  }

  async createCompany(company: NewCompany): Promise<Company> {
    const [created] = await this.request('companies', {
      method: 'POST',
      body: JSON.stringify(company),
    });
    return created;
  }

  async updateCompany(id: number, company: Partial<NewCompany>): Promise<Company | null> {
    const [updated] = await this.request(`companies?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(company),
    });
    return updated || null;
  }

  async deleteCompany(id: number): Promise<boolean> {
    await this.request(`companies?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  // ====================================
  // FILIAIS
  // ====================================

  async getBranches(companyId?: number): Promise<Branch[]> {
    const filter = companyId ? `company_id=eq.${companyId}&` : '';
    return this.request(`branches?${filter}select=*&order=name.asc`);
  }

  async getBranchesByCompany(companyId: number): Promise<Branch[]> {
    return this.request(`branches?company_id=eq.${companyId}&select=*&order=name.asc`);
  }

  async createBranch(branch: NewBranch): Promise<Branch> {
    const [created] = await this.request('branches', {
      method: 'POST',
      body: JSON.stringify(branch),
    });
    return created;
  }

  async updateBranch(id: number, branch: Partial<NewBranch>): Promise<Branch | null> {
    const [updated] = await this.request(`branches?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(branch),
    });
    return updated || null;
  }

  async deleteBranch(id: number): Promise<boolean> {
    await this.request(`branches?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  // ====================================
  // PERMISSÕES
  // ====================================

  async getUserPermissions(userId: number): Promise<UserPermission[]> {
    return this.request(`user_permissions?user_id=eq.${userId}&select=*`);
  }

  async updateUserPermissions(userId: number, permissions: string[]): Promise<boolean> {
    // Delete existing permissions
    await this.request(`user_permissions?user_id=eq.${userId}`, { method: 'DELETE' });
    
    // Insert new permissions
    const permissionObjects = permissions.map(permission => ({
      user_id: userId,
      permission,
      created_at: new Date().toISOString(),
    }));
    
    await this.request('user_permissions', {
      method: 'POST',
      body: JSON.stringify(permissionObjects),
    });
    
    return true;
  }



  // ====================================
  // PRODUTOS
  // ====================================

  async getProducts(branchId?: number, companyId?: number): Promise<Product[]> {
    let filter = '';
    if (branchId) filter += `branch_id=eq.${branchId}&`;
    else if (companyId) filter += `company_id=eq.${companyId}&`;
    
    return this.request(`products?${filter}select=*&order=name.asc`);
  }

  async createProduct(product: NewProduct): Promise<Product> {
    const [created] = await this.request('products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return created;
  }

  async updateProduct(id: number, product: Partial<NewProduct>): Promise<Product | null> {
    const [updated] = await this.request(`products?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(product),
    });
    return updated || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await this.request(`products?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  // ====================================
  // VENDAS
  // ====================================

  async getSales(branchId?: number, companyId?: number): Promise<Sale[]> {
    let filter = '';
    if (branchId) filter += `branch_id=eq.${branchId}&`;
    else if (companyId) filter += `company_id=eq.${companyId}&`;
    
    return this.request(`sales?${filter}select=*&order=sale_date.desc`);
  }

  async createSale(sale: NewSale): Promise<Sale> {
    const [created] = await this.request('sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
    return created;
  }

  // ====================================
  // CLIENTES
  // ====================================

  async getClients(branchId?: number, companyId?: number): Promise<Client[]> {
    let filter = '';
    if (branchId) filter += `branch_id=eq.${branchId}&`;
    else if (companyId) filter += `company_id=eq.${companyId}&`;
    
    return this.request(`clients?${filter}select=*&order=name.asc`);
  }

  async createClient(client: NewClient): Promise<Client> {
    const [created] = await this.request('clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
    return created;
  }

  async updateClient(id: number, client: Partial<NewClient>): Promise<Client | null> {
    const [updated] = await this.request(`clients?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(client),
    });
    return updated || null;
  }

  async deleteClient(id: number): Promise<boolean> {
    await this.request(`clients?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  // ====================================
  // AGENDAMENTOS
  // ====================================

  async getAppointments(branchId?: number, companyId?: number): Promise<Appointment[]> {
    let filter = '';
    if (branchId) filter += `branch_id=eq.${branchId}&`;
    else if (companyId) filter += `company_id=eq.${companyId}&`;
    
    return this.request(`appointments?${filter}select=*&order=appointment_date.asc`);
  }

  async createAppointment(appointment: NewAppointment): Promise<Appointment> {
    const [created] = await this.request('appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
    return created;
  }

  async updateAppointment(id: number, appointment: Partial<NewAppointment>): Promise<Appointment | null> {
    const [updated] = await this.request(`appointments?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(appointment),
    });
    return updated || null;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    await this.request(`appointments?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  // ====================================
  // FINANCEIRO
  // ====================================

  async getFinancialEntries(branchId?: number, companyId?: number): Promise<FinancialEntry[]> {
    let filter = '';
    if (branchId) filter += `branch_id=eq.${branchId}&`;
    else if (companyId) filter += `company_id=eq.${companyId}&`;
    
    return this.request(`financial_entries?${filter}select=*&order=created_at.desc`);
  }

  async createFinancialEntry(entry: NewFinancialEntry): Promise<FinancialEntry> {
    const [created] = await this.request('financial_entries', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
    return created;
  }

  async updateFinancialEntry(id: number, entry: Partial<FinancialEntry>): Promise<FinancialEntry | null> {
    const [updated] = await this.request(`financial_entries?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(entry),
    });
    return updated || null;
  }

  async deleteFinancialEntry(id: number): Promise<boolean> {
    await this.request(`financial_entries?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  async revertFinancialEntry(id: number): Promise<FinancialEntry | null> {
    const [updated] = await this.request(`financial_entries?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        status: 'pending',
        paid_date: null,
        updated_at: new Date().toISOString()
      }),
    });
    return updated || null;
  }

  // ====================================
  // TRANSFERÊNCIAS
  // ====================================

  async getTransfers(companyId?: number): Promise<Transfer[]> {
    const filter = companyId ? `company_id=eq.${companyId}&` : '';
    
    // Fallback para JOIN manual por enquanto - PostgREST syntax complexa
    const transfersQuery = `transfers?${filter}select=*&order=transfer_date.desc`;
    const productsQuery = 'products?select=id,name';
    
    try {
      // Buscar dados separadamente
      const [transfers, products] = await Promise.all([
        this.request(transfersQuery),
        this.request(productsQuery)
      ]);
      
      console.log('[STORAGE DEBUG] Transfers found:', transfers?.length || 0);
      console.log('[STORAGE DEBUG] Products found:', products?.length || 0);
      console.log('[STORAGE DEBUG] First transfer productId:', transfers[0]?.productId);
      console.log('[STORAGE DEBUG] First product:', products[0]);
      
      if (!transfers || !Array.isArray(transfers)) {
        console.log('[STORAGE] No transfers found');
        return [];
      }
      
      if (!products || !Array.isArray(products)) {
        console.log('[STORAGE] No products found - returning transfers without names');
        return transfers.map((t: any) => ({ 
          ...t, 
          productName: `Produto ID: ${t.productId}` 
        }));
      }
      
      // JOIN manual
      const result = transfers.map((transfer: any) => {
        const product = products.find((p: any) => p.id === transfer.productId);
        const productName = product?.name || `Produto ID: ${transfer.productId}`;
        
        console.log(`[STORAGE] Transfer ${transfer.id}: productId=${transfer.productId} -> ${productName}`);
        
        return {
          ...transfer,
          productName
        };
      });
      
      console.log('[STORAGE] Returning', result.length, 'transfers with productName');
      return result;
    } catch (error) {
      console.error('[STORAGE ERROR] Error in getTransfers:', error);
      return [];
    }
  }

  async createTransfer(transfer: NewTransfer): Promise<Transfer> {
    const [created] = await this.request('transfers', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
    return created;
  }

  async updateTransfer(id: number, transfer: Partial<NewTransfer>): Promise<Transfer | null> {
    const [updated] = await this.request(`transfers?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(transfer),
    });
    return updated || null;
  }

  async deleteTransfer(id: number): Promise<boolean> {
    await this.request(`transfers?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }

  // ====================================
  // TRANSFERÊNCIAS DE DINHEIRO
  // ====================================

  async getMoneyTransfers(companyId?: number): Promise<MoneyTransfer[]> {
    const filter = companyId ? `company_id=eq.${companyId}&` : '';
    return this.request(`money_transfers?${filter}select=*&order=transfer_date.desc`);
  }

  async createMoneyTransfer(transfer: NewMoneyTransfer): Promise<MoneyTransfer> {
    const [created] = await this.request('money_transfers', {
      method: 'POST',
      body: JSON.stringify(transfer),
    });
    return created;
  }

  async updateMoneyTransfer(id: number, transfer: Partial<MoneyTransfer>): Promise<MoneyTransfer | null> {
    const [updated] = await this.request(`money_transfers?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(transfer),
    });
    return updated || null;
  }

  async deleteMoneyTransfer(id: number): Promise<boolean> {
    await this.request(`money_transfers?id=eq.${id}`, { method: 'DELETE' });
    return true;
  }
}