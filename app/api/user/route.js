import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      image: user.image,
      role: user.role,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyLevel: user.loyaltyLevel,
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

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { name, addresses } = data;

    // Update user info
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name: name
      },
      include: {
        addresses: true
      }
    });

    // Update addresses if provided
    if (addresses && addresses.length > 0) {
      // Delete existing addresses and create new ones
      await prisma.address.deleteMany({
        where: {
          userId: updatedUser.id
        }
      });

      await prisma.address.createMany({
        data: addresses.map(addr => ({
          ...addr,
          userId: updatedUser.id
        }))
      });
    }

    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
