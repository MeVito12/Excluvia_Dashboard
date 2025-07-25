import { Router } from 'express';
import { storage } from '../index';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // Para demonstração, aceita qualquer senha
    // Em produção, verificar hash da senha
    
    // Remove senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuário por email (para Supabase Auth)
router.post('/user-by-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Remove senha antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;