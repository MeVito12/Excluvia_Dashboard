// Validador robusto para operações de banco de dados
import { z } from 'zod';

// Validação para constraints de client_type
export const clientTypeValidator = z.enum(['individual', 'company'], {
  errorMap: () => ({ message: "client_type deve ser 'individual' ou 'company'" })
});

// Validação para status de agendamentos
export const appointmentStatusValidator = z.enum(['scheduled', 'completed', 'cancelled'], {
  errorMap: () => ({ message: "status deve ser 'scheduled', 'completed' ou 'cancelled'" })
});

// Validação para status financeiro
export const financialStatusValidator = z.enum(['paid', 'pending', 'overdue'], {
  errorMap: () => ({ message: "status deve ser 'paid', 'pending' ou 'overdue'" })
});

// Validação para status de transferências
export const transferStatusValidator = z.enum(['pending', 'in_transit', 'completed', 'cancelled'], {
  errorMap: () => ({ message: "status deve ser 'pending', 'in_transit', 'completed' ou 'cancelled'" })
});

// Validação para métodos de pagamento
export const paymentMethodValidator = z.enum([
  'dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 
  'transferencia', 'boleto', 'debito_automatico'
], {
  errorMap: () => ({ message: "Método de pagamento inválido" })
});

// Schema para validação completa de produtos
export const productInsertSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.number().min(0, "Preço deve ser positivo"),
  stock: z.number().int().min(0, "Estoque deve ser zero ou positivo"),
  min_stock: z.number().int().min(0, "Estoque mínimo deve ser zero ou positivo"),
  barcode: z.string().optional(),
  is_perishable: z.boolean().default(false),
  manufacturing_date: z.string().optional(),
  expiry_date: z.string().optional(),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive()
});

// Schema para validação de clientes
export const clientInsertSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.string().optional(),
  client_type: clientTypeValidator.default('individual'),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive()
});

// Schema para validação de agendamentos
export const appointmentInsertSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  client_id: z.number().int().positive().optional(),
  client_name: z.string().optional(),
  appointment_date: z.string().refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
  start_time: z.string(),
  end_time: z.string(),
  status: appointmentStatusValidator.default('scheduled'),
  type: z.string().min(1, "Tipo é obrigatório"),
  notes: z.string().optional(),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive()
});

// Schema para validação de vendas
export const saleInsertSchema = z.object({
  product_id: z.number().int().positive(),
  client_id: z.number().int().positive().optional(),
  quantity: z.number().positive("Quantidade deve ser positiva"),
  unit_price: z.number().positive("Preço unitário deve ser positivo"),
  total_price: z.number().positive("Preço total deve ser positivo"),
  payment_method: paymentMethodValidator,
  sale_date: z.string().refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
  notes: z.string().optional(),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive()
});

// Schema para validação de entradas financeiras
export const financialEntryInsertSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
  status: financialStatusValidator.default('pending'),
  payment_method: paymentMethodValidator.optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive(),
  created_at: z.string().optional()
});

// Função para validar IDs existentes antes de inserção
export async function validateForeignKeys(
  pool: any,
  data: { product_id?: number; client_id?: number; created_by?: number; company_id?: number; branch_id?: number }
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    // Validar se produto existe
    if (data.product_id) {
      const productResult = await pool.query('SELECT id FROM products WHERE id = $1', [data.product_id]);
      if (productResult.rows.length === 0) {
        errors.push(`Produto com ID ${data.product_id} não encontrado`);
      }
    }
    
    // Validar se cliente existe
    if (data.client_id) {
      const clientResult = await pool.query('SELECT id FROM clients WHERE id = $1', [data.client_id]);
      if (clientResult.rows.length === 0) {
        errors.push(`Cliente com ID ${data.client_id} não encontrado`);
      }
    }
    
    // Validar se usuário existe
    if (data.created_by) {
      const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [data.created_by]);
      if (userResult.rows.length === 0) {
        errors.push(`Usuário com ID ${data.created_by} não encontrado`);
      }
    }
    
    return { isValid: errors.length === 0, errors };
  } catch (error) {
    return { isValid: false, errors: [`Erro ao validar chaves estrangeiras: ${error}`] };
  }
}

// Função para converter dados do formato brasileiro
export function convertBrazilianDate(dateStr: string): string {
  // Se já está no formato ISO, retorna como está
  if (dateStr.includes('-') && dateStr.length >= 10) {
    return dateStr;
  }
  
  // Converte de dd/mm/yyyy para yyyy-mm-dd
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  
  return dateStr;
}

// Função para sanitizar dados de entrada
export function sanitizeInsertData(data: any, schema: z.ZodSchema): { isValid: boolean; data?: any; errors?: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: [`Erro de validação: ${error}`] };
  }
}