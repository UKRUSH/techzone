// Test script to verify user API fix
const { PrismaClient } = require('@prisma/client');

async function testUserAPI() {
  console.log("🧪 Testing User API Fix");
  
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log("✅ Prisma connection successful");
    
    // Test user query (same as user API)
    const user = await prisma.user.findUnique({
      where: {
        email: "shan@gmail.com"
      },
      include: {
        addresses: true,
        orders: {
          include: {
            orderItems: {
              include: {
                product: true,
                variant: true
              }
            },
            delivery: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        wishlist: {
          include: {
            variants: true,
            brand: true,
            category: true
          }
        },
        reviews: {
          include: {
            product: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            orders: true,
            reviews: true,
            wishlist: true
          }
        }
      }
    });
    
    console.log("✅ User query successful, user found:", !!user);
    if (user) {
      console.log("📊 User data:", {
        name: user.name,
        email: user.email,
        ordersCount: user._count.orders,
        reviewsCount: user._count.reviews,
        wishlistCount: user._count.wishlist
      });
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUserAPI();
