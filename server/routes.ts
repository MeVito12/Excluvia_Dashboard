import type { Express } from "express";
import { createServer, type Server } from "http";
import { databaseManager } from "./database-manager";
import { 
  insertAppointmentSchema
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
      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        userId,
        userId: 1, // TODO: Get from session/auth
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
      });
      
      const appointment = await storage.createAppointment(validatedData);
      
      // Create automatic reminder 1 hour before
      const reminderTime = new Date(appointment.startTime.getTime() - 60 * 60 * 1000);
      await storage.createReminder({
        appointmentId: appointment.id,
        reminderTime,
        reminderType: "email",
        sent: false,
      });
      
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ error: "Dados inválidos para criar agendamento", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = {
        ...req.body,
        ...(req.body.startTime && { startTime: new Date(req.body.startTime) }),
        ...(req.body.endTime && { endTime: new Date(req.body.endTime) }),
      };
      
      const appointment = await storage.updateAppointment(id, updateData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar agendamento" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      await storage.deleteAppointment(parseInt(req.params.id));
      res.json({ message: "Agendamento removido com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao remover agendamento" });
    }
  });

  // Reminders routes
  app.get("/api/appointments/:id/reminders", async (req, res) => {
    try {
      const reminders = await storage.getReminders(parseInt(req.params.id));
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar lembretes" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const validatedData = insertReminderSchema.parse({
        ...req.body,
        reminderTime: new Date(req.body.reminderTime),
      });
      
      const reminder = await storage.createReminder(validatedData);
      res.json(reminder);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos para criar lembrete" });
    }
  });

  app.get("/api/reminders/pending", async (req, res) => {
    try {
      const pendingReminders = await storage.getPendingReminders();
      res.json(pendingReminders);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar lembretes pendentes" });
    }
  });

  app.post("/api/reminders/:id/mark-sent", async (req, res) => {
    try {
      await storage.markReminderSent(parseInt(req.params.id));
      res.json({ message: "Lembrete marcado como enviado" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao marcar lembrete como enviado" });
    }
  });

  // Integration settings routes
  app.get("/api/integrations", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const integrations = await storage.getIntegrationSettings(userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar integrações" });
    }
  });

  app.post("/api/integrations", async (req, res) => {
    try {
      const validatedData = insertIntegrationSettingsSchema.parse({
        ...req.body,
        userId: 1, // TODO: Get from session/auth
      });
      
      const integration = await storage.createIntegrationSettings(validatedData);
      res.json(integration);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos para criar integração" });
    }
  });

  app.put("/api/integrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const integration = await storage.updateIntegrationSettings(id, req.body);
      res.json(integration);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar integração" });
    }
  });

  // Notification settings routes
  app.get("/api/notification-settings", async (req, res) => {
    try {
      const userId = 1; // TODO: Get from session/auth
      const settings = await storage.getNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar configurações de notificação" });
    }
  });

  app.post("/api/notification-settings", async (req, res) => {
    try {
      const validatedData = insertNotificationSettingsSchema.parse({
        ...req.body,
        userId: 1, // TODO: Get from session/auth
      });
      
      const settings = await storage.createNotificationSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Dados inválidos para criar configurações" });
    }
  });

  app.put("/api/notification-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const settings = await storage.updateNotificationSettings(id, req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Erro ao atualizar configurações" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
