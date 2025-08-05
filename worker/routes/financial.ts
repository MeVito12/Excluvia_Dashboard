import type { Env } from '../index';

async function callSupabaseFinancial(path: string, method: string, body?: any, env?: Env, userId?: string) {
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

export async function handleFinancial(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  const userId = request.headers.get('X-User-ID') || url.searchParams.get('user_id');
  
  try {
    if (path === '/api/financial' && method === 'GET') {
      const companyId = url.searchParams.get('company_id');
      
      let query = '/financial_entries?select=*';
      if (companyId) {
        query += `&company_id=eq.${companyId}`;
      }
      
      const response = await callSupabaseFinancial(query, 'GET', null, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to fetch financial entries', { status: response.status });
      }
      
      const entries = await response.json();
      
      return new Response(JSON.stringify(entries), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/financial' && method === 'POST') {
      const entryData = await request.json();
      
      const response = await callSupabaseFinancial('/financial_entries', 'POST', entryData, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to create financial entry', { status: response.status });
      }
      
      const entry = await response.json();
      
      return new Response(JSON.stringify(entry), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Financial endpoint not found', { status: 404 });
    
  } catch (error) {
    console.error('Financial error:', error);
    return new Response('Financial error', { status: 500 });
  }
}