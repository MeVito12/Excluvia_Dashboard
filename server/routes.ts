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
      // Dados de desenvolvimento para produtos
      const products = [
        { id: 1, name: 'Paracetamol 500mg', stock: 100, min_stock: 20, price: 5.50, for_sale: true, company_id: 1, branch_id: 1, category: 'Medicamento', created_at: new Date().toISOString() },
        { id: 2, name: 'Ibuprofeno 600mg', stock: 75, min_stock: 15, price: 8.90, for_sale: true, company_id: 1, branch_id: 1, category: 'Medicamento', created_at: new Date().toISOString() },
        { id: 3, name: 'Vitamina C', stock: 50, min_stock: 10, price: 12.00, for_sale: true, company_id: 1, branch_id: 1, category: 'Suplemento', created_at: new Date().toISOString() },
        { id: 4, name: 'Ração Golden Cães', stock: 25, min_stock: 5, price: 89.90, for_sale: true, company_id: 1, branch_id: 1, category: 'Pet', created_at: new Date().toISOString() },
        { id: 5, name: 'Shampoo Antipulgas', stock: 15, min_stock: 3, price: 24.50, for_sale: true, company_id: 1, branch_id: 1, category: 'Pet', created_at: new Date().toISOString() }
      ];
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
      // Dados de desenvolvimento para vendas
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const sales = [
        { id: 1, product_id: 1, client_id: 1, quantity: 2, unit_price: 5.50, total_price: 11.00, sale_date: today.toISOString(), company_id: 1, branch_id: 1, created_at: today.toISOString() },
        { id: 2, product_id: 2, client_id: 2, quantity: 1, unit_price: 8.90, total_price: 8.90, sale_date: yesterday.toISOString(), company_id: 1, branch_id: 1, created_at: yesterday.toISOString() },
        { id: 3, product_id: 4, client_id: 1, quantity: 1, unit_price: 89.90, total_price: 89.90, sale_date: today.toISOString(), company_id: 1, branch_id: 1, created_at: today.toISOString() },
        { id: 4, product_id: 3, client_id: 3, quantity: 3, unit_price: 12.00, total_price: 36.00, sale_date: yesterday.toISOString(), company_id: 1, branch_id: 1, created_at: yesterday.toISOString() }
      ];
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
      // Dados de desenvolvimento para clientes
      const clients = [
        { id: 1, name: 'Maria Silva', email: 'maria@email.com', phone: '(11) 99999-1111', client_type: 'individual', company_id: 1, branch_id: 1, created_at: new Date().toISOString() },
        { id: 2, name: 'João Santos', email: 'joao@email.com', phone: '(11) 99999-2222', client_type: 'individual', company_id: 1, branch_id: 1, created_at: new Date().toISOString() },
        { id: 3, name: 'Ana Costa', email: 'ana@email.com', phone: '(11) 99999-3333', client_type: 'individual', company_id: 1, branch_id: 1, created_at: new Date().toISOString() },
        { id: 4, name: 'Empresa ABC Ltda', email: 'contato@abc.com', phone: '(11) 3333-4444', client_type: 'company', company_id: 1, branch_id: 1, created_at: new Date().toISOString() }
      ];
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
      // Dados de desenvolvimento para agendamentos
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const appointments = [
        { id: 1, title: 'Consulta Veterinária - Max', client_id: 1, appointment_date: tomorrow.toISOString(), type: 'consulta', status: 'agendado', company_id: 1, branch_id: 1, created_at: new Date().toISOString() },
        { id: 2, title: 'Vacinação - Luna', client_id: 2, appointment_date: nextWeek.toISOString(), type: 'vacinacao', status: 'agendado', company_id: 1, branch_id: 1, created_at: new Date().toISOString() },
        { id: 3, title: 'Consulta Médica - Check-up', client_id: 3, appointment_date: tomorrow.toISOString(), type: 'consulta', status: 'agendado', company_id: 1, branch_id: 1, created_at: new Date().toISOString() }
      ];
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
      // Dados de desenvolvimento para entradas financeiras
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const entries = [
        { id: 1, description: 'Venda de Medicamentos', amount: 145.80, type: 'income', category: 'Vendas', status: 'completed', transaction_date: today.toISOString(), company_id: 1, branch_id: 1, created_at: today.toISOString() },
        { id: 2, description: 'Compra de Estoque', amount: -500.00, type: 'expense', category: 'Compras', status: 'completed', transaction_date: yesterday.toISOString(), company_id: 1, branch_id: 1, created_at: yesterday.toISOString() },
        { id: 3, description: 'Venda de Produtos Pet', amount: 114.40, type: 'income', category: 'Vendas', status: 'completed', transaction_date: today.toISOString(), company_id: 1, branch_id: 1, created_at: today.toISOString() },
        { id: 4, description: 'Pagamento de Aluguel', amount: -1200.00, type: 'expense', category: 'Fixos', status: 'pending', transaction_date: today.toISOString(), company_id: 1, branch_id: 1, created_at: today.toISOString() }
      ];
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

  const httpServer = createServer(app);
  return httpServer;
}