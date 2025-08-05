import type { Env } from '../index';

// Simulação da autenticação com Supabase
async function callSupabase(path: string, method: string, body?: any, env?: Env) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': env?.SUPABASE_SERVICE_ROLE_KEY || '',
    'Authorization': `Bearer ${env?.SUPABASE_SERVICE_ROLE_KEY || ''}`,
  };

  const response = await fetch(`${env?.SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
}

export async function handleAuth(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  
  try {
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = await request.json();
      
      // Buscar usuário no Supabase
      const userResponse = await callSupabase(
        `/users?email=eq.${email}&select=*,companies(*)`,
        'GET',
        null,
        env
      );
      
      if (!userResponse.ok) {
        return new Response('User not found', { status: 404 });
      }
      
      const users = await userResponse.json();
      if (users.length === 0) {
        return new Response('User not found', { status: 404 });
      }
      
      const user = users[0];
      
      // Em produção, verificar a senha corretamente
      // Por enquanto, aceitar qualquer senha para demo
      
      return new Response(JSON.stringify({
        user: {
          id: user.id,
          email: user.email,
          companyId: user.company_id,
          company: user.companies
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else if (path === '/api/auth/logout' && method === 'POST') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Auth endpoint not found', { status: 404 });
    
  } catch (error) {
    console.error('Auth error:', error);
    return new Response('Auth error', { status: 500 });
  }
}