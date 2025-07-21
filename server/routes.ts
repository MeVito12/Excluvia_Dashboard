import type { Express } from "express";
import { createServer, type Server } from "http";
import { databaseManager } from "./database-manager";
import { 
  appointmentSchema
} from "@shared/schema";
import GoogleSheetsManager from './google-sheets';

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", async (_req, res) => {
    const dbStatus = databaseManager.getStatus();
    res.json({ 
      status: "ok", 
      database: dbStatus 
    });
  });

  // Authentication route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const storage = await databaseManager.getStorage();
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: userWithoutPassword,
        message: "Login realizado com sucesso" 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = 1; // TODO: Get from session/auth
      const appointments = await storage.getAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(503).json({ 
        error: "Database not available", 
        message: "Please execute SQL schema in Supabase Dashboard first"
      });
    }
  });

  // Get single appointment route removed as not in storage interface

  app.post("/api/appointments", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = 1; // TODO: Get from session/auth
      const validatedData = appointmentSchema.parse({
        ...req.body,
        userId: 1, // TODO: Get from session/auth
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      });
      
      const appointment = await storage.createAppointment(validatedData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ error: "Dados inválidos para criar agendamento", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Rotas básicas de produtos
  app.get("/api/products", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = 1;
      const businessCategory = "salao";
      const products = await storage.getProducts(userId, businessCategory);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  // Rotas básicas de vendas
  app.get("/api/sales", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = 1;
      const businessCategory = "salao";
      const sales = await storage.getSales(userId, businessCategory);
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });

  // Rotas básicas de clientes
  app.get("/api/clients", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = 1;
      const businessCategory = "salao";
      const clients = await storage.getClients(userId, businessCategory);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });

  // Google Sheets Integration Routes para Junior Profile
  let sheetsManager: GoogleSheetsManager | null = null;
  const initSheetsManager = () => {
    if (!sheetsManager) {
      sheetsManager = new GoogleSheetsManager();
    }
    return sheetsManager;
  };

  // Inicializar planilha Google Sheets
  app.post("/api/sheets/init", async (req, res) => {
    try {
      const manager = initSheetsManager();
      const spreadsheetId = await manager.createBaseSheet();
      
      res.json({
        success: true,
        message: 'Planilha inicializada com sucesso',
        spreadsheetId
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao inicializar planilha',
        error: error.message
      });
    }
  });

  // Obter produtos da planilha
  app.get("/api/sheets/products", async (req, res) => {
    try {
      const manager = initSheetsManager();
      const products = await manager.getProductsFromSheets();
      
      res.json({
        success: true,
        products
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos da planilha',
        error: error.message
      });
    }
  });

  // Adicionar produto à planilha
  app.post("/api/sheets/products", async (req, res) => {
    try {
      const manager = initSheetsManager();
      const product = req.body;
      
      if (!product.id) {
        product.id = 'PROD' + Date.now().toString().slice(-6);
      }
      
      await manager.syncProductToSheets(product);
      
      res.json({
        success: true,
        message: 'Produto adicionado à planilha',
        product
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao adicionar produto',
        error: error.message
      });
    }
  });

  // Atualizar estoque na planilha
  app.put("/api/sheets/products/:id/stock", async (req, res) => {
    try {
      const manager = initSheetsManager();
      const { id } = req.params;
      const { quantity, movement } = req.body;
      
      await manager.updateStock(id, quantity, movement || 'Ajuste Manual');
      
      res.json({
        success: true,
        message: 'Estoque atualizado na planilha'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar estoque',
        error: error.message
      });
    }
  });

  // Obter estatísticas da planilha
  app.get("/api/sheets/stats", async (req, res) => {
    try {
      const manager = initSheetsManager();
      const stats = await manager.getSheetStats();
      
      res.json({
        success: true,
        stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erro ao obter estatísticas',
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
