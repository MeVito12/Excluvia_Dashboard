import { pgTable, text, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Tabela de empresas
export const companiesTable = pgTable('companies', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  fantasyName: text('fantasy_name').notNull(),
  corporateName: text('corporate_name').notNull(),
  cnpj: text('cnpj').unique(),
  businessCategory: text('business_category').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de filiais
export const branchesTable = pgTable('branches', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  companyId: integer('company_id').notNull().references(() => companiesTable.id),
  name: text('name').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  isMain: boolean('is_main').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de permissões de usuário
export const userPermissionsTable = pgTable('user_permissions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userId: integer('user_id').notNull(),
  permission: text('permission').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabela de usuários
export const usersTable = pgTable('users', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  companyId: integer('company_id').references(() => companiesTable.id),
  branchId: integer('branch_id').references(() => branchesTable.id),
  role: text('role').notNull(),
  businessCategory: text('business_category'),
  isActive: boolean('is_active').default(true),
  createdBy: integer('created_by').references(() => usersTable.id),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de produtos
export const productsTable = pgTable('products', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  stock: integer('stock').notNull().default(0),
  minStock: integer('min_stock').default(0),
  barcode: text('barcode'),
  manufacturingDate: timestamp('manufacturing_date'),
  expiryDate: timestamp('expiry_date'),
  isPerishable: boolean('is_perishable').default(false),
  companyId: integer('company_id').notNull().references(() => companiesTable.id),
  branchId: integer('branch_id').notNull().references(() => branchesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de clientes (deve vir antes de vendas)
export const clientsTable = pgTable('clients', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  document: text('document'),
  address: text('address'),
  clientType: text('client_type').default('individual'),
  companyId: integer('company_id').notNull().references(() => companiesTable.id),
  branchId: integer('branch_id').notNull().references(() => branchesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de vendas
export const salesTable = pgTable('sales', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  productId: integer('product_id').notNull().references(() => productsTable.id),
  clientId: integer('client_id').references(() => clientsTable.id),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(),
  saleDate: timestamp('sale_date').defaultNow().notNull(),
  notes: text('notes'),
  companyId: integer('company_id').notNull().references(() => companiesTable.id),
  branchId: integer('branch_id').notNull().references(() => branchesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});



// Tabela de agendamentos
export const appointmentsTable = pgTable('appointments', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  title: text('title').notNull(),
  description: text('description'),
  clientId: integer('client_id').references(() => clientsTable.id),
  clientName: text('client_name'),
  appointmentDate: timestamp('appointment_date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  status: text('status').notNull().default('scheduled'),
  type: text('type'),
  notes: text('notes'),
  companyId: integer('company_id').references(() => companiesTable.id),
  branchId: integer('branch_id').references(() => branchesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de campanhas de fidelidade
export const loyaltyCampaignsTable = pgTable('loyalty_campaigns', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  businessCategory: text('business_category').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }),
  validUntil: timestamp('valid_until'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabela de conversas WhatsApp
export const whatsappChatsTable = pgTable('whatsapp_chats', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  businessCategory: text('business_category').notNull(),
  clientName: text('client_name').notNull(),
  phone: text('phone').notNull(),
  lastMessage: text('last_message').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  isRead: boolean('is_read').default(false),
});

// Tabela de movimentos de estoque
export const stockMovementsTable = pgTable('stock_movements', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  productId: integer('product_id').notNull().references(() => productsTable.id),
  type: text('type').notNull(), // 'in' ou 'out'
  quantity: integer('quantity').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});



// Tabela de transferências
export const transfersTable = pgTable('transfers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  productId: integer('product_id').notNull().references(() => productsTable.id),
  fromBranchId: integer('from_branch_id').notNull().references(() => branchesTable.id),
  toBranchId: integer('to_branch_id').notNull().references(() => branchesTable.id),
  quantity: integer('quantity').notNull(),
  status: text('status').notNull().default('pending'),
  transferDate: timestamp('transfer_date').defaultNow(),
  receivedDate: timestamp('received_date'),
  notes: text('notes'),
  companyId: integer('company_id').references(() => companiesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de entradas financeiras
export const financialEntriesTable = pgTable('financial_entries', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  type: text('type').notNull(), // 'income' ou 'expense'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  category: text('category'),
  paymentMethod: text('payment_method'),
  status: text('status').notNull().default('pending'), // 'pending', 'paid', 'overdue'
  dueDate: timestamp('due_date').notNull(),
  paidDate: timestamp('paid_date'),
  referenceId: integer('reference_id'),
  referenceType: text('reference_type'),
  companyId: integer('company_id').references(() => companiesTable.id),
  branchId: integer('branch_id').references(() => branchesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabela de transferências de dinheiro
export const moneyTransfersTable = pgTable('money_transfers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  fromBranchId: integer('from_branch_id').notNull().references(() => branchesTable.id),
  toBranchId: integer('to_branch_id').notNull().references(() => branchesTable.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  transferType: text('transfer_type').notNull(), // 'operational', 'emergency', etc.
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'completed', 'cancelled'
  transferDate: timestamp('transfer_date'),
  completedDate: timestamp('completed_date'),
  approvedBy: integer('approved_by').references(() => usersTable.id),
  notes: text('notes'),
  companyId: integer('company_id').notNull().references(() => companiesTable.id),
  createdBy: integer('created_by').notNull().references(() => usersTable.id),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

// Schemas de validação
export const insertCompanySchema = createInsertSchema(companiesTable);
export const selectCompanySchema = createSelectSchema(companiesTable);
export const insertBranchSchema = createInsertSchema(branchesTable);
export const selectBranchSchema = createSelectSchema(branchesTable);
export const insertUserPermissionSchema = createInsertSchema(userPermissionsTable);
export const selectUserPermissionSchema = createSelectSchema(userPermissionsTable);
export const insertUserSchema = createInsertSchema(usersTable);
export const selectUserSchema = createSelectSchema(usersTable);
export const insertProductSchema = createInsertSchema(productsTable);
export const selectProductSchema = createSelectSchema(productsTable);
export const insertSaleSchema = createInsertSchema(salesTable);
export const selectSaleSchema = createSelectSchema(salesTable);
export const insertClientSchema = createInsertSchema(clientsTable);
export const selectClientSchema = createSelectSchema(clientsTable);
export const insertAppointmentSchema = createInsertSchema(appointmentsTable);
export const selectAppointmentSchema = createSelectSchema(appointmentsTable);
export const insertFinancialEntrySchema = createInsertSchema(financialEntriesTable);
export const selectFinancialEntrySchema = createSelectSchema(financialEntriesTable);
export const insertMoneyTransferSchema = createInsertSchema(moneyTransfersTable);
export const selectMoneyTransferSchema = createSelectSchema(moneyTransfersTable);

// Tipos TypeScript
export type Company = typeof companiesTable.$inferSelect;
export type NewCompany = typeof companiesTable.$inferInsert;
export type Branch = typeof branchesTable.$inferSelect;
export type NewBranch = typeof branchesTable.$inferInsert;
export type UserPermission = typeof userPermissionsTable.$inferSelect;
export type NewUserPermission = typeof userPermissionsTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;
export type Sale = typeof salesTable.$inferSelect;
export type NewSale = typeof salesTable.$inferInsert;
export type Client = typeof clientsTable.$inferSelect;
export type NewClient = typeof clientsTable.$inferInsert;
export type Appointment = typeof appointmentsTable.$inferSelect;
export type NewAppointment = typeof appointmentsTable.$inferInsert;
export type FinancialEntry = typeof financialEntriesTable.$inferSelect;
export type NewFinancialEntry = typeof financialEntriesTable.$inferInsert;
export type MoneyTransfer = typeof moneyTransfersTable.$inferSelect;
export type NewMoneyTransfer = typeof moneyTransfersTable.$inferInsert;