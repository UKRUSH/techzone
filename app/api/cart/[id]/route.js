import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity } = await request.json();
    const cartItemId = params.id;

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      },
      include: {
        variant: {
          include: {
            inventoryLevels: true
          }
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    const totalStock = cartItem.variant.inventoryLevels.reduce((sum, inv) => sum + inv.stock, 0);
    
    if (totalStock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${totalStock} items available` },
        { status: 400 }
      );
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
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

    // Add total stock to response
    const cartItemWithStock = {
      ...updatedCartItem,
      variant: {
        ...updatedCartItem.variant,
        totalStock: updatedCartItem.variant.inventoryLevels.reduce((sum, inv) => sum + inv.stock, 0)
      }
    };

    return NextResponse.json(cartItemWithStock);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove cart item
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItemId = params.id;

    // Check if cart item belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    return NextResponse.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
