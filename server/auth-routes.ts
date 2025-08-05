import { Express } from 'express';
import { SupabaseAuthStorage } from './auth-storage.js';
import { generateToken, requireAuth, extractUserFromRequest } from './auth.js';

export function setupAuthRoutes(app: Express) {
  const authStorage = new SupabaseAuthStorage();

  // Login com UUID
  app.post("/api/auth/uuid-login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      console.log('Tentativa de login UUID para:', email);

      const user = await authStorage.loginUser(email, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      console.log('Login UUID realizado com sucesso para:', email);

      const token = generateToken(user);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          company_id: user.company_id,
          branch_id: user.branch_id,
          role: user.role,
          business_category: user.business_category
        },
        token,
        success: true
      });
    } catch (error: any) {
      console.error('Erro no login UUID:', error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Rota protegida de exemplo
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = extractUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      // Buscar dados completos do usuário
      const fullUser = await authStorage.getUserById(user.id);
      if (!fullUser) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ user: fullUser });
    } catch (error: any) {
      console.error('Erro ao buscar dados do usuário:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Criar usuário
  app.post("/api/auth/register", async (req, res) => {
    try {
      const user = await authStorage.createUser(req.body);
      const token = generateToken(user);
      
      res.json({
        user,
        token,
        success: true
      });
    } catch (error: any) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Criar empresa
  app.post("/api/auth/companies", requireAuth, async (req, res) => {
    try {
      const user = extractUserFromRequest(req);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const company = await authStorage.createCompany({
        ...req.body,
        created_by: user.id
      });
      
      res.json(company);
    } catch (error: any) {
      console.error('Erro ao criar empresa:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Criar filial
  app.post("/api/auth/branches", requireAuth, async (req, res) => {
    try {
      const branch = await authStorage.createBranch(req.body);
      res.json(branch);
    } catch (error: any) {
      console.error('Erro ao criar filial:', error);
      res.status(500).json({ error: error.message });
    }
  });
}