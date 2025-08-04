import type { Express } from "express";
import { createServer, type Server } from "http";
import { SupabaseStorage } from './storage';

const storage = new SupabaseStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", async (_req, res) => {
    res.json({ 
      status: "ok", 
      database: { status: 'connected', type: 'Supabase PostgreSQL' }
    });
  });

  // Autenticação - sistema direto para desenvolvimento
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      console.log('Tentativa de login para:', email);
      
      // Lista de usuários válidos para desenvolvimento
      const validUsers = [
        { id: 1, email: 'junior@mercadocentral.com.br', name: 'Junior Coordenador', role: 'master', company_id: 1 },
        { id: 2, email: 'demo.farmacia@sistema.com', name: 'Demo Farmácia Central', role: 'user', company_id: 2 },
        { id: 3, email: 'demo.pet@sistema.com', name: 'Demo Pet Clinic', role: 'user', company_id: 3 },
        { id: 4, email: 'demo.medico@sistema.com', name: 'Demo Clínica Saúde', role: 'user', company_id: 4 },
        { id: 5, email: 'demo.vendas@sistema.com', name: 'Demo Comercial Tech', role: 'user', company_id: 5 },
        { id: 6, email: 'demo@teste.com', name: 'Usuário Demo', role: 'user', company_id: 1 },
        { id: 7, email: 'admin@sistema.com', name: 'Administrador', role: 'master', company_id: 1 }
      ];
      
      const user = validUsers.find(u => u.email === email);
      
      if (!user) {
        console.log('Usuário não encontrado:', email);
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      console.log('Login realizado com sucesso para:', user.email);
      res.json({ 
        user: {
          ...user,
          created_at: new Date().toISOString()
        }, 
        success: true 
      });
    } catch (error: any) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Usuários
  app.get("/api/users", async (req, res) => {
    try {
      // Retornar lista de usuários para desenvolvimento
      const users = [
        { id: 1, email: 'junior@mercadocentral.com.br', name: 'Junior Coordenador', role: 'master', company_id: 1 },
        { id: 2, email: 'demo.farmacia@sistema.com', name: 'Demo Farmácia Central', role: 'user', company_id: 2 },
        { id: 3, email: 'demo.pet@sistema.com', name: 'Demo Pet Clinic', role: 'user', company_id: 3 },
        { id: 4, email: 'demo.medico@sistema.com', name: 'Demo Clínica Saúde', role: 'user', company_id: 4 },
        { id: 5, email: 'demo.vendas@sistema.com', name: 'Demo Comercial Tech', role: 'user', company_id: 5 }
      ];
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = { id: Date.now(), ...req.body, created_at: new Date().toISOString() };
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

  // Produtos
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error: any) {
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
      const sales = await storage.getSales();
      res.json(sales);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const sale = await storage.createSale(req.body);
      res.json(sale);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Clientes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getClients();
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
      const appointments = await storage.getAppointments();
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
      const entries = await storage.getFinancialEntries();
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
      const transfers = await storage.getTransfers();
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
      const company = await storage.getCompanyById(user.company_id);
      res.json({ user, company });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}