import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  clientName: text("client_name"),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  status: text("status").notNull().default("scheduled"), // scheduled, completed, cancelled
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  reminderTime: timestamp("reminder_time").notNull(),
  type: text("type").notNull(), // email, telegram
  message: text("message"),
  sent: boolean("sent").default(false),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrationSettings = pgTable("integration_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  platform: text("platform").notNull(), // google_calendar, doctoralia, outlook
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  calendarId: text("calendar_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  emailEnabled: boolean("email_enabled").default(true),
  telegramEnabled: boolean("telegram_enabled").default(false),
  telegramChatId: text("telegram_chat_id"),
  emailAddress: text("email_address"),
  reminderMinutesBefore: integer("reminder_minutes_before").default(60), // 1 hour before
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
  integrationSettings: many(integrationSettings),
  notificationSettings: many(notificationSettings),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  reminders: many(reminders),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  appointment: one(appointments, {
    fields: [reminders.appointmentId],
    references: [appointments.id],
  }),
}));

export const integrationSettingsRelations = relations(integrationSettings, ({ one }) => ({
  user: one(users, {
    fields: [integrationSettings.userId],
    references: [users.id],
  }),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).pick({
  title: true,
  description: true,
  startTime: true,
  endTime: true,
  location: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  status: true,
  userId: true,
});

export const insertReminderSchema = createInsertSchema(reminders).pick({
  appointmentId: true,
  reminderTime: true,
  type: true,
  message: true,
});

export const insertIntegrationSettingsSchema = createInsertSchema(integrationSettings).pick({
  userId: true,
  platform: true,
  accessToken: true,
  refreshToken: true,
  calendarId: true,
  isActive: true,
});

export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).pick({
  userId: true,
  emailEnabled: true,
  telegramEnabled: true,
  telegramChatId: true,
  emailAddress: true,
  reminderMinutesBefore: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;

export type InsertIntegrationSettings = z.infer<typeof insertIntegrationSettingsSchema>;
export type IntegrationSettings = typeof integrationSettings.$inferSelect;

export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
