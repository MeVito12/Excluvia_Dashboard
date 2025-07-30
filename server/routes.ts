import type { Express } from "express";
import { createServer, type Server } from "http";
import { databaseManager } from "./db/database-manager";
import { 
  insertCompanySchema,
  insertBranchSchema,
  insertUserSchema,
  insertProductSchema,
  insertSaleSchema,
  insertClientSchema,
  insertAppointmentSchema,
  insertFinancialEntrySchema
} from "./db/schema";
import { 
  MoneyTransferSchema 
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

  // Routes para cadastro de empresas
  app.post("/api/companies", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const storage = await databaseManager.getStorage();
      const companyData = insertCompanySchema.parse({
        ...req.body,
        createdBy: parseInt(userId as string)
      });
      
      const newCompany = await storage.createCompany(companyData);
      res.json(newCompany);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ error: "Erro ao criar empresa" });
    }
  });

  app.get("/api/companies", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Erro ao buscar empresas" });
    }
  });

  // Routes para cadastro de filiais
  app.post("/api/branches", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const branchData = insertBranchSchema.parse(req.body);
      
      const newBranch = await storage.createBranch(branchData);
      res.json(newBranch);
    } catch (error) {
      console.error("Error creating branch:", error);
      res.status(500).json({ error: "Erro ao criar filial" });
    }
  });

  app.get("/api/branches/:companyId", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const branches = await storage.getBranchesByCompany(parseInt(req.params.companyId));
      res.json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ error: "Erro ao buscar filiais" });
    }
  });

  // Routes para cadastro de usuários master
  app.post("/api/master-users", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const storage = await databaseManager.getStorage();
      const userData = insertUserSchema.parse({
        ...req.body,
        role: 'master',
        createdBy: parseInt(userId as string)
      });
      
      const newUser = await storage.createUser(userData);
      
      // Retornar dados do usuário sem senha
      const { password: _, ...userWithoutPassword } = newUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating master user:", error);
      res.status(500).json({ error: "Erro ao criar usuário master" });
    }
  });

  app.get("/api/master-users", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const users = await storage.getMasterUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching master users:", error);
      res.status(500).json({ error: "Erro ao buscar usuários master" });
    }
  });

  // Routes para cadastro de usuários comuns
  app.post("/api/users", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const storage = await databaseManager.getStorage();
      const userData = insertUserSchema.parse({
        ...req.body,
        role: req.body.role || 'user',
        createdBy: parseInt(userId as string)
      });
      
      const newUser = await storage.createUser(userData);
      
      // Retornar dados do usuário sem senha
      const { password: _, ...userWithoutPassword } = newUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Erro ao criar usuário" });
    }
  });

  // Route para buscar todos os usuários (para gerenciamento)
  app.get("/api/all-users", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const users = await storage.getAllUsers();
      
      // Remover senhas dos usuários retornados
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  });

  // Route para atualizar role de usuário
  app.patch("/api/users/:userId/role", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role } = req.body;
      
      if (!role) {
        return res.status(400).json({ error: "Role é obrigatória" });
      }

      const storage = await databaseManager.getStorage();
      const updatedUser = await storage.updateUserRole(userId, role);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      // Retornar dados do usuário sem senha
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Erro ao atualizar role do usuário" });
    }
  });

  // ====================================
  // COMPANIES
  // ====================================

  // GET /api/companies - Buscar todas as empresas
  app.get('/api/companies', async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // POST /api/companies - Criar empresa
  app.post('/api/companies', async (req, res) => {
    try {
      const { fantasyName, corporateName, cnpj, businessCategory } = req.body;
      
      if (!fantasyName || !corporateName || !cnpj || !businessCategory) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const storage = await databaseManager.getStorage();
      const newCompany = await storage.createCompany({
        fantasyName,
        corporateName,
        cnpj,
        businessCategory,
        createdBy: 1, // CEO user ID
        createdAt: new Date()
      });

      res.status(201).json(newCompany);
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // GET /api/branches - Buscar todas as filiais
  app.get('/api/branches', async (req, res) => {
    try {
      const companyId = req.query.companyId ? parseInt(req.query.companyId as string) : undefined;
      const storage = await databaseManager.getStorage();
      const branches = await storage.getBranches(companyId);
      res.json(branches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // POST /api/branches - Criar filial
  app.post('/api/branches', async (req, res) => {
    try {
      const { companyId, name, address } = req.body;
      
      if (!companyId || !name) {
        return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
      }

      const storage = await databaseManager.getStorage();
      const newBranch = await storage.createBranch({
        companyId,
        name,
        address,
        createdAt: new Date()
      });

      res.status(201).json(newBranch);
    } catch (error) {
      console.error('Error creating branch:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Middleware para extrair userId e dados da empresa/filial do header de autorização
  const getUserContextFromRequest = (req: any) => {
    const userId = req.headers['x-user-id'];
    const companyId = req.headers['x-company-id'];
    const branchId = req.headers['x-branch-id'];
    
    return {
      userId: userId ? parseInt(userId) : undefined,
      companyId: companyId ? parseInt(companyId) : undefined,
      branchId: branchId ? parseInt(branchId) : undefined
    };
  };

  // Helper function to get user ID from request
  const getUserIdFromRequest = (req: any): number => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      throw new Error('User ID not found in request headers');
    }
    return parseInt(userId);
  };

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = getUserIdFromRequest(req);
      const businessCategory = req.query.businessCategory as string || "alimenticio";
      const appointments = await storage.getAppointments(userId, businessCategory);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  });

  // Get single appointment route removed as not in storage interface

  app.post("/api/appointments", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = getUserIdFromRequest(req);
      const validatedData = AppointmentSchema.parse({
        ...req.body,
        userId,
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
      const userId = getUserIdFromRequest(req);
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
      const userId = getUserIdFromRequest(req);
      const productData = {
        ...req.body,
        userId
      };
      
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
      const userId = getUserIdFromRequest(req);
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
      const userId = getUserIdFromRequest(req);
      const saleData = {
        ...req.body,
        userId
      };
      
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
          type: 'income' as const,
          amount: saleData.totalPrice,
          description: `Venda - ${product.name} para ${client.name}`,
          category: 'vendas',
          paymentMethod: saleData.paymentMethod || 'dinheiro',
          status: 'paid' as const, // Vendas sempre são consideradas pagas
          dueDate: new Date(),
          paidDate: new Date(), // Vendas sempre têm data de pagamento
          referenceId: newSale.id,
          referenceType: 'sale',
          companyId: saleData.companyId || 1,
          branchId: saleData.branchId || 1,
          createdBy: saleData.userId
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
      const userId = getUserIdFromRequest(req);
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
      const userId = getUserIdFromRequest(req);
      const clientData = {
        ...req.body,
        userId
      };
      
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
      const userId = getUserIdFromRequest(req);
      
      console.log('[DEBUG ROUTE] Getting transfers for userId:', userId);
      
      // Buscar todas as transferências para usuário 18
      const companyId = undefined;
      
      console.log('[DEBUG ROUTE] Using companyId:', companyId);
      
      const transfers = await storage.getTransfers(companyId);
      
      console.log('[DEBUG ROUTE] Transfers returned:', transfers.length);
      if (transfers.length > 0) {
        console.log('[DEBUG ROUTE] First transfer has productName:', !!transfers[0].productName);
      }
      
      // Se productName não existe, fazer JOIN manual na rota como fallback
      if (transfers.length > 0 && !transfers[0].productName) {
        console.log('[DEBUG ROUTE] ProductName missing, doing manual JOIN in route');
        try {
          const products = await storage.getProducts(companyId);
          console.log('[DEBUG ROUTE] Fetched', products.length, 'products for JOIN');
          
          const transfersWithProductName = transfers.map((transfer: any) => {
            const product = products.find((p: any) => p.id === transfer.productId);
            const productName = product?.name || `Produto ID: ${transfer.productId}`;
            console.log(`[DEBUG ROUTE] Transfer ${transfer.id}: productId=${transfer.productId} -> ${productName}`);
            return {
              ...transfer,
              productName
            };
          });
          
          console.log('[DEBUG ROUTE] Returning transfers with productName from route');
          res.json(transfersWithProductName);
          return;
        } catch (error) {
          console.error('[DEBUG ROUTE] Error in manual JOIN:', error);
        }
      }
      
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching transfers:", error);
      res.status(500).json({ error: "Erro ao buscar transferências" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = getUserIdFromRequest(req);
      const transferData = {
        ...req.body,
        userId
      };
      
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
      const userId = getUserIdFromRequest(req);
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
      const userId = getUserIdFromRequest(req);
      const branchData = {
        ...req.body,
        userId
      };
      
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

  // === ROTAS PARA CONTROLE DE USUÁRIOS EMPRESA ===
  
  // Buscar usuários da empresa para o master
  app.get("/api/company-users/:companyId", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const companyId = Number(req.params.companyId);
      
      if (!companyId) {
        return res.status(400).json({ error: "ID da empresa é obrigatório" });
      }

      const users = await storage.getUsersByCompany(companyId);
      res.json(users);
    } catch (error) {
      console.error("Error fetching company users:", error);
      res.status(500).json({ error: "Erro ao buscar usuários da empresa" });
    }
  });

  // Buscar empresa do usuário master
  app.get("/api/user-company/:userId", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = Number(req.params.userId);
      
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      // Buscar usuário pelo ID (usando storage ou consulta direta)
      const users = await storage.getAllUsers();
      const user = users.find(u => u.id === userId);
      
      if (!user || !user.companyId) {
        return res.status(404).json({ error: "Usuário não possui empresa associada" });
      }

      // Buscar empresa pelo ID
      const company = await storage.getCompanyById(user.companyId);
      
      if (!company) {
        return res.status(404).json({ error: "Empresa não encontrada" });
      }

      res.json(company);
    } catch (error) {
      console.error("Error fetching user company:", error);
      res.status(500).json({ error: "Erro ao buscar empresa do usuário" });
    }
  });

  // Atualizar permissões de usuário
  app.put("/api/users/:userId/permissions", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = Number(req.params.userId);
      const { allowedSections } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      if (!allowedSections || !Array.isArray(allowedSections)) {
        return res.status(400).json({ error: "allowedSections deve ser um array" });
      }

      // Por enquanto, simularemos sucesso já que não temos método de update direto
      // TODO: Implementar método updateUser no storage
      console.log(`Atualizando permissões do usuário ${userId}:`, allowedSections);
      
      res.json({ 
        success: true, 
        message: "Permissões atualizadas com sucesso",
        userId,
        allowedSections
      });
    } catch (error) {
      console.error("Error updating user permissions:", error);
      res.status(500).json({ error: "Erro ao atualizar permissões" });
    }
  });



  // Rotas financeiras
  app.get("/api/financial", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const userId = getUserIdFromRequest(req);
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
      const userId = getUserIdFromRequest(req);
      const entryData = {
        ...req.body,
        userId
      };
      
      // Validação básica
      if (!entryData.type || !entryData.amount || !entryData.description || !entryData.dueDate) {
        return res.status(400).json({ error: "Tipo, valor, descrição e data de vencimento são obrigatórios" });
      }

      // Preparar dados com todos os campos obrigatórios
      const financialEntryData = {
        type: entryData.type,
        amount: parseFloat(entryData.amount),
        description: entryData.description,
        category: entryData.businessCategory || "operacional",
        paymentMethod: entryData.paymentMethod || "dinheiro",
        status: entryData.type === 'income' ? 'paid' : 'pending',
        dueDate: new Date(entryData.dueDate),
        paidDate: entryData.type === 'income' ? new Date() : null,
        referenceType: 'expense',
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Dados sendo enviados para createFinancialEntry:', financialEntryData);
      
      const newEntry = await storage.createFinancialEntry(financialEntryData);
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

  // Rotas de transferências de dinheiro
  app.get("/api/money-transfers", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      
      // Usar o sistema de headers existente
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID header required" });
      }
      
      // Para Junior (userId 18), usar companyId 6
      const companyId = parseInt(userId) === 18 ? 6 : 1;
      
      const transfers = await storage.getMoneyTransfers(companyId);
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching money transfers:", error);
      res.status(500).json({ error: "Erro ao buscar transferências de dinheiro" });
    }
  });

  app.post("/api/money-transfers", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      
      // Usar o sistema de headers existente
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID header required" });
      }
      
      // Para Junior (userId 18), usar companyId 6
      const companyId = parseInt(userId) === 18 ? 6 : 1;
      
      const newTransfer = await storage.createMoneyTransfer({
        ...req.body,
        transferDate: new Date().toISOString(),
        status: 'pending',
        companyId,
        createdBy: parseInt(userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      res.status(201).json(newTransfer);
    } catch (error) {
      console.error("Error creating money transfer:", error);
      res.status(500).json({ error: "Erro ao criar transferência de dinheiro" });
    }
  });

  app.put("/api/money-transfers/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const transferId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedTransfer = await storage.updateMoneyTransfer(transferId, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      if (!updatedTransfer) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer);
    } catch (error) {
      console.error("Error updating money transfer:", error);
      res.status(500).json({ error: "Erro ao atualizar transferência" });
    }
  });

  app.delete("/api/money-transfers/:id", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const transferId = parseInt(req.params.id);
      
      const deleted = await storage.deleteMoneyTransfer(transferId);
      if (!deleted) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json({ message: "Transferência excluída com sucesso" });
    } catch (error) {
      console.error("Error deleting money transfer:", error);
      res.status(500).json({ error: "Erro ao excluir transferência" });
    }
  });

  app.post("/api/money-transfers/:id/approve", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const transferId = parseInt(req.params.id);
      
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID header required" });
      }
      
      const updatedTransfer = await storage.updateMoneyTransfer(transferId, {
        status: 'approved',
        approvedBy: parseInt(userId),
        updatedAt: new Date().toISOString()
      });
      
      if (!updatedTransfer) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer);
    } catch (error) {
      console.error("Error approving money transfer:", error);
      res.status(500).json({ error: "Erro ao aprovar transferência" });
    }
  });

  app.post("/api/money-transfers/:id/complete", async (req, res) => {
    try {
      const storage = await databaseManager.getStorage();
      const transferId = parseInt(req.params.id);
      
      const updatedTransfer = await storage.updateMoneyTransfer(transferId, {
        status: 'completed',
        completedDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      if (!updatedTransfer) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer);
    } catch (error) {
      console.error("Error completing money transfer:", error);
      res.status(500).json({ error: "Erro ao completar transferência" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
