// Schema definitions for Supabase integration with Drizzle ORM
import { z } from "zod";
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  boolean, 
  decimal, 
  jsonb,
  varchar,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Drizzle Table Definitions
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  businessCategory: varchar("business_category", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: varchar("location", { length: 255 }),
  clientName: varchar("client_name", { length: 255 }),
  clientEmail: varchar("client_email", { length: 255 }),
  clientPhone: varchar("client_phone", { length: 20 }),
  status: varchar("status", { length: 20 }).default('scheduled'),
  userId: integer("user_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  stock: integer("stock").default(0),
  minStock: integer("min_stock").default(5),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isPerishable: boolean("is_perishable").default(false),
  manufacturingDate: date("manufacturing_date"),
  expiryDate: date("expiry_date"),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  productIds: jsonb("product_ids").notNull(),
  clientId: integer("client_id"),
  clientName: varchar("client_name", { length: 255 }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).default('cash'),
  status: varchar("status", { length: 20 }).default('completed'),
  notes: text("notes"),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  userId: integer("user_id").notNull(),
  saleDate: timestamp("sale_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default('0'),
  lastPurchase: timestamp("last_purchase"),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("loyalty_campaigns", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  discountPercentage: integer("discount_percentage"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  minPurchaseAmount: decimal("min_purchase_amount", { precision: 10, scale: 2 }),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true),
  targetAudience: varchar("target_audience", { length: 20 }).default('all'),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  messageTemplate: text("message_template").notNull(),
  sentCount: integer("sent_count").default(0),
  usageCount: integer("usage_count").default(0),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").notNull(),
  reminderType: varchar("reminder_type", { length: 20 }).notNull(),
  reminderTime: timestamp("reminder_time").notNull(),
  sent: boolean("sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const whatsappChats = pgTable("whatsapp_chats", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  clientName: varchar("client_name", { length: 255 }),
  lastMessage: text("last_message"),
  messageCount: integer("message_count").default(0),
  isActive: boolean("is_active").default(true),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  userId: integer("user_id").notNull(),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stockMovements = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  quantity: integer("quantity").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  reference: varchar("reference", { length: 100 }),
  userId: integer("user_id"),
  movementDate: timestamp("movement_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrationSettings = pgTable("integration_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(false),
  settings: jsonb("settings").default('{}'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  emailEnabled: boolean("email_enabled").default(false),
  telegramEnabled: boolean("telegram_enabled").default(false),
  whatsappEnabled: boolean("whatsapp_enabled").default(false),
  emailAddress: varchar("email_address", { length: 255 }),
  telegramChatId: varchar("telegram_chat_id", { length: 100 }),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  defaultReminderTime: integer("default_reminder_time").default(60),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const botConfigs = pgTable("bot_configs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  welcomeMessage: text("welcome_message"),
  menuOptions: jsonb("menu_options").default('[]'),
  autoResponses: jsonb("auto_responses").default('{}'),
  workingHours: jsonb("working_hours").default('{}'),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supportAgents = pgTable("support_agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  status: varchar("status", { length: 20 }).default('offline'),
  businessCategory: varchar("business_category", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  specialties: jsonb("specialties").default('[]'),
  userId: integer("user_id").notNull(),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated TypeScript types from Drizzle tables
export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Appointment = typeof appointments.$inferSelect;
export const insertAppointmentSchema = createInsertSchema(appointments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Product = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Sale = typeof sales.$inferSelect;
export const insertSaleSchema = createInsertSchema(sales).omit({ id: true, createdAt: true });
export type InsertSale = z.infer<typeof insertSaleSchema>;

export type Client = typeof clients.$inferSelect;
export const insertClientSchema = createInsertSchema(clients).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertClient = z.infer<typeof insertClientSchema>;

export type LoyaltyCampaign = typeof campaigns.$inferSelect;
export const insertLoyaltyCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLoyaltyCampaign = z.infer<typeof insertLoyaltyCampaignSchema>;

export type Reminder = typeof reminders.$inferSelect;
export const insertReminderSchema = createInsertSchema(reminders).omit({ id: true, createdAt: true });
export type InsertReminder = z.infer<typeof insertReminderSchema>;

export type WhatsAppChat = typeof whatsappChats.$inferSelect;
export const insertWhatsAppChatSchema = createInsertSchema(whatsappChats).omit({ id: true, createdAt: true });
export type InsertWhatsAppChat = z.infer<typeof insertWhatsAppChatSchema>;

export type StockMovement = typeof stockMovements.$inferSelect;
export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({ id: true, createdAt: true });
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;

export type IntegrationSettings = typeof integrationSettings.$inferSelect;
export const insertIntegrationSettingsSchema = createInsertSchema(integrationSettings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertIntegrationSettings = z.infer<typeof insertIntegrationSettingsSchema>;

export type NotificationSettings = typeof notificationSettings.$inferSelect;
export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;

export type BotConfig = typeof botConfigs.$inferSelect;
export const insertBotConfigSchema = createInsertSchema(botConfigs).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;

export type SupportAgent = typeof supportAgents.$inferSelect;
export const insertSupportAgentSchema = createInsertSchema(supportAgents).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSupportAgent = z.infer<typeof insertSupportAgentSchema>;