import { 
  users, 
  appointments,
  reminders,
  integrationSettings,
  notificationSettings,
  type User, 
  type InsertUser,
  type Appointment,
  type InsertAppointment,
  type Reminder,
  type InsertReminder,
  type IntegrationSettings,
  type InsertIntegrationSettings,
  type NotificationSettings,
  type InsertNotificationSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment operations
  getAppointments(userId: number): Promise<Appointment[]>;
  getAppointmentsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  
  // Reminder operations
  getReminders(appointmentId: number): Promise<Reminder[]>;
  getPendingReminders(): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  markReminderSent(id: number): Promise<void>;
  
  // Integration settings
  getIntegrationSettings(userId: number): Promise<IntegrationSettings[]>;
  getIntegrationSettingsByPlatform(userId: number, platform: string): Promise<IntegrationSettings | undefined>;
  createIntegrationSettings(settings: InsertIntegrationSettings): Promise<IntegrationSettings>;
  updateIntegrationSettings(id: number, settings: Partial<InsertIntegrationSettings>): Promise<IntegrationSettings>;
  
  // Notification settings
  getNotificationSettings(userId: number): Promise<NotificationSettings | undefined>;
  createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings>;
  updateNotificationSettings(id: number, settings: Partial<InsertNotificationSettings>): Promise<NotificationSettings>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Appointment operations
  async getAppointments(userId: number): Promise<Appointment[]> {
    const result = await db.select().from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.startTime));
    return result;
  }

  async getAppointmentsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Appointment[]> {
    const result = await db.select().from(appointments)
      .where(
        and(
          eq(appointments.userId, userId),
          gte(appointments.startTime, startDate),
          lte(appointments.startTime, endDate)
        )
      )
      .orderBy(appointments.startTime);
    return result;
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id));
    return result[0];
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values(appointment).returning();
    return result[0];
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const result = await db.update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return result[0];
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  // Reminder operations
  async getReminders(appointmentId: number): Promise<Reminder[]> {
    const result = await db.select().from(reminders)
      .where(eq(reminders.appointmentId, appointmentId))
      .orderBy(reminders.reminderTime);
    return result;
  }

  async getPendingReminders(): Promise<Reminder[]> {
    const now = new Date();
    const result = await db.select().from(reminders)
      .where(
        and(
          eq(reminders.sent, false),
          lte(reminders.reminderTime, now)
        )
      )
      .orderBy(reminders.reminderTime);
    return result;
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const result = await db.insert(reminders).values(reminder).returning();
    return result[0];
  }

  async markReminderSent(id: number): Promise<void> {
    await db.update(reminders)
      .set({ sent: true, sentAt: new Date() })
      .where(eq(reminders.id, id));
  }

  // Integration settings
  async getIntegrationSettings(userId: number): Promise<IntegrationSettings[]> {
    const result = await db.select().from(integrationSettings)
      .where(eq(integrationSettings.userId, userId));
    return result;
  }

  async getIntegrationSettingsByPlatform(userId: number, platform: string): Promise<IntegrationSettings | undefined> {
    const result = await db.select().from(integrationSettings)
      .where(
        and(
          eq(integrationSettings.userId, userId),
          eq(integrationSettings.platform, platform)
        )
      );
    return result[0];
  }

  async createIntegrationSettings(settings: InsertIntegrationSettings): Promise<IntegrationSettings> {
    const result = await db.insert(integrationSettings).values(settings).returning();
    return result[0];
  }

  async updateIntegrationSettings(id: number, settings: Partial<InsertIntegrationSettings>): Promise<IntegrationSettings> {
    const result = await db.update(integrationSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(integrationSettings.id, id))
      .returning();
    return result[0];
  }

  // Notification settings
  async getNotificationSettings(userId: number): Promise<NotificationSettings | undefined> {
    const result = await db.select().from(notificationSettings)
      .where(eq(notificationSettings.userId, userId));
    return result[0];
  }

  async createNotificationSettings(settings: InsertNotificationSettings): Promise<NotificationSettings> {
    const result = await db.insert(notificationSettings).values(settings).returning();
    return result[0];
  }

  async updateNotificationSettings(id: number, settings: Partial<InsertNotificationSettings>): Promise<NotificationSettings> {
    const result = await db.update(notificationSettings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(notificationSettings.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
