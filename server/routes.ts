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

  // Autenticação unificada - APENAS UUID (Supabase)
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
      
      console.log('❌ Usuário não encontrado no Supabase:', email);
      return res.status(401).json({ 
        error: "Usuário não encontrado. Verifique se o email está cadastrado no sistema." 
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
      
      // OBRIGATÓRIO: User ID deve estar presente
      console.log(`[ROUTES] ERRO: userId não encontrado no header`);
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

  // Vendas (apenas Supabase UUID)
  app.get("/api/sales", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId || userId.trim() === '') {
        return res.status(400).json({ error: 'User ID é obrigatório no header x-user-id' });
      }
      
      const sales = await storage.getSalesUuidAware(userId);
      return res.json(sales);
    } catch (error: any) {
      console.error('[ROUTES] Erro ao buscar vendas:', error);
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

  // Clientes (apenas Supabase UUID)
  app.get("/api/clients", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId || userId.trim() === '') {
        return res.status(400).json({ error: 'User ID é obrigatório no header x-user-id' });
      }
      
      const clients = await storage.getClientsUuidAware(userId);
      return res.json(clients);
    } catch (error: any) {
      console.error('[ROUTES] Erro ao buscar clientes:', error);
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

  // Agendamentos (apenas Supabase UUID)
  app.get("/api/appointments", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId || userId.trim() === '') {
        return res.status(400).json({ error: 'User ID é obrigatório no header x-user-id' });
      }
      
      const appointments = await storage.getAppointmentsUuidAware(userId);
      return res.json(appointments);
    } catch (error: any) {
      console.error('[ROUTES] Erro ao buscar agendamentos:', error);
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

  // Financeiro (apenas Supabase UUID)
  app.get("/api/financial", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId || userId.trim() === '') {
        return res.status(400).json({ error: 'User ID é obrigatório no header x-user-id' });
      }
      
      const entries = await storage.getFinancialEntriesUuidAware(userId);
      return res.json(entries);
    } catch (error: any) {
      console.error('[ROUTES] Erro ao buscar financeiro:', error);
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

  // Transferências (apenas Supabase UUID)
  app.get("/api/transfers", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      
      if (!userId || userId.trim() === '') {
        return res.status(400).json({ error: 'User ID é obrigatório no header x-user-id' });
      }
      
      const transfers = await storage.getTransfersUuidAware(userId);
      return res.json(transfers);
    } catch (error: any) {
      console.error('[ROUTES] Erro ao buscar transferências:', error);
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
        
        // BUSCAR DADOS REAIS DO SUPABASE
        const { SupabaseAuthStorage } = await import('./auth-storage.js');
        const authStorage = new SupabaseAuthStorage();
        
        try {
          const userResult = await authStorage.getUserById(userId);
          
          if (userResult) {
            console.log(`[USER-COMPANY] ✅ Usuário encontrado no Supabase: ${userResult.email}`);
            
            const userData = {
              id: userResult.id,
              name: userResult.name,
              email: userResult.email,
              role: userResult.role,
              business_category: userResult.business_category,
              company_id: userResult.company_id,
              permissions: userResult.permissions
            };
            
            const companyData = {
              id: userResult.company_id,
              name: userResult.business_category === "Sistema" ? "Sistema de Gestão" : "Empresa Demo",
              category: userResult.business_category || "Sistema",
              description: "Sistema de gestão empresarial"
            };
            
            console.log(`[USER-COMPANY] ✅ Retornando dados reais para: ${userData.email}`);
            res.json({ user: userData, company: companyData });
            return;
          }
        } catch (error) {
          console.log(`[USER-COMPANY] ❌ Erro ao buscar no Supabase: ${error}`);
        }
        
        // Se não encontrar no Supabase, retornar erro
        console.log(`[USER-COMPANY] ❌ Usuário UUID não encontrado: ${userId}`);
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      
      // ERRO: User ID inválido ou não encontrado no sistema UUID
      console.log(`[USER-COMPANY] ❌ User ID inválido ou não encontrado: ${userId}`);
      return res.status(404).json({ error: "Usuário não encontrado no sistema" });
      
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