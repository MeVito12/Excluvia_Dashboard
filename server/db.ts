import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "@shared/schema";
import path from "path";

// Criar banco SQLite na pasta do projeto
const dbPath = path.join(process.cwd(), "database.sqlite");
const sqlite = new Database(dbPath);

// Inicializar Drizzle com SQLite
export const db = drizzle(sqlite);

// Criar tabelas se não existirem
function initializeTables() {
  try {
    // Criar tabela de usuários
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);
    console.log("✅ Banco de dados SQLite inicializado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao criar tabelas:", error);
  }
}

// Inicializar as tabelas
initializeTables();