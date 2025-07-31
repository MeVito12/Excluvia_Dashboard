// Manipulador robusto de erros de banco de dados
import { z } from 'zod';

export interface DatabaseError {
  message: string;
  constraint?: string;
  detail?: string;
  hint?: string;
  code?: string;
}

export interface SafeInsertResult<T = any> {
  success: boolean;
  data?: T;
  error?: DatabaseError;
  validationErrors?: string[];
}

// Função para lidar com erros específicos do PostgreSQL
export function handleDatabaseError(error: any): DatabaseError {
  const errorMessage = error?.message || error?.toString() || 'Erro desconhecido';
  
  // Erro de constraint de tipo
  if (errorMessage.includes('client_type_check')) {
    return {
      message: "Tipo de cliente inválido. Use 'individual' ou 'company'",
      constraint: 'client_type_check',
      hint: "Defina client_type como 'individual' (padrão) ou 'company'"
    };
  }
  
  // Erro de campo obrigatório
  if (errorMessage.includes('not-null') || errorMessage.includes('NOT NULL')) {
    const field = extractFieldFromError(errorMessage);
    return {
      message: `Campo obrigatório ausente: ${field}`,
      constraint: 'not_null',
      hint: `Certifique-se de fornecer o campo ${field}`
    };
  }
  
  // Erro de chave estrangeira
  if (errorMessage.includes('foreign key') || errorMessage.includes('fkey')) {
    const keyInfo = extractForeignKeyInfo(errorMessage);
    return {
      message: `Referência inválida: ${keyInfo.table} com ID ${keyInfo.id} não existe`,
      constraint: 'foreign_key',
      hint: `Verifique se o ${keyInfo.table} com ID ${keyInfo.id} existe antes de inserir`
    };
  }
  
  // Erro de constraint de status
  if (errorMessage.includes('status_check')) {
    return {
      message: "Status inválido",
      constraint: 'status_check',
      hint: "Use um status válido para esta tabela"
    };
  }
  
  // Erro de tabela não encontrada
  if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
    const tableName = extractTableNameFromError(errorMessage);
    return {
      message: `Tabela não encontrada: ${tableName}`,
      constraint: 'table_not_found',
      hint: `A tabela ${tableName} não existe no banco de dados`
    };
  }
  
  return {
    message: errorMessage,
    code: error?.code
  };
}

// Função para extrair nome do campo do erro
function extractFieldFromError(errorMessage: string): string {
  const match = errorMessage.match(/column "([^"]+)"/);
  return match ? match[1] : 'campo desconhecido';
}

// Função para extrair informações de chave estrangeira
function extractForeignKeyInfo(errorMessage: string): { table: string; id: string } {
  const keyMatch = errorMessage.match(/Key \(([^)]+)\)=\(([^)]+)\)/);
  const tableMatch = errorMessage.match(/table "([^"]+)"/);
  
  return {
    table: tableMatch ? tableMatch[1] : 'tabela desconhecida',
    id: keyMatch ? keyMatch[2] : 'ID desconhecido'
  };
}

// Função para extrair nome da tabela do erro
function extractTableNameFromError(errorMessage: string): string {
  const match = errorMessage.match(/relation "([^"]+)"/);
  return match ? match[1] : 'tabela desconhecida';
}

// Função para inserção segura com validação e tratamento de erros
export async function safeInsert<T>(
  queryFunction: () => Promise<T>,
  validationSchema?: z.ZodSchema,
  data?: any
): Promise<SafeInsertResult<T>> {
  try {
    // Validação dos dados se schema fornecido
    if (validationSchema && data) {
      const validation = validationSchema.safeParse(data);
      if (!validation.success) {
        return {
          success: false,
          validationErrors: validation.error.errors.map(err => 
            `${err.path.join('.')}: ${err.message}`
          )
        };
      }
    }
    
    // Executar query
    const result = await queryFunction();
    
    return {
      success: true,
      data: result
    };
    
  } catch (error) {
    const dbError = handleDatabaseError(error);
    
    return {
      success: false,
      error: dbError
    };
  }
}

// Schemas de validação específicos para evitar erros
export const safeClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.string().optional(),
  client_type: z.enum(['individual', 'company']).default('individual'),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive()
});

export const safeAppointmentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  client_id: z.number().int().positive().optional(),
  client_name: z.string().optional(),
  appointment_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
  type: z.string().min(1, "Tipo é obrigatório"), // Campo obrigatório
  notes: z.string().optional(),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive()
});

export const safeFinancialSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  due_date: z.string(),
  status: z.enum(['paid', 'pending', 'overdue']).default('pending'),
  payment_method: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  company_id: z.number().int().positive(),
  branch_id: z.number().int().positive(),
  created_by: z.number().int().positive(),
  created_at: z.string().optional()
});

// Função helper para verificar se IDs existem antes de inserir
export async function validateIds(pool: any, ids: { 
  product_id?: number; 
  client_id?: number; 
  created_by?: number 
}): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  
  try {
    if (ids.product_id) {
      const result = await pool.query('SELECT 1 FROM products WHERE id = $1', [ids.product_id]);
      if (result.rows.length === 0) {
        errors.push(`Produto ID ${ids.product_id} não encontrado`);
      }
    }
    
    if (ids.client_id) {
      const result = await pool.query('SELECT 1 FROM clients WHERE id = $1', [ids.client_id]);
      if (result.rows.length === 0) {
        errors.push(`Cliente ID ${ids.client_id} não encontrado`);
      }
    }
    
    if (ids.created_by) {
      const result = await pool.query('SELECT 1 FROM users WHERE id = $1', [ids.created_by]);
      if (result.rows.length === 0) {
        errors.push(`Usuário ID ${ids.created_by} não encontrado`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  } catch (error) {
    return { valid: false, errors: [`Erro ao validar IDs: ${error}`] };
  }
}