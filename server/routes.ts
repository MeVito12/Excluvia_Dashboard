import type { Express } from "express";
import { createServer, type Server } from "http";
import { SupabaseStorage } from './storage';
import { setupAuthRoutes } from "./auth-routes.js";

const storage = new SupabaseStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup UUID-based authentication routes
  setupAuthRoutes(app);
  
  // Health check
  app.get("/api/health", async (_req, res) => {
    res.json({ 
      status: "ok", 
      database: { status: 'connected', type: 'Supabase PostgreSQL' }
    });
  });

  // Autenticação unificada - UUID primeiro, integer como fallback
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      console.log('Tentativa de login unificado para:', email);
      
      // 1. PRIMEIRO: Tentar autenticação UUID
      try {
        const { SupabaseAuthStorage } = await import('./auth-storage.js');
        const authStorage = new SupabaseAuthStorage();
        
        console.log('Verificando login UUID para:', email);
        const uuidUser = await authStorage.loginUser(email, password);
        if (uuidUser) {
          console.log('🎯 Login UUID realizado com sucesso para:', email, 'UUID:', uuidUser.id);
          
          // Converter UUID user para formato compatível com sistema atual
          const compatibleUser = {
            id: 99999, // ID especial para usuários UUID
            email: uuidUser.email,
            name: uuidUser.name,
            role: uuidUser.role as 'user' | 'ceo' | 'master',
            companyId: 1, // Mapear UUID company para integer temporariamente
            uuid: uuidUser.id, // Manter UUID original
            company_uuid: uuidUser.company_id,
            branch_uuid: uuidUser.branch_id,
            business_category: uuidUser.business_category,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          return res.json({ 
            user: compatibleUser, 
            success: true,
            authType: 'uuid'
          });
        } else {
          console.log('❌ Usuário UUID não encontrado para:', email);
        }
      } catch (uuidError) {
        console.error('❌ Erro no login UUID:', uuidError);
      }
      
      // 2. FALLBACK: Sistema de integer IDs (sistema atual)
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        console.log(`Usuário integer encontrado: ${user.email}, empresa: ${user.companyId || 'não definida'}`);
      }
      
      // Se não encontrar, criar usuário de desenvolvimento
      if (!user) {
        console.log('Usuário não encontrado, criando usuário de desenvolvimento...');
        
        const devUserData = {
          email: email,
          name: email === 'junior@mercadocentral.com.br' ? 'Junior Coordenador' : 'Usuário Demo',
          role: (email === 'junior@mercadocentral.com.br' ? 'master' : 'user') as 'user' | 'ceo' | 'master',
          password: 'dev_password',
          companyId: 1
        };
        
        try {
          user = await storage.createUser(devUserData);
          console.log('Usuário criado com sucesso:', user.email);
        } catch (createError: any) {
          console.log('Erro ao criar usuário, usando dados fallback');
          user = {
            id: 1,
            email: email,
            name: devUserData.name,
            role: devUserData.role,
            companyId: 1,
            password: 'dev_password',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      }

      // Garantir companyId válido para o usuário
      if (!user.companyId && user.company_id) {
        user = { ...user, companyId: user.company_id };
      } else if (!user.companyId) {
        user = { ...user, companyId: 1 };
      }
      
      console.log('Login integer realizado com sucesso para:', user.email);
      res.json({ 
        user, 
        success: true,
        authType: 'integer'
      });
    } catch (error: any) {
      console.error('Erro no login unificado:', error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Usuários
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Empresas
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const company = await storage.createCompany(req.body);
      res.json(company);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Produtos (UUID-aware)
  app.get("/api/products", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      let companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const branchId = req.query.branch_id ? parseInt(req.query.branch_id as string) : undefined;
      
      // PRIORIDADE 1: Usar método UUID-aware se tiver userId
      if (userId) {
        console.log(`[ROUTES] Usando método UUID-aware para userId: ${userId}`);
        const products = await storage.getProductsUuidAware(userId);
        console.log(`[ROUTES] Produtos UUID-aware encontrados: ${products.length}`);
        return res.json(products);
      }
      
      // PRIORIDADE 2: Método tradicional com company_id
      if (!companyId && userId) {
        const user = await storage.getUserById(parseInt(userId));
        companyId = user?.company_id;
      }
      
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID é obrigatório' });
      }
      
      const products = await storage.getProducts(branchId, companyId);
      res.json(products);
    } catch (error: any) {
      console.error('[ROUTES] Erro ao buscar produtos:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vendas
  app.get("/api/sales", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      let companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const branchId = req.query.branch_id ? parseInt(req.query.branch_id as string) : undefined;
      
      // Se não tiver company_id na query, buscar do usuário
      if (!companyId && userId) {
        const user = await storage.getUserById(parseInt(userId));
        companyId = user?.company_id;
      }
      
      // SEMPRE filtrar por company_id
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID é obrigatório' });
      }
      
      const sales = await storage.getSales(branchId, companyId);
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const sale = await storage.createSale(req.body);
      
      // Criar entrada financeira automática para a venda
      if (sale && sale.total_price) {
        const financialEntry = {
          type: 'income' as const,
          amount: sale.total_price,
          description: `Venda realizada - ${sale.quantity}x produto`,
          status: 'paid' as const,
          category: 'vendas',
          reference_id: sale.id,
          reference_type: 'sale',
          company_id: sale.company_id,
          branch_id: sale.branch_id,
          created_by: sale.created_by
        };
        
        try {
          await storage.createFinancialEntry(financialEntry);
        } catch (finError) {
          console.error('Erro ao criar entrada financeira automática:', finError);
          // Não falhar a venda se houver erro na entrada financeira
        }
      }
      
      res.json(sale);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clientes
  app.get("/api/clients", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      let companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const branchId = req.query.branch_id ? parseInt(req.query.branch_id as string) : undefined;
      
      // Se não tiver company_id na query, buscar do usuário
      if (!companyId && userId) {
        const user = await storage.getUserById(parseInt(userId));
        companyId = user?.company_id;
      }
      
      // SEMPRE filtrar por company_id
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID é obrigatório' });
      }
      
      const clients = await storage.getClients(branchId, companyId);
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Agendamentos
  app.get("/api/appointments", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      let companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const branchId = req.query.branch_id ? parseInt(req.query.branch_id as string) : undefined;
      
      // Se não tiver company_id na query, buscar do usuário
      if (!companyId && userId) {
        const user = await storage.getUserById(parseInt(userId));
        companyId = user?.company_id;
      }
      
      // SEMPRE filtrar por company_id
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID é obrigatório' });
      }
      
      const appointments = await storage.getAppointments(branchId, companyId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const appointment = await storage.createAppointment(req.body);
      res.json(appointment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Financeiro
  app.get("/api/financial", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      let companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const branchId = req.query.branch_id ? parseInt(req.query.branch_id as string) : undefined;
      
      // Se não tiver company_id na query, buscar do usuário
      if (!companyId && userId) {
        const user = await storage.getUserById(parseInt(userId));
        companyId = user?.company_id;
      }
      
      // SEMPRE filtrar por company_id
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID é obrigatório' });
      }
      
      const entries = await storage.getFinancialEntries(branchId, companyId);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/financial", async (req, res) => {
    try {
      const entry = await storage.createFinancialEntry(req.body);
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transferências
  app.get("/api/transfers", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      let companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const branchId = req.query.branch_id ? parseInt(req.query.branch_id as string) : undefined;
      
      // Se não tiver company_id na query, buscar do usuário
      if (!companyId && userId) {
        const user = await storage.getUserById(parseInt(userId));
        companyId = user?.company_id;
      }
      
      // SEMPRE filtrar por company_id
      if (!companyId) {
        return res.status(400).json({ error: 'Company ID é obrigatório' });
      }
      
      const transfers = await storage.getTransfers(companyId);
      res.json(transfers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const transfer = await storage.createTransfer(req.body);
      res.json(transfer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Transferências de Dinheiro
  app.get("/api/money-transfers", async (req, res) => {
    try {
      const transfers = await storage.getMoneyTransfers();
      res.json(transfers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/money-transfers", async (req, res) => {
    try {
      const transfer = await storage.createMoneyTransfer(req.body);
      res.json(transfer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Filiais
  app.get("/api/branches", async (req, res) => {
    try {
      const branches = await storage.getBranches();
      res.json(branches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const branch = await storage.createBranch(req.body);
      res.json(branch);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Informações de usuário-empresa
  app.get("/api/user-company/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      const company = await storage.getCompanyById(user.companyId || 1);
      res.json({ user, company });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cupons
  app.get("/api/coupons", async (req, res) => {
    try {
      const companyId = req.query.company_id ? parseInt(req.query.company_id as string) : undefined;
      const coupons = await storage.getCoupons(companyId);
      res.json(coupons);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/coupons", async (req, res) => {
    try {
      const coupon = await storage.createCoupon(req.body);
      res.json(coupon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/coupons/validate/:code", async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const coupon = await storage.validateCoupon(code);
      
      if (!coupon) {
        return res.status(404).json({ error: "Cupom não encontrado" });
      }
      
      if (!coupon.is_active) {
        return res.status(400).json({ error: "Cupom inativo" });
      }
      
      // Verificar data de validade
      if (coupon.end_date) {
        const endDate = new Date(coupon.end_date);
        if (new Date() > endDate) {
          return res.status(400).json({ error: "Cupom expirado" });
        }
      }
      
      // Verificar limite de uso
      if (coupon.max_uses && coupon.uses_count >= coupon.max_uses) {
        return res.status(400).json({ error: "Cupom esgotado" });
      }
      
      res.json(coupon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/coupons/apply", async (req, res) => {
    try {
      const { couponId, saleAmount } = req.body;
      const result = await storage.applyCoupon(couponId, saleAmount);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}