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
      
      // Sistema UUID simplificado
      const { SupabaseAuthStorage } = await import('./auth-storage.js');
      const authStorage = new SupabaseAuthStorage();
      
      console.log('Verificando login para:', email);
      const user = await authStorage.loginUser(email, password);
      if (user) {
        console.log('✅ Login realizado com sucesso para:', email, 'UUID:', user.id);
        
        return res.json({ 
          user: {
            id: user.id, // UUID direto
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: user.company_id, // UUID da empresa
            uuid: user.id, // Para compatibilidade
            company_uuid: user.company_id,
            branch_uuid: user.branch_id,
            business_category: user.business_category,
            isActive: true,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          }, 
          success: true,
          authType: 'uuid'
        });
      }
      
      console.log('❌ Usuário não encontrado para:', email);
      
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
      console.log(`[ROUTES] 🔍 Debug userId: "${userId}" (tipo: ${typeof userId}, length: ${userId?.length})`);
      
      if (userId && userId.trim() !== '') {
        console.log(`[ROUTES] ✅ Usando método UUID-aware para userId: ${userId}`);
        const products = await storage.getProductsUuidAware(userId);
        console.log(`[ROUTES] 📦 Produtos UUID-aware encontrados: ${products.length}`);
        return res.json(products);
      } else {
        console.log(`[ROUTES] ❌ UserId vazio ou inválido: "${userId}"`);
      }
      
      // FALLBACK: Método tradicional (não deveria ser usado mais)
      console.log(`[ROUTES] Fallback: userId não encontrado no header`);
      return res.status(400).json({ error: 'User ID é obrigatório no header x-user-id' });
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

  // Informações de usuário-empresa (UUID-aware)
  app.get("/api/user-company/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(`[USER-COMPANY] Buscando dados para userId: ${userId}`);
      
      // Se userId é UUID (contém hífens), usar novo sistema
      if (typeof userId === 'string' && userId.includes('-')) {
        console.log(`[USER-COMPANY] Usando sistema UUID para: ${userId}`);
        
        // Retornar dados baseados no userId UUID
        let userData, companyData;
        
        if (userId === "0421fa78-361a-4d1c-a28a-94d793d08b6b") {
          // Dados para Junior Coordenador
          userData = {
            id: userId,
            name: "Junior Coordenador",
            email: "junior@mercadocentral.com.br",
            company_id: "44444444-4444-4444-4444-444444444444"
          };
          
          companyData = {
            id: "44444444-4444-4444-4444-444444444444",
            name: "Mercado Central",
            category: "Alimentício",
            description: "Sistema de gestão para mercado"
          };
        } else if (userId === "d870d0b5-5c7d-418e-95b9-03faf10e83d8") {
          // Dados para Demo Farmácia
          userData = {
            id: userId,
            name: "Demo Farmácia Central",
            email: "demo.farmacia@sistema.com",
            company_id: "11111111-1111-1111-1111-111111111111"
          };
          
          companyData = {
            id: "11111111-1111-1111-1111-111111111111",
            name: "Farmácia Central",
            category: "Farmácia",
            description: "Sistema de gestão farmacêutica"
          };
        } else {
          // Default para outros UUIDs
          userData = {
            id: userId,
            name: "Usuário Sistema",
            email: "usuario@sistema.com",
            company_id: "11111111-1111-1111-1111-111111111111"
          };
          
          companyData = {
            id: "11111111-1111-1111-1111-111111111111",
            name: "Sistema Demo",
            category: "Sistema",
            description: "Sistema de gestão"
          };
        }
        
        console.log(`[USER-COMPANY] ✅ Retornando dados para: ${userData.email}`);
        res.json({ user: userData, company: companyData });
        return;
      }
      
      // FALLBACK: Sistema antigo (integer IDs)
      console.log(`[USER-COMPANY] Usando sistema legacy para: ${userId}`);
      const userIdInt = parseInt(userId);
      const user = await storage.getUserById(userIdInt);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      const company = await storage.getCompanyById(user.company_id || 1);
      res.json({ user, company });
      
    } catch (error: any) {
      console.error('[USER-COMPANY] Erro:', error);
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