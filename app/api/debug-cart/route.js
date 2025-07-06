import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Debug endpoint to check cart state
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize mock cart if it doesn't exist
    if (!global.mockCarts) {
      global.mockCarts = {};
    }

    const userCart = global.mockCarts[session.user.id] || [];
    
    return NextResponse.json({
      userId: session.user.id,
      cartItems: userCart,
      cartItemsCount: userCart.length,
      allCarts: Object.keys(global.mockCarts).map(userId => ({
        userId,
        itemsCount: global.mockCarts[userId].length,
        items: global.mockCarts[userId]
      }))
    });
  } catch (error) {
    console.error('Error in debug cart:', error);
    return NextResponse.json(
      { error: 'Failed to debug cart' },
      { status: 500 }
    );
  }
}

// Add a test cart item for debugging
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize mock cart if it doesn't exist
    if (!global.mockCarts) {
      global.mockCarts = {};
    }

    if (!global.mockCarts[session.user.id]) {
      global.mockCarts[session.user.id] = [];
    }

    // Add a test cart item
    const testItem = {
      id: Date.now().toString(),
      variantId: "1", // Intel Core i7-13700K
      quantity: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    global.mockCarts[session.user.id].push(testItem);

    return NextResponse.json({
      message: 'Test cart item added',
      cartItem: testItem,
      cart: global.mockCarts[session.user.id]
    });
  } catch (error) {
    console.error('Error adding test cart item:', error);
    return NextResponse.json(
      { error: 'Failed to add test cart item' },
      { status: 500 }
    );
  }
}
