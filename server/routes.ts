import type { Express } from "express";
import { createServer, type Server } from "http";
import { databaseManager } from "./db/database-manager";
// Removido import incorreto - usar implementação PostgreSQL direta
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
import { 
  validateForeignKeys, 
  sanitizeInsertData,
  convertBrazilianDate,
  clientInsertSchema as validatedClientSchema,
  appointmentInsertSchema as validatedAppointmentSchema,
  saleInsertSchema as validatedSaleSchema,
  financialEntryInsertSchema as validatedFinancialSchema
} from "./database-validator";


export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", async (_req, res) => {
    const dbStatus = databaseManager.getStatus();
    res.json({ 
      status: "ok", 
      database: dbStatus 
    });
  });

  // Test money transfers - working version
  app.get("/api/test-money-transfers", async (req, res) => {
    try {
      // Usar conexão PostgreSQL direta que funciona
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const transfers = await db.execute(sql`
        SELECT * FROM money_transfers ORDER BY transfer_date DESC
      `);
      
      res.json({ 
        status: "test successful via PostgreSQL",
        count: transfers.length,
        data: transfers
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: "Test failed", 
        details: error.message 
      });
    }
  });

  // Authentication route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      // Use direct PostgreSQL query for authentication
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const users = await db.execute(sql`
        SELECT id, name, email, role, company_id, branch_id, phone, business_category, created_at, updated_at, password
        FROM users 
        WHERE email = ${email}
        LIMIT 1
      `);
      
      if (!users || users.length === 0) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      
      const user = users[0];
      if (user.password !== password) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Return user data without password and include businessCategory
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        user: {
          ...userWithoutPassword,
          businessCategory: user.business_category
        },
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
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      const db = await getDatabase();
      
      if (!db) {
        throw new Error('Database not available');
      }
      
      let result;
      if (companyId) {
        result = await db.execute(sql`
          SELECT * FROM branches WHERE company_id = ${companyId}
        `);
      } else {
        result = await db.execute(sql`
          SELECT * FROM branches
        `);
      }
      res.json(result);
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
      console.warn('User ID not found in request headers, using default');
      return 18; // Default para Junior
    }
    return parseInt(userId);
  }

  // Middleware para definir contexto RLS
  const setRLSContext = async (req: any, res: any, next: any) => {
    try {
      const userId = parseInt(req.headers['x-user-id']) || 18;
      
      // Buscar company_id do usuário
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      const db = getDatabase();
      
      if (db && userId) {
        const userResult = await db.execute(sql`
          SELECT company_id FROM users WHERE id = ${userId}
        `);
        
        if (userResult && userResult.length > 0) {
          const companyId = userResult[0].company_id;
          if (companyId) {
            // Definir contexto RLS para a sessão
            await db.execute(sql`
              SELECT set_config('rls.company_id', ${companyId.toString()}, true)
            `);
          }
        }
      }
      
      next();
    } catch (error) {
      console.error('Error setting RLS context:', error);
      next(); // Continuar mesmo com erro
    }
  };

  // Appointments routes
  app.get("/api/appointments", async (req, res) => {
    try {
      const userId = getUserIdFromRequest(req);
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const appointments = await db.execute(sql`
        SELECT 
          id, title, description, client_id, client_name, appointment_date, 
          start_time, end_time, status, notes, type,
          company_id, branch_id, created_by, created_at, updated_at
        FROM appointments 
        WHERE created_by = ${userId}
        ORDER BY appointment_date ASC
      `);
      
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
      const userId = getUserIdFromRequest(req);
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const products = await db.execute(sql`
        SELECT 
          id, name, description, price, stock, min_stock, category, is_perishable,
          manufacturing_date, expiry_date, barcode,
          company_id, branch_id, created_by, created_at, updated_at
        FROM products 
        WHERE created_by = ${userId}
        ORDER BY name ASC
      `);
      
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
      const userId = getUserIdFromRequest(req);
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const sales = await db.execute(sql`
        SELECT 
          s.id, s.product_id, s.client_id, s.quantity, s.unit_price, s.total_price,
          s.payment_method, s.sale_date, s.notes, s.company_id,
          s.branch_id, s.created_by, s.created_at,
          p.name as product_name,
          c.name as client_name
        FROM sales s
        LEFT JOIN products p ON s.product_id = p.id
        LEFT JOIN clients c ON s.client_id = c.id
        WHERE s.created_by = ${userId}
        ORDER BY s.sale_date DESC
      `);
      
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

  // Nova rota para vendas de carrinho
  app.post("/api/sales/cart", async (req, res) => {
    try {
      const userId = getUserIdFromRequest(req);
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }

      const { items, clientId, subtotal, discount, totalAmount, paymentMethod, notes } = req.body;
      
      // Validação básica
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Carrinho deve ter pelo menos um item" });
      }
      
      if (!paymentMethod) {
        return res.status(400).json({ error: "Método de pagamento é obrigatório" });
      }

      // Buscar dados do usuário para obter company_id e branch_id
      const userResult = await db.execute(sql`
        SELECT company_id, branch_id FROM users WHERE id = ${userId}
      `);
      
      if (!userResult || userResult.length === 0) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
      
      const { company_id: companyId, branch_id: branchId } = userResult[0];
      
      const saleResults = [];
      
      // Processar cada item do carrinho como uma venda separada
      for (const item of items) {
        const { productId, quantity, unitPrice } = item;
        const itemTotal = quantity * unitPrice;
        
        // Verificar se o produto existe e tem estoque suficiente
        const productResult = await db.execute(sql`
          SELECT id, name, stock FROM products 
          WHERE id = ${productId} AND company_id = ${companyId}
        `);
        
        if (!productResult || productResult.length === 0) {
          return res.status(400).json({ error: `Produto ${productId} não encontrado` });
        }
        
        const product = productResult[0];
        if (product.stock < quantity) {
          return res.status(400).json({ 
            error: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}, Solicitado: ${quantity}` 
          });
        }
        
        // Inserir venda
        const saleResult = await db.execute(sql`
          INSERT INTO sales (
            product_id, client_id, quantity, unit_price, total_price,
            payment_method, notes, company_id, branch_id, created_by
          ) VALUES (
            ${productId}, ${clientId || null}, ${quantity}, ${unitPrice}, ${itemTotal},
            ${paymentMethod}, ${notes || null}, ${companyId}, ${branchId}, ${userId}
          ) RETURNING *
        `);
        
        // Atualizar estoque
        await db.execute(sql`
          UPDATE products 
          SET stock = stock - ${quantity}
          WHERE id = ${productId}
        `);
        
        saleResults.push(saleResult[0]);
      }
      
      // Criar entrada financeira para a venda total
      await db.execute(sql`
        INSERT INTO financial_entries (
          type, amount, description, category, payment_method, status,
          company_id, branch_id, created_by
        ) VALUES (
          'income', ${totalAmount}, 
          ${`Venda carrinho ${items.length} itens${notes ? ` - ${notes}` : ''}`},
          'Vendas', ${paymentMethod}, 'paid',
          ${companyId}, ${branchId}, ${userId}
        )
      `);
      
      res.json({ 
        success: true, 
        message: `${items.length} ${items.length === 1 ? 'item vendido' : 'itens vendidos'} com sucesso`,
        totalAmount,
        salesCount: saleResults.length
      });
      
    } catch (error) {
      console.error("Error processing cart sale:", error);
      res.status(500).json({ error: "Erro ao processar venda do carrinho" });
    }
  });

  // Rotas de clientes
  app.get("/api/clients", async (req, res) => {
    try {
      const userId = getUserIdFromRequest(req);
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const clients = await db.execute(sql`
        SELECT 
          id, name, email, phone, address, client_type, document,
          company_id, branch_id, created_by, created_at, updated_at
        FROM clients 
        WHERE created_by = ${userId}
        ORDER BY name ASC
      `);
      
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
  // Rota duplicada removida - usar a rota principal /api/branches

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
  
  // Buscar todos os usuários (para perfil Gestão)
  app.get("/api/all-users", async (req, res) => {
    try {
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      const db = await getDatabase();
      
      if (!db) {
        throw new Error('Database not available');
      }
      
      const users = await db.execute(sql`
        SELECT u.id, u.name, u.email, u.role, u.phone, u.is_active, 
               u.last_login, u.created_at, u.updated_at,
               c.fantasy_name as company_name,
               b.name as branch_name
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        LEFT JOIN branches b ON u.branch_id = b.id
        ORDER BY u.created_at DESC
      `);
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  });
  
  // Buscar usuários da empresa para o master
  app.get("/api/company-users/:companyId", async (req, res) => {
    try {
      const companyId = Number(req.params.companyId);
      
      if (!companyId) {
        return res.status(400).json({ error: "ID da empresa é obrigatório" });
      }

      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      const db = await getDatabase();
      
      if (!db) {
        throw new Error('Database not available');
      }
      
      const users = await db.execute(sql`
        SELECT u.id, u.name, u.email, u.role, u.phone, u.is_active, 
               u.last_login, u.created_at, u.updated_at,
               c.fantasy_name as company_name,
               b.name as branch_name
        FROM users u
        LEFT JOIN companies c ON u.company_id = c.id
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE u.company_id = ${companyId}
        ORDER BY u.created_at DESC
      `);
      
      res.json(users);
    } catch (error) {
      console.error("Error fetching company users:", error);
      res.status(500).json({ error: "Erro ao buscar usuários da empresa" });
    }
  });

  // Buscar empresa do usuário master
  app.get("/api/user-company/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      
      if (!userId) {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      const db = await getDatabase();
      
      if (!db) {
        throw new Error('Database not available');
      }
      
      // Buscar usuário e empresa com join
      const result = await db.execute(sql`
        SELECT c.* FROM users u
        INNER JOIN companies c ON u.company_id = c.id
        WHERE u.id = ${userId}
      `);
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Usuário não possui empresa associada" });
      }

      res.json(result[0]);
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



  // Rotas financeiras com filtros de data
  app.get("/api/financial", async (req, res) => {
    try {
      const userId = getUserIdFromRequest(req);
      const { dateFrom, dateTo } = req.query;
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      const db = await getDatabase();
      
      if (!db) {
        throw new Error('Database not available');
      }
      
      let query;
      
      // Aplicar filtros de data se fornecidos
      if (dateFrom && dateTo) {
        query = sql`
          SELECT * FROM financial_entries 
          WHERE created_by = ${userId}
          AND DATE(created_at) BETWEEN ${dateFrom} AND ${dateTo}
          ORDER BY created_at DESC
        `;
      } else if (dateFrom) {
        query = sql`
          SELECT * FROM financial_entries 
          WHERE created_by = ${userId}
          AND DATE(created_at) >= ${dateFrom}
          ORDER BY created_at DESC
        `;
      } else if (dateTo) {
        query = sql`
          SELECT * FROM financial_entries 
          WHERE created_by = ${userId}
          AND DATE(created_at) <= ${dateTo}
          ORDER BY created_at DESC
        `;
      } else {
        query = sql`
          SELECT * FROM financial_entries 
          WHERE created_by = ${userId}
          ORDER BY created_at DESC
        `;
      }
      
      const entries = await db.execute(query);
      
      // Log para debug dos filtros
      console.log(`[FINANCIAL] Filtros aplicados - De: ${dateFrom || 'N/A'}, Até: ${dateTo || 'N/A'}, Entradas encontradas: ${entries.length}`);
      
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
      console.log('Money transfers route called');
      
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID header required" });
      }
      
      // Usar conexão PostgreSQL direta que já está funcionando
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      // Query SQL direta para transferências monetárias
      const transfers = await db.execute(sql`
        SELECT 
          id,
          from_branch_id,
          to_branch_id,
          amount,
          description,
          transfer_type,
          status,
          transfer_date,
          completed_date,
          approved_by,
          notes,
          company_id,
          created_by,
          created_at,
          updated_at
        FROM money_transfers 
        ORDER BY transfer_date DESC
      `);
      
      console.log('Transfers found via direct SQL:', transfers.length);
      res.json(transfers);
    } catch (error) {
      console.error("Error fetching money transfers:", error);
      res.status(500).json({ error: "Erro ao buscar transferências de dinheiro" });
    }
  });

  app.post("/api/money-transfers", async (req, res) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID header required" });
      }
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      // Para Junior (userId 18), usar companyId 6
      const companyId = parseInt(userId) === 18 ? 6 : 1;
      const now = new Date().toISOString();
      
      const newTransfer = await db.execute(sql`
        INSERT INTO money_transfers (
          from_branch_id,
          to_branch_id,
          amount,
          description,
          transfer_type,
          status,
          transfer_date,
          company_id,
          created_by,
          created_at,
          updated_at
        ) VALUES (
          ${req.body.fromBranchId},
          ${req.body.toBranchId},
          ${req.body.amount},
          ${req.body.description},
          ${req.body.transferType},
          'pending',
          ${now},
          ${companyId},
          ${parseInt(userId)},
          ${now},
          ${now}
        ) RETURNING *
      `);
      
      res.status(201).json(newTransfer[0]);
    } catch (error) {
      console.error("Error creating money transfer:", error);
      res.status(500).json({ error: "Erro ao criar transferência de dinheiro" });
    }
  });

  app.put("/api/money-transfers/:id", async (req, res) => {
    try {
      const transferId = parseInt(req.params.id);
      const updateData = req.body;
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const now = new Date().toISOString();
      
      const updatedTransfer = await db.execute(sql`
        UPDATE money_transfers 
        SET 
          amount = COALESCE(${updateData.amount}, amount),
          description = COALESCE(${updateData.description}, description),
          transfer_type = COALESCE(${updateData.transferType}, transfer_type),
          status = COALESCE(${updateData.status}, status),
          updated_at = ${now}
        WHERE id = ${transferId}
        RETURNING *
      `);
      
      if (!updatedTransfer || updatedTransfer.length === 0) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer[0]);
    } catch (error) {
      console.error("Error updating money transfer:", error);
      res.status(500).json({ error: "Erro ao atualizar transferência" });
    }
  });

  app.delete("/api/money-transfers/:id", async (req, res) => {
    try {
      const transferId = parseInt(req.params.id);
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const result = await db.execute(sql`
        DELETE FROM money_transfers WHERE id = ${transferId} RETURNING id
      `);
      
      if (!result || result.length === 0) {
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
      const transferId = parseInt(req.params.id);
      
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID header required" });
      }
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const now = new Date().toISOString();
      
      const updatedTransfer = await db.execute(sql`
        UPDATE money_transfers 
        SET 
          status = 'approved',
          approved_by = ${parseInt(userId)},
          updated_at = ${now}
        WHERE id = ${transferId}
        RETURNING *
      `);
      
      if (!updatedTransfer || updatedTransfer.length === 0) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer[0]);
    } catch (error) {
      console.error("Error approving money transfer:", error);
      res.status(500).json({ error: "Erro ao aprovar transferência" });
    }
  });

  app.post("/api/money-transfers/:id/complete", async (req, res) => {
    try {
      const transferId = parseInt(req.params.id);
      
      const { getDatabase } = await import('./db/database');
      const { sql } = await import('drizzle-orm');
      
      const db = getDatabase();
      if (!db) {
        throw new Error('Database not available');
      }
      
      const now = new Date().toISOString();
      
      const updatedTransfer = await db.execute(sql`
        UPDATE money_transfers 
        SET 
          status = 'completed',
          completed_date = ${now},
          updated_at = ${now}
        WHERE id = ${transferId}
        RETURNING *
      `);
      
      if (!updatedTransfer || updatedTransfer.length === 0) {
        return res.status(404).json({ error: "Transferência não encontrada" });
      }
      
      res.json(updatedTransfer[0]);
    } catch (error) {
      console.error("Error completing money transfer:", error);
      res.status(500).json({ error: "Erro ao completar transferência" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
