import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: any;
let isConnected = false;

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL não encontrada, usando storage em memória");
    return null;
  }

  try {
    const client = postgres(process.env.DATABASE_URL, {
      connect_timeout: 10,
      idle_timeout: 20,
      max_lifetime: 60 * 30
    });
    
    // Testar conexão
    await client`SELECT 1`;
    console.log("✅ Conexão com Supabase estabelecida com sucesso");
    isConnected = true;
    return drizzle(client);
  } catch (error) {
    console.error("❌ Erro ao conectar com Supabase:", error instanceof Error ? error.message : String(error));
    console.log("🔄 Usando storage em memória como fallback");
    return null;
  }
}

// Inicializar conexão
initializeDatabase().then(result => {
  if (result) {
    db = result;
  }
});

export { db, isConnected };
export const isDatabaseAvailable = () => isConnected;