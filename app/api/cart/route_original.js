import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/cart - Get user's cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        variant: {
          include: {
            product: {
              include: {
                category: true,
                brand: true,
                images: {
                  orderBy: { displayOrder: 'asc' }
                }
              }
            },
            inventoryLevels: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate total stock for each variant
    const cartWithStock = cartItems.map(item => ({
      ...item,
      variant: {
        ...item.variant,
        totalStock: item.variant.inventoryLevels.reduce((sum, inv) => sum + inv.stock, 0)
      }
    }));

    return NextResponse.json(cartWithStock);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { variantId, quantity = 1 } = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID is required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if variant exists and has stock
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        inventoryLevels: true,
        product: true
      }
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Product variant not found' },
        { status: 404 }
      );
    }

    const totalStock = variant.inventoryLevels.reduce((sum, inv) => sum + inv.stock, 0);
    
    if (totalStock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${totalStock} items available` },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_variantId: {
          userId: session.user.id,
          variantId: variantId
        }
      }
    });

    let cartItem;

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (totalStock < newQuantity) {
        return NextResponse.json(
          { error: `Cannot add ${quantity} more items. Only ${totalStock - existingCartItem.quantity} additional items available` },
          { status: 400 }
        );
      }

      // Update existing cart item
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                  brand: true,
                  images: {
                    orderBy: { displayOrder: 'asc' }
                  }
                }
              },
              inventoryLevels: true
            }
          }
        }
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          variantId: variantId,
          quantity: quantity
        },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true,
                  brand: true,
                  images: {
                    orderBy: { displayOrder: 'asc' }
                  }
                }
              },
              inventoryLevels: true
            }
          }
        }
      });
    }

    // Add total stock to response
    const cartItemWithStock = {
      ...cartItem,
      variant: {
        ...cartItem.variant,
        totalStock: cartItem.variant.inventoryLevels.reduce((sum, inv) => sum + inv.stock, 0)
      }
    };

    return NextResponse.json(cartItemWithStock);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      }
    });

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
