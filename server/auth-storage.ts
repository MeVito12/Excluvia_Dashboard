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
      console.log('🔍 Buscando usuário UUID:', email);
      
      // Buscar usuário por email na tabela users (após limpeza)
      const users = await this.request(`users?email=eq.${email}&select=*`);
      
      console.log('📊 Usuários UUID encontrados:', users?.length || 0);
      
      if (!users || users.length === 0) {
        console.log('❌ Nenhum usuário UUID encontrado para:', email);
        return null;
      }

      const user = users[0];
      console.log('✅ Usuário UUID encontrado:', { id: user.id, email: user.email, name: user.name });
      
      // Verificação de senha real
      if (user.password_hash) {
        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) {
          console.log('❌ Senha inválida para usuário UUID:', email);
          return null;
        }
      } else {
        console.log('❌ Usuário sem senha definida:', email);
        return null;
      }

      console.log('🎯 Login UUID realizado com sucesso:', email);
      
      // SINCRONIZAÇÃO AUTOMÁTICA: Garantir que usuário existe na tabela users
      try {
        console.log('🔄 Verificando sincronização com tabela users...');
        const existingUser = await this.request(`users?email=eq.${email}&select=*`);
        
        if (!existingUser || existingUser.length === 0) {
          console.log('🔄 Usuário não encontrado na tabela users, criando...');
          await this.request('users', {
            method: 'POST',
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              phone: user.phone,
              company_id: user.company_id,
              branch_id: user.branch_id,
              role: user.role,
              business_category: user.business_category,
              uuid_reference: user.id
            }),
          });
          console.log('✅ Usuário sincronizado automaticamente no login');
        } else {
          console.log('✅ Usuário já sincronizado na tabela users');
        }
      } catch (syncError) {
        console.warn('⚠️ Erro na sincronização automática (não afeta login):', syncError);
      }

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
      console.error('❌ Erro no login UUID:', error);
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
    
    console.log('🔐 Criando usuário autenticado:', userData.email);
    
    // Criar primeiro na tabela auth_users (UUID)
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
      throw new Error('Falha ao criar usuário na autenticação');
    }

    const created = authUsers[0];
    console.log('✅ Usuário UUID criado:', created.id);

    // Criar automaticamente na tabela users (sincronização)
    try {
      console.log('🔄 Sincronizando com tabela users...');
      await this.request('users', {
        method: 'POST',
        body: JSON.stringify({
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          company_id: userData.company_id,
          branch_id: userData.branch_id,
          role: userData.role || 'user',
          business_category: userData.business_category,
          uuid_reference: created.id // Referência UUID
        }),
      });
      console.log('✅ Usuario sincronizado em ambas as tabelas');
    } catch (syncError) {
      console.warn('⚠️ Erro na sincronização com users:', syncError);
      // Não falhar a criação se houver erro na sincronização
    }

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
      // Buscar primeiro na tabela auth_users (UUID)
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
      // Buscar primeiro na tabela auth_users (UUID)
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
    const [created] = await this.request('auth_companies', {
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
    const [created] = await this.request('auth_branches', {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
    return created;
  }
}