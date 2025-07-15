// Supabase Storage via REST API (contorna limitações DNS do Replit)
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

const SUPABASE_URL = 'https://mjydrjmckcoixrnnrehm.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

class SupabaseRestStorage implements IStorage {
  private async apiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'apikey': SUPABASE_SERVICE_KEY!,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.apiRequest(`users?email=eq.${encodeURIComponent(email)}&select=*`);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error("Supabase REST error in getUserByEmail:", error);
      return null;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await this.apiRequest('users', {
        method: 'POST',
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          name: user.name,
          business_category: user.businessCategory
        })
      });
      return result[0];
    } catch (error) {
      console.error("Supabase REST error in createUser:", error);
      throw error;
    }
  }

  async getProducts(userId: number, businessCategory: string): Promise<Product[]> {
    try {
      const products = await this.apiRequest(
        `products?user_id=eq.${userId}&business_category=eq.${encodeURIComponent(businessCategory)}&select=*&order=created_at.desc`
      );
      return products.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku,
        stock: p.stock,
        minStock: p.min_stock,
        price: parseFloat(p.price),
        isPerishable: p.is_perishable,
        manufacturingDate: p.manufacturing_date ? new Date(p.manufacturing_date) : null,
        expiryDate: p.expiry_date ? new Date(p.expiry_date) : null,
        businessCategory: p.business_category,
        userId: p.user_id,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getProducts:", error);
      return [];
    }
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    try {
      const result = await this.apiRequest('products', {
        method: 'POST',
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          sku: product.sku,
          stock: product.stock,
          min_stock: product.minStock,
          price: product.price,
          is_perishable: product.isPerishable,
          manufacturing_date: product.manufacturingDate,
          expiry_date: product.expiryDate,
          business_category: product.businessCategory,
          user_id: product.userId
        })
      });
      
      const p = result[0];
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku,
        stock: p.stock,
        minStock: p.min_stock,
        price: parseFloat(p.price),
        isPerishable: p.is_perishable,
        manufacturingDate: p.manufacturing_date ? new Date(p.manufacturing_date) : null,
        expiryDate: p.expiry_date ? new Date(p.expiry_date) : null,
        businessCategory: p.business_category,
        userId: p.user_id,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | null> {
    try {
      const updateData: any = {};
      if (product.name !== undefined) updateData.name = product.name;
      if (product.category !== undefined) updateData.category = product.category;
      if (product.sku !== undefined) updateData.sku = product.sku;
      if (product.stock !== undefined) updateData.stock = product.stock;
      if (product.minStock !== undefined) updateData.min_stock = product.minStock;
      if (product.price !== undefined) updateData.price = product.price;
      if (product.isPerishable !== undefined) updateData.is_perishable = product.isPerishable;
      if (product.manufacturingDate !== undefined) updateData.manufacturing_date = product.manufacturingDate;
      if (product.expiryDate !== undefined) updateData.expiry_date = product.expiryDate;

      const result = await this.apiRequest(`products?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      if (result.length === 0) return null;
      
      const p = result[0];
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        sku: p.sku,
        stock: p.stock,
        minStock: p.min_stock,
        price: parseFloat(p.price),
        isPerishable: p.is_perishable,
        manufacturingDate: p.manufacturing_date ? new Date(p.manufacturing_date) : null,
        expiryDate: p.expiry_date ? new Date(p.expiry_date) : null,
        businessCategory: p.business_category,
        userId: p.user_id,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in updateProduct:", error);
      return null;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      await this.apiRequest(`products?id=eq.${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error("Supabase REST error in deleteProduct:", error);
      return false;
    }
  }

  async getSales(userId: number, businessCategory: string): Promise<Sale[]> {
    try {
      const sales = await this.apiRequest(
        `sales?user_id=eq.${userId}&business_category=eq.${encodeURIComponent(businessCategory)}&select=*&order=created_at.desc`
      );
      return sales.map((s: any) => ({
        id: s.id,
        productName: s.product_name,
        quantity: s.quantity,
        unitPrice: parseFloat(s.unit_price),
        totalAmount: parseFloat(s.total_amount),
        paymentMethod: s.payment_method,
        businessCategory: s.business_category,
        clientId: s.client_id,
        userId: s.user_id,
        createdAt: new Date(s.created_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getSales:", error);
      return [];
    }
  }

  async createSale(sale: InsertSale): Promise<Sale> {
    try {
      const result = await this.apiRequest('sales', {
        method: 'POST',
        body: JSON.stringify({
          product_name: sale.productName,
          quantity: sale.quantity,
          unit_price: sale.unitPrice,
          total_amount: sale.totalAmount,
          payment_method: sale.paymentMethod,
          business_category: sale.businessCategory,
          client_id: sale.clientId,
          user_id: sale.userId
        })
      });
      
      const s = result[0];
      return {
        id: s.id,
        productName: s.product_name,
        quantity: s.quantity,
        unitPrice: parseFloat(s.unit_price),
        totalAmount: parseFloat(s.total_amount),
        paymentMethod: s.payment_method,
        businessCategory: s.business_category,
        clientId: s.client_id,
        userId: s.user_id,
        createdAt: new Date(s.created_at)
      };
    } catch (error) {
      console.error("Supabase REST error in createSale:", error);
      throw error;
    }
  }

  async getClients(userId: number, businessCategory: string): Promise<Client[]> {
    try {
      const clients = await this.apiRequest(
        `clients?user_id=eq.${userId}&business_category=eq.${encodeURIComponent(businessCategory)}&select=*&order=created_at.desc`
      );
      return clients.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        businessCategory: c.business_category,
        totalSpent: parseFloat(c.total_spent || 0),
        lastPurchase: c.last_purchase ? new Date(c.last_purchase) : null,
        isActive: c.is_active,
        notes: c.notes,
        userId: c.user_id,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getClients:", error);
      return [];
    }
  }

  async createClient(client: InsertClient): Promise<Client> {
    try {
      const result = await this.apiRequest('clients', {
        method: 'POST',
        body: JSON.stringify({
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address,
          business_category: client.businessCategory,
          total_spent: client.totalSpent,
          last_purchase: client.lastPurchase,
          is_active: client.isActive,
          notes: client.notes,
          user_id: client.userId
        })
      });
      
      const c = result[0];
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        businessCategory: c.business_category,
        totalSpent: parseFloat(c.total_spent || 0),
        lastPurchase: c.last_purchase ? new Date(c.last_purchase) : null,
        isActive: c.is_active,
        notes: c.notes,
        userId: c.user_id,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in createClient:", error);
      throw error;
    }
  }

  async updateClient(id: number, client: Partial<InsertClient>): Promise<Client | null> {
    try {
      const updateData: any = {};
      if (client.name !== undefined) updateData.name = client.name;
      if (client.email !== undefined) updateData.email = client.email;
      if (client.phone !== undefined) updateData.phone = client.phone;
      if (client.address !== undefined) updateData.address = client.address;
      if (client.totalSpent !== undefined) updateData.total_spent = client.totalSpent;
      if (client.lastPurchase !== undefined) updateData.last_purchase = client.lastPurchase;
      if (client.isActive !== undefined) updateData.is_active = client.isActive;
      if (client.notes !== undefined) updateData.notes = client.notes;

      const result = await this.apiRequest(`clients?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      if (result.length === 0) return null;
      
      const c = result[0];
      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        businessCategory: c.business_category,
        totalSpent: parseFloat(c.total_spent || 0),
        lastPurchase: c.last_purchase ? new Date(c.last_purchase) : null,
        isActive: c.is_active,
        notes: c.notes,
        userId: c.user_id,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in updateClient:", error);
      return null;
    }
  }

  async deleteClient(id: number): Promise<boolean> {
    try {
      await this.apiRequest(`clients?id=eq.${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error("Supabase REST error in deleteClient:", error);
      return false;
    }
  }

  async getAppointments(userId: number): Promise<Appointment[]> {
    try {
      const appointments = await this.apiRequest(
        `appointments?user_id=eq.${userId}&select=*&order=date.asc`
      );
      return appointments.map((a: any) => ({
        id: a.id,
        title: a.title,
        clientName: a.client_name,
        date: new Date(a.date),
        time: a.time,
        type: a.type,
        status: a.status,
        notes: a.notes,
        businessCategory: a.business_category,
        userId: a.user_id,
        createdAt: new Date(a.created_at),
        updatedAt: new Date(a.updated_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getAppointments:", error);
      return [];
    }
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    try {
      const result = await this.apiRequest('appointments', {
        method: 'POST',
        body: JSON.stringify({
          title: appointment.title,
          client_name: appointment.clientName,
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          notes: appointment.notes,
          business_category: appointment.businessCategory,
          user_id: appointment.userId
        })
      });
      
      const a = result[0];
      return {
        id: a.id,
        title: a.title,
        clientName: a.client_name,
        date: new Date(a.date),
        time: a.time,
        type: a.type,
        status: a.status,
        notes: a.notes,
        businessCategory: a.business_category,
        userId: a.user_id,
        createdAt: new Date(a.created_at),
        updatedAt: new Date(a.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in createAppointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment | null> {
    try {
      const updateData: any = {};
      if (appointment.title !== undefined) updateData.title = appointment.title;
      if (appointment.clientName !== undefined) updateData.client_name = appointment.clientName;
      if (appointment.date !== undefined) updateData.date = appointment.date;
      if (appointment.time !== undefined) updateData.time = appointment.time;
      if (appointment.type !== undefined) updateData.type = appointment.type;
      if (appointment.status !== undefined) updateData.status = appointment.status;
      if (appointment.notes !== undefined) updateData.notes = appointment.notes;

      const result = await this.apiRequest(`appointments?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      if (result.length === 0) return null;
      
      const a = result[0];
      return {
        id: a.id,
        title: a.title,
        clientName: a.client_name,
        date: new Date(a.date),
        time: a.time,
        type: a.type,
        status: a.status,
        notes: a.notes,
        businessCategory: a.business_category,
        userId: a.user_id,
        createdAt: new Date(a.created_at),
        updatedAt: new Date(a.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in updateAppointment:", error);
      return null;
    }
  }

  async deleteAppointment(id: number): Promise<boolean> {
    try {
      await this.apiRequest(`appointments?id=eq.${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error("Supabase REST error in deleteAppointment:", error);
      return false;
    }
  }

  async getCampaigns(userId: number, businessCategory: string): Promise<LoyaltyCampaign[]> {
    try {
      const campaigns = await this.apiRequest(
        `loyalty_campaigns?user_id=eq.${userId}&business_category=eq.${encodeURIComponent(businessCategory)}&select=*&order=created_at.desc`
      );
      return campaigns.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        discountType: c.discount_type,
        discountValue: parseFloat(c.discount_value),
        startDate: new Date(c.start_date),
        endDate: new Date(c.end_date),
        isActive: c.is_active,
        businessCategory: c.business_category,
        userId: c.user_id,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getCampaigns:", error);
      return [];
    }
  }

  async createCampaign(campaign: InsertLoyaltyCampaign): Promise<LoyaltyCampaign> {
    try {
      const result = await this.apiRequest('loyalty_campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name: campaign.name,
          description: campaign.description,
          discount_type: campaign.discountType,
          discount_value: campaign.discountValue,
          start_date: campaign.startDate,
          end_date: campaign.endDate,
          is_active: campaign.isActive,
          business_category: campaign.businessCategory,
          user_id: campaign.userId
        })
      });
      
      const c = result[0];
      return {
        id: c.id,
        name: c.name,
        description: c.description,
        discountType: c.discount_type,
        discountValue: parseFloat(c.discount_value),
        startDate: new Date(c.start_date),
        endDate: new Date(c.end_date),
        isActive: c.is_active,
        businessCategory: c.business_category,
        userId: c.user_id,
        createdAt: new Date(c.created_at),
        updatedAt: new Date(c.updated_at)
      };
    } catch (error) {
      console.error("Supabase REST error in createCampaign:", error);
      throw error;
    }
  }

  async getWhatsAppChats(userId: number, businessCategory: string): Promise<WhatsAppChat[]> {
    try {
      const chats = await this.apiRequest(
        `whatsapp_chats?user_id=eq.${userId}&business_category=eq.${encodeURIComponent(businessCategory)}&select=*&order=last_activity.desc`
      );
      return chats.map((c: any) => ({
        id: c.id,
        contactName: c.contact_name,
        lastMessage: c.last_message,
        lastActivity: new Date(c.last_activity),
        unreadCount: c.unread_count,
        businessCategory: c.business_category,
        userId: c.user_id,
        createdAt: new Date(c.created_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getWhatsAppChats:", error);
      return [];
    }
  }

  async getStockMovements(productId: number): Promise<StockMovement[]> {
    try {
      const movements = await this.apiRequest(
        `stock_movements?product_id=eq.${productId}&select=*&order=movement_date.desc`
      );
      return movements.map((m: any) => ({
        id: m.id,
        productId: m.product_id,
        movementType: m.movement_type,
        quantity: m.quantity,
        reason: m.reason,
        movementDate: new Date(m.movement_date),
        createdAt: new Date(m.created_at)
      }));
    } catch (error) {
      console.error("Supabase REST error in getStockMovements:", error);
      return [];
    }
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    try {
      const result = await this.apiRequest('stock_movements', {
        method: 'POST',
        body: JSON.stringify({
          product_id: movement.productId,
          movement_type: movement.movementType,
          quantity: movement.quantity,
          reason: movement.reason,
          movement_date: movement.movementDate
        })
      });
      
      const m = result[0];
      return {
        id: m.id,
        productId: m.product_id,
        movementType: m.movement_type,
        quantity: m.quantity,
        reason: m.reason,
        movementDate: new Date(m.movement_date),
        createdAt: new Date(m.created_at)
      };
    } catch (error) {
      console.error("Supabase REST error in createStockMovement:", error);
      throw error;
    }
  }
}

export { SupabaseRestStorage };
export const supabaseRestStorage = new SupabaseRestStorage();