import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("User API - Session check:", {
      hasSession: !!session,
      user: session?.user,
      email: session?.user?.email
    });
    
    if (!session?.user?.email) {
      console.log("User API - No session or email found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User API - Looking for user with email:", session.user.email);

    // Get user with all related data
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate total spent
    const totalSpent = user.orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.total, 0);

    // Calculate member years
    const memberSince = user.createdAt;
    const memberYears = new Date().getFullYear() - memberSince.getFullYear();

    // Get recent activity (last 10 activities)
    const recentActivity = [];
    
    // Add recent orders
    user.orders.slice(0, 5).forEach(order => {
      recentActivity.push({
        id: `order-${order.id}`,
        type: 'order',
        title: `Order ${order.confirmationNumber} ${order.status.toLowerCase()}`,
        description: `${order.orderItems.length} item${order.orderItems.length !== 1 ? 's' : ''} • $${order.total.toFixed(2)}`,
        date: order.updatedAt,
        status: order.status.toLowerCase(),
        icon: 'package'
      });
    });

    // Add recent reviews
    user.reviews.slice(0, 3).forEach(review => {
      recentActivity.push({
        id: `review-${review.id}`,
        type: 'review',
        title: `Reviewed ${review.product.name}`,
        description: `${review.rating} star${review.rating !== 1 ? 's' : ''} • "${review.title}"`,
        date: review.createdAt,
        rating: review.rating,
        icon: 'star'
      });
    });

    // Sort by date
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Return user data
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
      memberSince: user.createdAt,
      createdAt: user.createdAt,
      memberYears,
      addresses: user.addresses,
      stats: {
        totalOrders: user._count.orders,
        totalSpent: totalSpent,
        totalReviews: user._count.reviews,
        wishlistItems: user._count.wishlist,
        loyaltyPoints: user.loyaltyPoints
      },
      recentOrders: user.orders.slice(0, 5).map(order => ({
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
      recentActivity: recentActivity.slice(0, 10),
      preferences: {
        emailNotifications: true, // You can add a preferences field to user model later
        pushNotifications: true,
        marketingEmails: false
      }
    };

    return NextResponse.json(userData);

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT method for updating user profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData = await request.json();
    const { name, email, phone, address, preferences } = updateData;

    // Validate email format if being updated
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
      }

      // Check if email is already taken by another user
      if (email !== session.user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email }
        });
        if (existingUser) {
          return NextResponse.json({ error: "Email already taken" }, { status: 400 });
        }
      }
    }

    // Validate Sri Lankan phone number format if being updated
    if (phone) {
      const phoneRegex = /^0\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json({ 
          error: "Phone number must be exactly 10 digits starting with 0 (Sri Lankan format)" 
        }, { status: 400 });
      }
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        phone: phone || null, // Allow clearing phone number
        address: address || null, // Allow clearing address
        updatedAt: new Date()
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

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate stats (same as GET method)
    const totalSpent = updatedUser.orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.total, 0);

    const memberSince = updatedUser.createdAt;
    const memberYears = new Date().getFullYear() - memberSince.getFullYear();

    // Get recent activity
    const recentActivity = [];
    
    updatedUser.orders.slice(0, 5).forEach(order => {
      recentActivity.push({
        id: `order-${order.id}`,
        type: 'order',
        title: `Order ${order.confirmationNumber} ${order.status.toLowerCase()}`,
        description: `${order.orderItems.length} item${order.orderItems.length !== 1 ? 's' : ''} • $${order.total.toFixed(2)}`,
        date: order.updatedAt,
        status: order.status.toLowerCase(),
        icon: 'package'
      });
    });

    updatedUser.reviews.slice(0, 3).forEach(review => {
      recentActivity.push({
        id: `review-${review.id}`,
        type: 'review',
        title: `Reviewed ${review.product.name}`,
        description: `${review.rating} star${review.rating !== 1 ? 's' : ''} • "${review.title}"`,
        date: review.createdAt,
        rating: review.rating,
        icon: 'star'
      });
    });

    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    const userData = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      image: updatedUser.image,
      role: updatedUser.role,
      loyaltyPoints: updatedUser.loyaltyPoints,
      loyaltyLevel: updatedUser.loyaltyLevel,
      memberSince: updatedUser.createdAt,
      memberYears,
      addresses: updatedUser.addresses,
      stats: {
        totalOrders: updatedUser._count.orders,
        totalSpent: totalSpent,
        totalReviews: updatedUser._count.reviews,
        wishlistItems: updatedUser._count.wishlist,
        loyaltyPoints: updatedUser.loyaltyPoints
      },
      recentOrders: updatedUser.orders.slice(0, 5).map(order => ({
        id: order.id,
        confirmationNumber: order.confirmationNumber,
        status: order.status,
        total: order.total,
        itemCount: order.orderItems.length,
        createdAt: order.createdAt,
        trackingNumber: order.delivery?.trackingNumber
      })),
      wishlist: updatedUser.wishlist.map(product => ({
        id: product.id,
        name: product.name,
        price: product.variants[0]?.price || 0,
        images: product.images,
        brand: product.brand.name,
        category: product.category.name,
        inStock: product.variants.some(v => v.inventoryLevels?.some(i => i.stock > 0))
      })),
      recentActivity: recentActivity.slice(0, 10),
      preferences: {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false
      }
    };

    return NextResponse.json(userData);

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE method for deleting user account
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user and all related data (cascade delete should handle this)
    await prisma.user.delete({
      where: {
        email: session.user.email
      }
    });

    return NextResponse.json({ message: "User account deleted successfully" });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
