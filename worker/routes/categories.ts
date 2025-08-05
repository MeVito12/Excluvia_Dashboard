import type { Env } from '../index';

async function callSupabaseCategories(path: string, method: string, body?: any, env?: Env, userId?: string) {
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

export async function handleCategories(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  const userId = request.headers.get('X-User-ID') || url.searchParams.get('user_id');
  
  try {
    if (path === '/api/categories' && method === 'GET') {
      const companyId = url.searchParams.get('company_id');
      
      let query = '/categories?select=*';
      if (companyId) {
        query += `&company_id=eq.${companyId}`;
      }
      
      const response = await callSupabaseCategories(query, 'GET', null, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to fetch categories', { status: response.status });
      }
      
      const categories = await response.json();
      
      return new Response(JSON.stringify(categories), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/subcategories' && method === 'GET') {
      const companyId = url.searchParams.get('company_id');
      
      let query = '/subcategories?select=*,categories(*)';
      if (companyId) {
        query += `&company_id=eq.${companyId}`;
      }
      
      const response = await callSupabaseCategories(query, 'GET', null, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to fetch subcategories', { status: response.status });
      }
      
      const subcategories = await response.json();
      
      return new Response(JSON.stringify(subcategories), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/categories' && method === 'POST') {
      const categoryData = await request.json();
      
      const response = await callSupabaseCategories('/categories', 'POST', categoryData, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to create category', { status: response.status });
      }
      
      const category = await response.json();
      
      return new Response(JSON.stringify(category), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/subcategories' && method === 'POST') {
      const subcategoryData = await request.json();
      
      const response = await callSupabaseCategories('/subcategories', 'POST', subcategoryData, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to create subcategory', { status: response.status });
      }
      
      const subcategory = await response.json();
      
      return new Response(JSON.stringify(subcategory), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Categories endpoint not found', { status: 404 });
    
  } catch (error) {
    console.error('Categories error:', error);
    return new Response('Categories error', { status: 500 });
  }
}