import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("Checking users in database...");
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role} - Created: ${user.createdAt}`);
    });

    if (users.length === 0) {
      console.log("No users found in database");
    }

  } catch (error) {
    console.error("Error checking users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
