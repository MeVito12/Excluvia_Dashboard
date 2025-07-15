import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔄 Testing Prisma connection...");
    const result = await prisma.user.findFirst();
    console.log("✅ Prisma connection successful!");
    console.log("User found:", result);
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
    await prisma.$disconnect();
  }
}

testConnection();