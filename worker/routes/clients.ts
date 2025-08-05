import type { Env } from '../index';

async function callSupabaseClients(path: string, method: string, body?: any, env?: Env, userId?: string) {
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

export async function handleClients(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const url = new URL(request.url);
  const userId = request.headers.get('X-User-ID') || url.searchParams.get('user_id');
  
  try {
    if (path === '/api/clients' && method === 'GET') {
      const companyId = url.searchParams.get('company_id');
      
      let query = '/clients?select=*';
      if (companyId) {
        query += `&company_id=eq.${companyId}`;
      }
      
      const response = await callSupabaseClients(query, 'GET', null, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to fetch clients', { status: response.status });
      }
      
      const clients = await response.json();
      
      return new Response(JSON.stringify(clients), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/clients' && method === 'POST') {
      const clientData = await request.json();
      
      const response = await callSupabaseClients('/clients', 'POST', clientData, env, userId);
      
      if (!response.ok) {
        return new Response('Failed to create client', { status: response.status });
      }
      
      const client = await response.json();
      
      return new Response(JSON.stringify(client), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Clients endpoint not found', { status: 404 });
    
  } catch (error) {
    console.error('Clients error:', error);
    return new Response('Clients error', { status: 500 });
  }
}