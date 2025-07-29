// Teste simples de conexão Supabase
import postgres from 'postgres';

async function testSupabase() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.log('❌ DATABASE_URL não configurada');
    return;
  }

  console.log('🔗 Testando conexão Supabase...');
  
  try {
    const sql = postgres(connectionString, {
      ssl: 'require',
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    // Testar conexão básica
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Conexão estabelecida:', result[0].current_time);

    // Verificar se tabela users existe
    try {
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      `;
      
      if (tables.length > 0) {
        console.log('✅ Tabela "users" encontrada');
        
        // Testar contagem de usuários
        const count = await sql`SELECT COUNT(*) as total FROM users`;
        console.log('👥 Total de usuários:', count[0].total);
      } else {
        console.log('⚠️  Tabela "users" não encontrada');
        console.log('📋 Execute o SQL do arquivo migrations/schema.sql');
      }
    } catch (tableError) {
      console.log('❌ Erro ao verificar tabelas:', tableError.message);
    }

    await sql.end();
  } catch (error) {
    console.log('❌ Erro de conexão:', error.message);
  }
}

testSupabase();