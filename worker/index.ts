/**
 * Cloudflare Worker para Sistema de Gestão
 * Substitui o servidor Express atual
 */

// Tipos para as bindings do Cloudflare
export interface Env {
  // DB: D1Database; // Comentado - usando Supabase
  // CACHE: KVNamespace; // Comentado - opcional
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ASSETS: Fetcher;
}

// Imports necessários (simular estrutura atual)
import { handleAuth } from './routes/auth';
import { handleProducts } from './routes/products';
import { handleClients } from './routes/clients';
import { handleSales } from './routes/sales';
import { handleFinancial } from './routes/financial';
import { handleCategories } from './routes/categories';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        let response: Response;

        if (path.startsWith('/api/auth/')) {
          response = await handleAuth(request, env, path);
        } else if (path.startsWith('/api/products')) {
          response = await handleProducts(request, env, path);
        } else if (path.startsWith('/api/clients')) {
          response = await handleClients(request, env, path);
        } else if (path.startsWith('/api/sales')) {
          response = await handleSales(request, env, path);
        } else if (path.startsWith('/api/financial')) {
          response = await handleFinancial(request, env, path);
        } else if (path.startsWith('/api/categories')) {
          response = await handleCategories(request, env, path);
        } else if (path.startsWith('/api/subcategories')) {
          response = await handleCategories(request, env, path);
        } else {
          response = new Response('API endpoint not found', { status: 404 });
        }

        // Add CORS headers to API responses
        const headers = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      }

      // Serve static assets (React app)
      return env.ASSETS.fetch(request);

    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders 
      });
    }
  },
};