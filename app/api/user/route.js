import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

// Create a simple, reliable Prisma client
const createSimplePrismaClient = () => {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
};

export async function GET() {
  console.log("🚀 Starting simple user GET API");
  let prisma = null;
  
  try {
    // Get session first
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log("❌ No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("👤 Getting user data for:", session.user.email);
    
    // Create and connect to database
    prisma = createSimplePrismaClient();
    await prisma.$connect();
    console.log("✅ Database connected");
    
    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        wishlist: {
          include: {
            variants: true,
            brand: true,
            category: true
          }
        },
        reviews: {
          include: { product: true },
          orderBy: { createdAt: 'desc' }
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

    if (!user) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate stats
    const totalSpent = user.orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.total, 0);

    const memberSince = user.createdAt;
    const memberYears = new Date().getFullYear() - memberSince.getFullYear();

    // Build response
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      image: user.image,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyLevel: user.loyaltyLevel,
      createdAt: user.createdAt, // Add this for "Member Since" display
      memberSince: user.createdAt,
      memberYears,
      addresses: user.addresses,
      stats: {
        totalOrders: user._count.orders,
        totalSpent: totalSpent,
        totalReviews: user._count.reviews,
        wishlistItems: user._count.wishlist,
        loyaltyPoints: user.loyaltyPoints
      },
      recentOrders: user.orders.map(order => ({
        id: order.id,
        confirmationNumber: order.confirmationNumber,
        status: order.status,
        total: order.total,
        itemCount: order.orderItems.length,
        createdAt: order.createdAt,
        trackingNumber: order.delivery?.trackingNumber
      })),
      wishlist: user.wishlist.map(product => ({
        id: product.id,
        name: product.name,
        price: product.variants[0]?.price || 0,
        images: product.images,
        brand: product.brand.name,
        category: product.category.name,
        inStock: product.variants.some(v => v.inventoryLevels?.some(i => i.stock > 0))
      })),
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false
      }
    };

    console.log("✅ User data retrieved successfully");
    return NextResponse.json(userData);

  } catch (error) {
    console.error("❌ Error in simple user GET:", error);
    return NextResponse.json(
      { error: "Failed to get user data", details: error.message },
      { status: 500 }
    );
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export async function PUT(request) {
  console.log("🚀 Starting simple user PUT API");
  let prisma = null;
  
  try {
    // Get session first
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log("❌ No session found for PUT request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("👤 Updating user:", session.user.email);
    
    // Parse request data
    let updateData;
    try {
      updateData = await request.json();
      console.log("📝 Update data received:", Object.keys(updateData));
    } catch (jsonError) {
      console.error("❌ Invalid JSON:", jsonError.message);
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }
    
    // Validate phone number if provided
    if (updateData.phone && !/^0\d{9}$/.test(updateData.phone.replace(/\s/g, ''))) {
      return NextResponse.json({ 
        error: "Phone number must be exactly 10 digits starting with 0" 
      }, { status: 400 });
    }
    
    // Create and connect to database
    prisma = createSimplePrismaClient();
    await prisma.$connect();
    console.log("✅ Database connected for update");
    
    // Update user - but preserve email to prevent session issues
    const { name, email, phone, address } = updateData;
    
    // Don't allow email changes for now to prevent session issues
    const updateFields = {
      ...(name !== undefined && { name }),
      // Skip email updates to prevent session mismatches
      phone: phone || null,
      address: address || null,
      updatedAt: new Date()
    };
    
    console.log("📝 Fields to update (email preserved):", updateFields);
    
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateFields,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log("✅ User updated successfully");
    
    return NextResponse.json({
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        image: updatedUser.image,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt, // For "Member Since" display
        memberSince: updatedUser.createdAt,
        lastUpdated: updatedUser.updatedAt
      },
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("❌ Error in simple user PUT:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export async function DELETE() {
  console.log("🚀 Starting user DELETE API");
  let prisma = null;
  
  try {
    // Get session first
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      console.log("❌ No session found for DELETE request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("🗑️ Deleting user:", session.user.email);
    
    // Create and connect to database
    prisma = createSimplePrismaClient();
    await prisma.$connect();
    console.log("✅ Database connected for deletion");
    
    // Check if user exists before deletion
    const existingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true }
    });
    
    if (!existingUser) {
      console.log("❌ User not found for deletion");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("👤 User found for deletion:", existingUser);
    
    // Delete user and related data
    // Note: Cascade deletes should handle related records
    const deletedUser = await prisma.user.delete({
      where: { email: session.user.email }
    });

    console.log("✅ User deleted successfully");
    
    return NextResponse.json({
      message: "User account deleted successfully",
      deletedUser: {
        id: deletedUser.id,
        email: deletedUser.email,
        name: deletedUser.name
      }
    });

  } catch (error) {
    console.error("❌ Error deleting user:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: "Failed to delete user account", details: error.message },
      { status: 500 }
    );
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
