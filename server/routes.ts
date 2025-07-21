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

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const appointmentId = parseInt(req.params.id);
      const appointmentData = {
        ...req.body,
        startTime: req.body.startTime ? new Date(req.body.startTime) : undefined,
        endTime: req.body.endTime ? new Date(req.body.endTime) : undefined,
      };
      
      const updatedAppointment = await storage.updateAppointment(appointmentId, appointmentData);
      if (!updatedAppointment) {
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Erro ao atualizar agendamento" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const appointmentId = parseInt(req.params.id);
      
      const deleted = await storage.deleteAppointment(appointmentId);
      if (!deleted) {
        return res.status(404).json({ error: "Agendamento não encontrado" });
      }
      
      res.json({ message: "Agendamento excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ error: "Erro ao excluir agendamento" });
    }
  });

  // Rotas de produtos
  app.get("/api/products", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = parseInt(req.query.userId as string) || 1;
      const businessCategory = req.query.businessCategory as string || "salao";
      const products = await storage.getProducts(userId, businessCategory);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const productData = req.body;
      
      // Validação básica
      if (!productData.name || productData.price == null || productData.stock == null) {
        return res.status(400).json({ error: "Nome, preço e estoque são obrigatórios" });
      }

      const newProduct = await storage.createProduct(productData);
      res.json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const productId = parseInt(req.params.id);
      const productData = req.body;
      
      const updatedProduct = await storage.updateProduct(productId, productData);
      if (!updatedProduct) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const productId = parseInt(req.params.id);
      
      const deleted = await storage.deleteProduct(productId);
      if (!deleted) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      
      res.json({ message: "Produto excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Erro ao excluir produto" });
    }
  });

  // Rotas de vendas
  app.get("/api/sales", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = parseInt(req.query.userId as string) || 1;
      const businessCategory = req.query.businessCategory as string || "salao";
      const sales = await storage.getSales(userId, businessCategory);
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const saleData = req.body;
      
      // Validação básica
      if (!saleData.productId || !saleData.clientId || !saleData.quantity || !saleData.totalPrice) {
        return res.status(400).json({ error: "Produto, cliente, quantidade e preço total são obrigatórios" });
      }

      const newSale = await storage.createSale(saleData);
      res.json(newSale);
    } catch (error) {
      console.error("Error creating sale:", error);
      res.status(500).json({ error: "Erro ao criar venda" });
    }
  });

  // Rotas de clientes
  app.get("/api/clients", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = parseInt(req.query.userId as string) || 1;
      const businessCategory = req.query.businessCategory as string || "salao";
      const clients = await storage.getClients(userId, businessCategory);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const clientData = req.body;
      
      // Validação básica
      if (!clientData.name || !clientData.email || !clientData.phone) {
        return res.status(400).json({ error: "Nome, email e telefone são obrigatórios" });
      }

      const newClient = await storage.createClient(clientData);
      res.json(newClient);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const clientId = parseInt(req.params.id);
      const clientData = req.body;
      
      const updatedClient = await storage.updateClient(clientId, clientData);
      if (!updatedClient) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      
      res.json(updatedClient);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const clientId = parseInt(req.params.id);
      
      const deleted = await storage.deleteClient(clientId);
      if (!deleted) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      
      res.json({ message: "Cliente excluído com sucesso" });
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ error: "Erro ao excluir cliente" });
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
