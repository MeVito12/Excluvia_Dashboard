import { users, type User, type InsertUser } from "@shared/schema";
import { db, isDatabaseAvailable } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!isDatabaseAvailable() || !db) {
      throw new Error("Database não está disponível");
    }
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!isDatabaseAvailable() || !db) {
      throw new Error("Database não está disponível");
    }
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!isDatabaseAvailable() || !db) {
      throw new Error("Database não está disponível");
    }
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

// Usar DatabaseStorage se disponível, senão MemStorage
export const storage = isDatabaseAvailable() ? new DatabaseStorage() : new MemStorage();
