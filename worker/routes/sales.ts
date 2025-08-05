import type { Env } from '../index';

async function callSupabaseSales(path: string, method: string, body?: any, env?: Env, userId?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': env?.SUPABASE_SERVICE_ROLE_KEY || '',
    'Authorization': `Bearer ${env?.SUPABASE_SERVICE_ROLE_KEY || ''}`,
  };

  if (userId) {
    headers['X-User-Email'] = userId;
  }

  const response = await fetch(`${env?.SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}

export async function handleSales(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  const userId = request.headers.get('X-User-ID') || url.searchParams.get('user_id');
  
  try {
    if (path === '/api/sales' && method === 'GET') {
      const companyId = url.searchParams.get('company_id');
      
      let query = '/sales?select=*,products(name),clients(name)';
      if (companyId) {
        query += `&company_id=eq.${companyId}`;
      }
      
      const response = await callSupabaseSales(query, 'GET', null, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to fetch sales', { status: response.status });
      }
      
      const sales = await response.json();
      
      return new Response(JSON.stringify(sales), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/sales' && method === 'POST') {
      const saleData = await request.json();
      
      // Processar venda completa com múltiplos produtos
      const { cart, client_id, payment_method, sellers, discount } = saleData;
      
      const salesPromises = cart.map((item: any) => {
        const saleItem = {
          product_id: item.productId,
          client_id: client_id || null,
          quantity: item.quantity,
          unit_price: item.price,
          total_amount: item.price * item.quantity,
          payment_method,
          sellers: sellers || [],
          discount: discount || 0,
          company_id: saleData.company_id,
          user_id: saleData.user_id,
          status: 'completed'
        };
        
        return callSupabaseSales('/sales', 'POST', saleItem, env, userId);
      });
      
      const responses = await Promise.all(salesPromises);
      
      // Verificar se todas as vendas foram criadas com sucesso
      const failed = responses.find(r => !r.ok);
      if (failed) {
        return new Response('Failed to create sales', { status: failed.status });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Sales endpoint not found', { status: 404 });
    
  } catch (error) {
    console.error('Sales error:', error);
    return new Response('Sales error', { status: 500 });
  }
}