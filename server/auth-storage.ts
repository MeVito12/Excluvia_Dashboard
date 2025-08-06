import { AuthUser, hashPassword, comparePassword } from './auth.js';

export interface AuthStorage {
  // Autenticação
  loginUser(email: string, password: string): Promise<AuthUser | null>;
  createUser(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    company_id?: string;
    branch_id?: string;
    role?: string;
    business_category?: string;
  }): Promise<AuthUser>;
  getUserById(id: string): Promise<AuthUser | null>;
  getUserByEmail(email: string): Promise<AuthUser | null>;
  
  // Empresas
  createCompany(companyData: {
    name: string;
    business_category: string;
    cnpj?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    created_by: string;
  }): Promise<any>;
  
  // Filiais
  createBranch(branchData: {
    company_id: string;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    email?: string;
    is_main?: boolean;
    manager_id?: string;
  }): Promise<any>;
}

export class SupabaseAuthStorage implements AuthStorage {
  private supabaseUrl: string;
  private supabaseServiceKey: string;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL!;
    this.supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.supabaseUrl}/rest/v1/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.supabaseServiceKey,
        'Authorization': `Bearer ${this.supabaseServiceKey}`,
        'Prefer': 'return=representation',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase error: ${error}`);
    }

    return response.json();
  }

  async loginUser(email: string, password: string): Promise<AuthUser | null> {
    try {
      console.log('🔍 Buscando usuário:', email);
      
      // Buscar senha na tabela profiles (Supabase Auth)
      const profiles = await this.request(`profiles?email=eq.${email}&select=id,email,senha`);
      
      if (!profiles || profiles.length === 0) {
        console.log('❌ Nenhum usuário encontrado em profiles para:', email);
        return null;
      }

      const profile = profiles[0];
      console.log('✅ Profile encontrado:', { id: profile.id, email: profile.email });
      
      // Verificar senha (assumindo que está em texto plano na tabela profiles)
      if (profile.senha !== password) {
        console.log('❌ Senha inválida para usuário:', email);
        return null;
      }

      // Buscar dados do usuário na tabela auth_users
      const users = await this.request(`auth_users?id=eq.${profile.id}&select=*`);
      
      if (!users || users.length === 0) {
        console.log('❌ Usuário não encontrado em auth_users para ID:', profile.id);
        return null;
      }

      const user = users[0];
      console.log('🎯 Login realizado com sucesso:', email);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        company_id: user.company_id,
        branch_id: user.branch_id,
        role: user.role,
        business_category: user.business_category
      };

    } catch (error) {
      console.error('❌ Erro no login:', error);
      return null;
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    company_id?: string;
    branch_id?: string;
    role?: string;
    business_category?: string;
  }): Promise<AuthUser> {
    const passwordHash = await hashPassword(userData.password);
    
    console.log('🔐 Criando usuário:', userData.email);
    
    // Criar na tabela auth_users
    const authUsers = await this.request('auth_users', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password_hash: passwordHash,
        name: userData.name,
        phone: userData.phone,
        company_id: userData.company_id,
        branch_id: userData.branch_id,
        role: userData.role || 'user',
        business_category: userData.business_category,
      }),
    });

    if (!authUsers || authUsers.length === 0) {
      throw new Error('Falha ao criar usuário');
    }

    const created = authUsers[0];
    console.log('✅ Usuário criado:', created.id);

    return {
      id: created.id,
      email: created.email,
      name: created.name,
      company_id: created.company_id,
      branch_id: created.branch_id,
      role: created.role,
      business_category: created.business_category
    };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    try {
      // Buscar na tabela auth_users
      const users = await this.request(`auth_users?id=eq.${id}&select=*`);
      
      if (!users || users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        company_id: user.company_id,
        branch_id: user.branch_id,
        role: user.role,
        business_category: user.business_category
      };
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      // Buscar na tabela auth_users
      const users = await this.request(`auth_users?email=eq.${email}&select=*`);
      
      if (!users || users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        company_id: user.company_id,
        branch_id: user.branch_id,
        role: user.role,
        business_category: user.business_category
      };
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  }

  async createCompany(companyData: {
    name: string;
    business_category: string;
    cnpj?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    created_by: string;
  }): Promise<any> {
    const [created] = await this.request('companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
    return created;
  }

  async createBranch(branchData: {
    company_id: string;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    email?: string;
    is_main?: boolean;
    manager_id?: string;
  }): Promise<any> {
    const [created] = await this.request('branches', {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
    return created;
  }
}