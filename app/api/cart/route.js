import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { reserveStock, updateStockReservation, releaseStock, getAvailableStock } from '@/lib/stock-management';

// Initialize global mock carts for fallback
if (!global.mockCarts) {
  global.mockCarts = {};
}

// Get variant data from database only - no fallbacks
async function getVariantData(variantId) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: {
      product: {
        include: {
          brand: true,
          category: true
        }
      },
      inventoryLevels: true
    }
  });
  
  if (!variant) {
    throw new Error(`Product variant ${variantId} not found`);
  }
  
  // Calculate total stock
  const totalStock = variant.inventoryLevels.reduce((total, inventory) => {
    return total + (inventory.stock - inventory.reserved);
  }, 0);
  
  variant.totalStock = Math.max(0, totalStock);
  return variant;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    let cartItems = [];

    const dbTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB_TIMEOUT')), 3000)
    );

    try {
      if (session?.user?.id) {
        cartItems = await Promise.race([
          prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: {
              variant: {
                include: {
                  product: { include: { brand: true, category: true } },
                  inventoryLevels: true
                }
              }
            }
          }),
          dbTimeout
        ]);
      } else if (sessionId) {
        cartItems = await Promise.race([
          prisma.cartItem.findMany({
            where: { sessionId: sessionId },
            include: {
              variant: {
                include: {
                  product: { include: { brand: true, category: true } },
                  inventoryLevels: true
                }
              }
            }
          }),
          dbTimeout
        ]);
      }
    } catch (dbError) {
      // Fallback to in-memory cart (used when DB is unavailable)
      const cartKey = session?.user?.id || sessionId || 'guest';
      const mockCart = global.mockCarts[cartKey] || [];
      try {
        cartItems = await Promise.all(mockCart.map(async (item) => {
          const variant = await getVariantData(item.variantId);
          return { id: item.id, quantity: item.quantity, variant };
        }));
      } catch {
        cartItems = [];
      }
    }


    // Calculate total stock for each variant
    cartItems = cartItems.map(item => {
      if (item.variant && item.variant.inventoryLevels) {
        // Calculate total available stock from all inventory levels
        const totalStock = item.variant.inventoryLevels.reduce((total, inventory) => {
          return total + (inventory.stock - inventory.reserved);
        }, 0);
        
        // Add totalStock to the variant object
        item.variant.totalStock = Math.max(0, totalStock);
      } else {
        // Fallback for variants without inventory data
        item.variant.totalStock = item.variant.totalStock || 0;
      }
      return item;
    });

    return NextResponse.json({
      success: true,
      data: cartItems,
      message: `Found ${cartItems.length} items in cart`
    });

  } catch (error) {
    console.error('Error fetching cart from MongoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const { variantId, quantity, sessionId } = data;

    if (!variantId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: variantId, quantity' },
        { status: 400 }
      );
    }

    let cartItem;
    const postTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB_TIMEOUT')), 3000)
    );

    try {
      const variant = await Promise.race([
        prisma.productVariant.findUnique({ where: { id: variantId }, include: { product: true } }),
        postTimeout
      ]);

      if (!variant) {
        return NextResponse.json(
          { success: false, error: 'Product variant not found' },
          { status: 404 }
        );
      }

      const availableStock = await getAvailableStock(variantId);

      const existingItem = await prisma.cartItem.findFirst({
        where: {
          variantId,
          ...(session?.user?.id ? { userId: session.user.id } : { sessionId })
        }
      });

      const totalQuantityNeeded = (existingItem?.quantity || 0) + quantity;

      if (totalQuantityNeeded > availableStock) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock. Only ${availableStock} units available.`, availableStock },
          { status: 400 }
        );
      }

      const stockResult = existingItem
        ? await updateStockReservation(variantId, existingItem.quantity, totalQuantityNeeded)
        : await reserveStock(variantId, quantity);

      if (!stockResult.success) {
        return NextResponse.json(
          { success: false, error: stockResult.message, availableStock: stockResult.availableStock },
          { status: 400 }
        );
      }

      const variantInclude = {
        variant: { include: { product: { include: { brand: true, category: true } } } }
      };

      if (existingItem) {
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: variantInclude
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: {
            variantId,
            quantity,
            userId: session?.user?.id,
            sessionId: session?.user?.id ? undefined : sessionId
          },
          include: variantInclude
        });
      }
    } catch (dbError) {
      // Fallback to in-memory cart when DB is unavailable
      const cartKey = session?.user?.id || sessionId || 'guest';
      if (!global.mockCarts[cartKey]) global.mockCarts[cartKey] = [];

      const existingIdx = global.mockCarts[cartKey].findIndex(i => i.variantId === variantId);
      if (existingIdx !== -1) {
        global.mockCarts[cartKey][existingIdx].quantity += quantity;
        const variant = await getVariantData(variantId);
        cartItem = { id: global.mockCarts[cartKey][existingIdx].id, quantity: global.mockCarts[cartKey][existingIdx].quantity, variant };
      } else {
        const newItem = { id: Date.now().toString(), variantId, quantity };
        global.mockCarts[cartKey].push(newItem);
        const variant = await getVariantData(variantId);
        cartItem = { id: newItem.id, quantity: newItem.quantity, variant };
      }
    }

    return NextResponse.json({ success: true, data: cartItem, message: 'Item added to cart successfully' });

  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const { itemId, quantity, sessionId } = data;

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: itemId' },
        { status: 400 }
      );
    }

    let cartItem;

    try {
      if (quantity <= 0) {
        const currentItem = await prisma.cartItem.findUnique({
          where: { id: itemId },
          include: { variant: true }
        });
        if (currentItem) await releaseStock(currentItem.variantId, currentItem.quantity);
        await prisma.cartItem.delete({ where: { id: itemId } });
        return NextResponse.json({ success: true, message: 'Item removed from cart' });
      }

      const currentItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { variant: true }
      });

      if (!currentItem) {
        return NextResponse.json({ success: false, error: 'Cart item not found' }, { status: 404 });
      }

      if (currentItem.quantity !== quantity) {
        const stockResult = await updateStockReservation(currentItem.variantId, currentItem.quantity, quantity);
        if (!stockResult.success) {
          return NextResponse.json(
            { success: false, error: stockResult.message, availableStock: stockResult.availableStock },
            { status: 400 }
          );
        }
      }

      cartItem = await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
        include: {
          variant: {
            include: {
              product: { include: { brand: true, category: true } },
              inventoryLevels: true
            }
          }
        }
      });

    } catch (dbError) {
      if (dbError.code === 'P2025' || dbError.message?.includes('Record to update not found')) {
        const [existing] = await prisma.cartItem.findMany({ where: { id: itemId } }).catch(() => []);
        if (existing) {
          return NextResponse.json({
            success: false,
            error: 'Cart item belongs to a different session. Please refresh.',
            code: 'SESSION_MISMATCH'
          }, { status: 403 });
        }
        return NextResponse.json({
          success: false,
          error: 'Cart item not found. Please refresh.',
          code: 'ITEM_NOT_FOUND'
        }, { status: 404 });
      }

      // Fallback to in-memory cart
      const cartKey = session?.user?.id || sessionId || 'guest';
      if (!global.mockCarts[cartKey]) global.mockCarts[cartKey] = [];

      let itemIndex = global.mockCarts[cartKey].findIndex(i => i.id === itemId);

      if (itemIndex === -1) {
        // Search other carts and migrate
        for (const key of Object.keys(global.mockCarts)) {
          const idx = global.mockCarts[key].findIndex(i => i.id === itemId);
          if (idx !== -1) {
            const [moved] = global.mockCarts[key].splice(idx, 1);
            moved.quantity = quantity;
            global.mockCarts[cartKey].push(moved);
            const variant = await getVariantData(moved.variantId);
            cartItem = { id: moved.id, quantity: moved.quantity, variant };
            break;
          }
        }
        if (!cartItem) {
          return NextResponse.json({ success: false, error: 'Cart item not found' }, { status: 404 });
        }
      } else {
        if (quantity <= 0) {
          global.mockCarts[cartKey].splice(itemIndex, 1);
          return NextResponse.json({ success: true, message: 'Item removed from cart' });
        }
        global.mockCarts[cartKey][itemIndex].quantity = quantity;
        const item = global.mockCarts[cartKey][itemIndex];
        const variant = await getVariantData(item.variantId);
        cartItem = { id: item.id, quantity: item.quantity, variant };
      }
    }

    return NextResponse.json({ success: true, data: cartItem, message: 'Cart item updated successfully' });

  } catch (error) {
    console.error('Cart PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart item: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const clearAll = searchParams.get('clearAll') === 'true';
    const sessionId = searchParams.get('sessionId');

    if (clearAll) {
      const session = await getServerSession();
      
      try {
        // Try database first
        let cartItems = [];
        
        if (session?.user?.id) {
          // Get all cart items for authenticated user before deleting
          cartItems = await prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: { variant: true }
          });
          
          // Clear all items for authenticated user
          await prisma.cartItem.deleteMany({
            where: { userId: session.user.id }
          });
        } else if (sessionId) {
          // Get all cart items for guest user before deleting
          cartItems = await prisma.cartItem.findMany({
            where: { sessionId: sessionId },
            include: { variant: true }
          });
          
          // Clear all items for guest user
          await prisma.cartItem.deleteMany({
            where: { sessionId: sessionId }
          });
        }

        for (const item of cartItems) {
          await releaseStock(item.variantId, item.quantity);
        }

      } catch (dbError) {
        const cartKey = session?.user?.id || sessionId || 'guest';
        global.mockCarts[cartKey] = [];
      }

      return NextResponse.json({
        success: true,
        message: 'All cart items cleared'
      });
    }

    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: itemId' },
        { status: 400 }
      );
    }

    try {
      // Try database first
      // Get cart item before deleting to release stock
      const cartItem = await prisma.cartItem.findUnique({
        where: { id: itemId },
        include: { variant: true }
      });

      if (cartItem) await releaseStock(cartItem.variantId, cartItem.quantity);
      await prisma.cartItem.delete({ where: { id: itemId } });

    } catch (dbError) {
      const session = await getServerSession(authOptions);
      const cartKey = session?.user?.id || sessionId || 'guest';
      
      if (!global.mockCarts[cartKey]) {
        global.mockCarts[cartKey] = [];
      }

      const itemIndex = global.mockCarts[cartKey].findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Cart item not found' },
          { status: 404 }
        );
      }

      global.mockCarts[cartKey].splice(itemIndex, 1);
    }

    return NextResponse.json({
      success: true,
      message: 'Cart item deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete cart item: ' + error.message },
      { status: 500 }
    );
  }
}
