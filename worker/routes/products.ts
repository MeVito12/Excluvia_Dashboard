import type { Env } from '../index';

async function callSupabase(path: string, method: string, body?: any, env?: Env, userId?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': env?.SUPABASE_SERVICE_ROLE_KEY || '',
    'Authorization': `Bearer ${env?.SUPABASE_SERVICE_ROLE_KEY || ''}`,
  };

  // Para RLS, precisamos definir o usuário atual
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

export async function handleProducts(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  
  // Extrair user_id dos headers ou query params
  const userId = request.headers.get('X-User-ID') || url.searchParams.get('user_id');
  
  try {
    if (path === '/api/products' && method === 'GET') {
      const companyId = url.searchParams.get('company_id');
      
      let query = '/products?select=*';
      if (companyId) {
        query += `&company_id=eq.${companyId}`;
      }
      
      const response = await callSupabase(query, 'GET', null, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to fetch products', { status: response.status });
      }
      
      const products = await response.json();
      
      return new Response(JSON.stringify(products), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/products' && method === 'POST') {
      const productData = await request.json();
      
      const response = await callSupabase('/products', 'POST', productData, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to create product', { status: response.status });
      }
      
      const product = await response.json();
      
      return new Response(JSON.stringify(product), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Products endpoint not found', { status: 404 });
    
  } catch (error) {
    console.error('Products error:', error);
    return new Response('Products error', { status: 500 });
  }
}