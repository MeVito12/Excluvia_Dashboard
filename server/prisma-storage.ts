import { PrismaClient } from '@prisma/client';
import type { IStorage } from './storage';
import type {
  User, InsertUser,
  Product, InsertProduct,
  Sale, InsertSale,
  Client, InsertClient,
  Appointment, InsertAppointment,
  LoyaltyCampaign, InsertLoyaltyCampaign,
  WhatsAppChat, InsertWhatsAppChat,
  StockMovement, InsertStockMovement
} from '../shared/schema';

const prisma = new PrismaClient();

export class PrismaStorage implements IStorage {
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        businessCategory: user.businessCategory,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in getUserByEmail:", error);
      return null;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const created = await prisma.user.create({
        data: {
          email: user.email,
          password: user.password,
          name: user.name,
          businessCategory: user.businessCategory
        }
      });
      
      return {
        id: created.id,
        email: created.email,
        password: created.password,
        name: created.name,
        businessCategory: created.businessCategory,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in createUser:", error);
      throw error;
    }
  }

  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    try {
      const products = await prisma.product.findMany({
        where: {
          userId,
          businessCategory
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku,
        stock: p.stock,
        minStock: p.minStock,
        price: Number(p.price),
        isPerishable: p.isPerishable,
        manufacturingDate: p.manufacturingDate,
        expiryDate: p.expiryDate,
        businessCategory: p.businessCategory,
        userId: p.userId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }));
    } catch (error) {
      console.error("Prisma error in getProducts:", error);
      return [];
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const created = await prisma.product.create({
        data: {
          name: product.name,
          category: product.category,
          sku: product.sku,
          stock: product.stock,
          minStock: product.minStock,
          price: product.price,
          isPerishable: product.isPerishable,
          manufacturingDate: product.manufacturingDate,
          expiryDate: product.expiryDate,
          businessCategory: product.businessCategory,
          userId: product.userId
        }
      });
      
      return {
        id: created.id,
        name: created.name,
        category: created.category,
        sku: created.sku,
        stock: created.stock,
        minStock: created.minStock,
        price: Number(created.price),
        isPerishable: created.isPerishable,
        manufacturingDate: created.manufacturingDate,
        expiryDate: created.expiryDate,
        businessCategory: created.businessCategory,
        userId: created.userId,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | null> {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          ...(product.name && { name: product.name }),
          ...(product.category && { category: product.category }),
          ...(product.sku && { sku: product.sku }),
          ...(product.stock !== undefined && { stock: product.stock }),
          ...(product.minStock !== undefined && { minStock: product.minStock }),
          ...(product.price !== undefined && { price: product.price }),
          ...(product.isPerishable !== undefined && { isPerishable: product.isPerishable }),
          ...(product.manufacturingDate && { manufacturingDate: product.manufacturingDate }),
          ...(product.expiryDate && { expiryDate: product.expiryDate }),
        }
      });
      
      return {
        id: updated.id,
        name: updated.name,
        category: updated.category,
        sku: updated.sku,
        stock: updated.stock,
        minStock: updated.minStock,
        price: Number(updated.price),
        isPerishable: updated.isPerishable,
        manufacturingDate: updated.manufacturingDate,
        expiryDate: updated.expiryDate,
        businessCategory: updated.businessCategory,
        userId: updated.userId,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in updateProduct:", error);
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error("Prisma error in deleteProduct:", error);
      return false;
    }
  }

  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    try {
      const sales = await prisma.sale.findMany({
        where: {
          userId,
          businessCategory
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return sales.map(s => ({
        id: s.id,
        productName: s.productName,
        quantity: s.quantity,
        unitPrice: Number(s.unitPrice),
        totalAmount: Number(s.totalAmount),
        paymentMethod: s.paymentMethod,
        businessCategory: s.businessCategory,
        clientId: s.clientId,
        userId: s.userId,
        createdAt: s.createdAt
      }));
    } catch (error) {
      console.error("Prisma error in getSales:", error);
      return [];
    }
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    try {
      const created = await prisma.sale.create({
        data: {
          productName: sale.productName,
          quantity: sale.quantity,
          unitPrice: sale.unitPrice,
          totalAmount: sale.totalAmount,
          paymentMethod: sale.paymentMethod,
          businessCategory: sale.businessCategory,
          clientId: sale.clientId,
          userId: sale.userId
        }
      });
      
      return {
        id: created.id,
        productName: created.productName,
        quantity: created.quantity,
        unitPrice: Number(created.unitPrice),
        totalAmount: Number(created.totalAmount),
        paymentMethod: created.paymentMethod,
        businessCategory: created.businessCategory,
        clientId: created.clientId,
        userId: created.userId,
        createdAt: created.createdAt
      };
    } catch (error) {
      console.error("Prisma error in createSale:", error);
      throw error;
    }
  }

  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    try {
      const clients = await prisma.client.findMany({
        where: {
          userId,
          businessCategory
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return clients.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        businessCategory: c.businessCategory,
        totalSpent: Number(c.totalSpent),
        lastPurchase: c.lastPurchase,
        isActive: c.isActive,
        notes: c.notes,
        userId: c.userId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }));
    } catch (error) {
      console.error("Prisma error in getClients:", error);
      return [];
    }
  }

  async createClient(client: InsertClient): Promise<Client> {
    try {
      const created = await prisma.client.create({
        data: {
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          businessCategory: client.businessCategory,
          totalSpent: client.totalSpent,
          lastPurchase: client.lastPurchase,
          isActive: client.isActive,
          notes: client.notes,
          userId: client.userId
        }
      });
      
      return {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        address: created.address,
        businessCategory: created.businessCategory,
        totalSpent: Number(created.totalSpent),
        lastPurchase: created.lastPurchase,
        isActive: created.isActive,
        notes: created.notes,
        userId: created.userId,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in createClient:", error);
      throw error;
    }
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | null> {
    try {
      const updated = await prisma.client.update({
        where: { id },
        data: {
          ...(client.name && { name: client.name }),
          ...(client.email && { email: client.email }),
          ...(client.phone && { phone: client.phone }),
          ...(client.address && { address: client.address }),
          ...(client.totalSpent !== undefined && { totalSpent: client.totalSpent }),
          ...(client.lastPurchase && { lastPurchase: client.lastPurchase }),
          ...(client.isActive !== undefined && { isActive: client.isActive }),
          ...(client.notes && { notes: client.notes }),
        }
      });
      
      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        businessCategory: updated.businessCategory,
        totalSpent: Number(updated.totalSpent),
        lastPurchase: updated.lastPurchase,
        isActive: updated.isActive,
        notes: updated.notes,
        userId: updated.userId,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in updateClient:", error);
      return null;
    }
  }

  async deleteClient(id: number): Promise<boolean> {
    try {
      await prisma.client.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error("Prisma error in deleteClient:", error);
      return false;
    }
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    try {
      const appointments = await prisma.appointment.findMany({
        where: { userId },
        orderBy: { date: 'asc' }
      });
      
      return appointments.map(a => ({
        id: a.id,
        title: a.title,
        clientName: a.clientName,
        date: a.date,
        time: a.time,
        type: a.type,
        status: a.status,
        notes: a.notes,
        businessCategory: a.businessCategory,
        userId: a.userId,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt
      }));
    } catch (error) {
      console.error("Prisma error in getAppointments:", error);
      return [];
    }
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    try {
      const created = await prisma.appointment.create({
        data: {
          title: appointment.title,
          clientName: appointment.clientName,
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          notes: appointment.notes,
          businessCategory: appointment.businessCategory,
          userId: appointment.userId
        }
      });
      
      return {
        id: created.id,
        title: created.title,
        clientName: created.clientName,
        date: created.date,
        time: created.time,
        type: created.type,
        status: created.status,
        notes: created.notes,
        businessCategory: created.businessCategory,
        userId: created.userId,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in createAppointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | null> {
    try {
      const updated = await prisma.appointment.update({
        where: { id },
        data: {
          ...(appointment.title && { title: appointment.title }),
          ...(appointment.clientName && { clientName: appointment.clientName }),
          ...(appointment.date && { date: appointment.date }),
          ...(appointment.time && { time: appointment.time }),
          ...(appointment.type && { type: appointment.type }),
          ...(appointment.status && { status: appointment.status }),
          ...(appointment.notes && { notes: appointment.notes }),
        }
      });
      
      return {
        id: updated.id,
        title: updated.title,
        clientName: updated.clientName,
        date: updated.date,
        time: updated.time,
        type: updated.type,
        status: updated.status,
        notes: updated.notes,
        businessCategory: updated.businessCategory,
        userId: updated.userId,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in updateAppointment:", error);
      return null;
    }
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      await prisma.appointment.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error("Prisma error in deleteAppointment:", error);
      return false;
    }
  }

  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    try {
      const campaigns = await prisma.loyaltyCampaign.findMany({
        where: {
          userId,
          businessCategory
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return campaigns.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        discountType: c.discountType,
        discountValue: Number(c.discountValue),
        startDate: c.startDate,
        endDate: c.endDate,
        isActive: c.isActive,
        businessCategory: c.businessCategory,
        userId: c.userId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
      }));
    } catch (error) {
      console.error("Prisma error in getCampaigns:", error);
      return [];
    }
  }

  async createCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign> {
    try {
      const created = await prisma.loyaltyCampaign.create({
        data: {
          name: campaign.name,
          description: campaign.description,
          discountType: campaign.discountType,
          discountValue: campaign.discountValue,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          isActive: campaign.isActive,
          businessCategory: campaign.businessCategory,
          userId: campaign.userId
        }
      });
      
      return {
        id: created.id,
        name: created.name,
        description: created.description,
        discountType: created.discountType,
        discountValue: Number(created.discountValue),
        startDate: created.startDate,
        endDate: created.endDate,
        isActive: created.isActive,
        businessCategory: created.businessCategory,
        userId: created.userId,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt
      };
    } catch (error) {
      console.error("Prisma error in createCampaign:", error);
      throw error;
    }
  }

  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    try {
      const chats = await prisma.whatsAppChat.findMany({
        where: {
          userId,
          businessCategory
        },
        orderBy: { lastActivity: 'desc' }
      });
      
      return chats.map(c => ({
        id: c.id,
        contactName: c.contactName,
        lastMessage: c.lastMessage,
        lastActivity: c.lastActivity,
        unreadCount: c.unreadCount,
        businessCategory: c.businessCategory,
        userId: c.userId,
        createdAt: c.createdAt
      }));
    } catch (error) {
      console.error("Prisma error in getWhatsAppChats:", error);
      return [];
    }
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    try {
      const movements = await prisma.stockMovement.findMany({
        where: { productId },
        orderBy: { movementDate: 'desc' }
      });
      
      return movements.map(m => ({
        id: m.id,
        productId: m.productId,
        movementType: m.movementType,
        quantity: m.quantity,
        reason: m.reason,
        movementDate: m.movementDate,
        createdAt: m.createdAt
      }));
    } catch (error) {
      console.error("Prisma error in getStockMovements:", error);
      return [];
    }
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    try {
      const created = await prisma.stockMovement.create({
        data: {
          productId: movement.productId,
          movementType: movement.movementType,
          quantity: movement.quantity,
          reason: movement.reason,
          movementDate: movement.movementDate
        }
      });
      
      return {
        id: created.id,
        productId: created.productId,
        movementType: created.movementType,
        quantity: created.quantity,
        reason: created.reason,
        movementDate: created.movementDate,
        createdAt: created.createdAt
      };
    } catch (error) {
      console.error("Prisma error in createStockMovement:", error);
      throw error;
    }
  }
}

export const prismaStorage = new PrismaStorage();