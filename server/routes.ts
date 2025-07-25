import type { Express } from "express";
import { createServer, type Server } from "http";
import { databaseManager } from "./db/database-manager";
import { 
  appointmentSchema
} from "@shared/schema";


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

      // Criar a venda
      const newSale = await storage.createSale(saleData);

      // Buscar dados do produto e cliente para a entrada financeira
      const products = await storage.getProducts(saleData.userId, saleData.businessCategory);
      const clients = await storage.getClients(saleData.userId, saleData.businessCategory);
      
      const product = products.find(p => p.id === saleData.productId);
      const client = clients.find(c => c.id === saleData.clientId);

      // Criar entrada financeira automática para a venda
      if (product && client) {
        const financialEntryData = {
          userId: saleData.userId,
          businessCategory: saleData.businessCategory,
          type: 'income' as const,
          amount: saleData.totalPrice,
          description: `Venda - ${product.name} para ${client.name}`,
          dueDate: new Date(), // Vencimento imediato para vendas
          status: saleData.paymentMethod === 'cash' || saleData.paymentMethod === 'pix' ? 'paid' : 'pending' as const,
          isAutoGenerated: true,
          isBoleto: false,
          isInstallment: false,
          paymentMethod: saleData.paymentMethod || 'cash',
          paymentDate: saleData.paymentMethod === 'cash' || saleData.paymentMethod === 'pix' ? new Date() : undefined
        };

        await storage.createFinancialEntry(financialEntryData);
      }

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

  // Rotas para transferências
  app.get("/api/transfers", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = parseInt(req.query.userId as string) || 1;
      const businessCategory = req.query.businessCategory as string || "alimenticio";
      const transfers = await storage.getTransfers(userId, businessCategory);
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      res.status(500).json({ error: "Erro ao buscar transferências" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const transferData = req.body;
      
      // Validação básica
      if (!transferData.productId || !transferData.fromBranchId || !transferData.toBranchId || !transferData.quantity) {
        return res.status(400).json({ error: "Produto, filial origem, filial destino e quantidade são obrigatórios" });
      }

      const newTransfer = await storage.createTransfer(transferData);
      res.json(newTransfer);
    } catch (error) {
      console.error("Error creating transfer:", error);
      res.status(500).json({ error: "Erro ao criar transferência" });
    }
  });

  app.put("/api/transfers/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const transferId = parseInt(req.params.id);
      const transferData = req.body;
      
      const updatedTransfer = await storage.updateTransfer(transferId, transferData);
      if (!updatedTransfer) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer);
    } catch (error) {
      console.error("Error updating transfer:", error);
      res.status(500).json({ error: "Erro ao atualizar transferência" });
    }
  });

  // Rotas para filiais
  app.get("/api/branches", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = parseInt(req.query.userId as string) || 1;
      const businessCategory = req.query.businessCategory as string || "alimenticio";
      const branches = await storage.getBranches(userId, businessCategory);
      res.json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ error: "Erro ao buscar filiais" });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const branchData = req.body;
      
      // Validação básica
      if (!branchData.name || !branchData.address) {
        return res.status(400).json({ error: "Nome e endereço são obrigatórios" });
      }

      const newBranch = await storage.createBranch(branchData);
      res.json(newBranch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(500).json({ error: "Erro ao criar filial" });
    }
  });



  // Rotas financeiras
  app.get("/api/financial", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = parseInt(req.query.userId as string) || 1;
      const businessCategory = req.query.businessCategory as string || "salao";
      const entries = await storage.getFinancialEntries(userId, businessCategory);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching financial entries:", error);
      res.status(500).json({ error: "Erro ao buscar entradas financeiras" });
    }
  });

  app.post("/api/financial", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const entryData = req.body;
      
      // Validação básica
      if (!entryData.type || !entryData.amount || !entryData.description || !entryData.dueDate) {
        return res.status(400).json({ error: "Tipo, valor, descrição e data de vencimento são obrigatórios" });
      }

      const newEntry = await storage.createFinancialEntry({
        ...entryData,
        dueDate: new Date(entryData.dueDate)
      });
      res.json(newEntry);
    } catch (error) {
      console.error("Error creating financial entry:", error);
      res.status(500).json({ error: "Erro ao criar entrada financeira" });
    }
  });

  app.put("/api/financial/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const entryId = parseInt(req.params.id);
      const entryData = req.body;
      
      const updatedEntry = await storage.updateFinancialEntry(entryId, entryData);
      if (!updatedEntry) {
        return res.status(404).json({ error: "Entrada financeira não encontrada" });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error updating financial entry:", error);
      res.status(500).json({ error: "Erro ao atualizar entrada financeira" });
    }
  });

  app.delete("/api/financial/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const entryId = parseInt(req.params.id);
      
      const deleted = await storage.deleteFinancialEntry(entryId);
      if (!deleted) {
        return res.status(404).json({ error: "Entrada financeira não encontrada" });
      }
      
      res.json({ message: "Entrada financeira excluída com sucesso" });
    } catch (error) {
      console.error("Error deleting financial entry:", error);
      res.status(500).json({ error: "Erro ao excluir entrada financeira" });
    }
  });

  app.post("/api/financial/:id/pay", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const entryId = parseInt(req.params.id);
      const { paymentProof } = req.body;
      
      if (!paymentProof) {
        return res.status(400).json({ error: "Comprovante de pagamento é obrigatório" });
      }
      
      const updatedEntry = await storage.payFinancialEntry(entryId, paymentProof);
      if (!updatedEntry) {
        return res.status(404).json({ error: "Entrada financeira não encontrada" });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error paying financial entry:", error);
      res.status(500).json({ error: "Erro ao marcar como pago" });
    }
  });

  app.post("/api/financial/:id/revert", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const entryId = parseInt(req.params.id);
      
      const updatedEntry = await storage.revertFinancialEntry(entryId);
      if (!updatedEntry) {
        return res.status(404).json({ error: "Entrada financeira não encontrada" });
      }
      
      res.json(updatedEntry);
    } catch (error) {
      console.error("Error reverting financial entry:", error);
      res.status(500).json({ error: "Erro ao reverter pagamento" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
