import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Mock cart storage (in production this would be in database)
if (!global.mockCarts) {
  global.mockCarts = {};
}

// Mock product variants for cart items
const mockVariants = {
  "1": {
    id: "1",
    price: 409.99,
    product: {
      id: "1",
      name: "Intel Core i7-13700K",
      category: { name: "CPU" },
      brand: { name: "Intel" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 50
  },
  "2": {
    id: "2", 
    price: 599.99,
    product: {
      id: "2",
      name: "NVIDIA GeForce RTX 4070",
      category: { name: "Graphics Cards" },
      brand: { name: "NVIDIA" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 25
  },
  "3": {
    id: "3",
    price: 129.99,
    product: {
      id: "3",
      name: "Corsair Vengeance RGB Pro 32GB",
      category: { name: "Memory" },
      brand: { name: "Corsair" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 100
  },
  "4": {
    id: "4",
    price: 89.99,
    product: {
      id: "4",
      name: "Samsung 980 PRO 1TB SSD",
      category: { name: "Storage" },
      brand: { name: "Samsung" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 75
  },
  "5": {
    id: "5",
    price: 329.99,
    product: {
      id: "5",
      name: "ASUS ROG Strix Z690-E",
      category: { name: "Motherboards" },
      brand: { name: "ASUS" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 30
  },
  "6": {
    id: "6",
    price: 129.99,
    product: {
      id: "6",
      name: "Corsair RM850x 850W PSU",
      category: { name: "Power Supplies" },
      brand: { name: "Corsair" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 40
  }
};

// GET /api/cart - Get user's cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCart = global.mockCarts[session.user.id] || [];
    
    // Transform to match expected format
    const cartItems = userCart.map(item => ({
      id: item.id,
      userId: session.user.id,
      variantId: item.variantId,
      quantity: item.quantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      variant: mockVariants[item.variantId]
    }));

    return NextResponse.json(cartItems);
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

    const variant = mockVariants[variantId];
    if (!variant) {
      return NextResponse.json(
        { error: 'Product variant not found' },
        { status: 404 }
      );
    }

    if (variant.totalStock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${variant.totalStock} items available` },
        { status: 400 }
      );
    }

    // Initialize user cart if it doesn't exist
    if (!global.mockCarts[session.user.id]) {
      global.mockCarts[session.user.id] = [];
    }

    const userCart = global.mockCarts[session.user.id];
    const existingItemIndex = userCart.findIndex(item => item.variantId === variantId);

    let cartItem;

    if (existingItemIndex !== -1) {
      // Update existing item
      const newQuantity = userCart[existingItemIndex].quantity + quantity;
      
      if (variant.totalStock < newQuantity) {
        return NextResponse.json(
          { error: `Cannot add ${quantity} more items. Only ${variant.totalStock - userCart[existingItemIndex].quantity} additional items available` },
          { status: 400 }
        );
      }

      userCart[existingItemIndex].quantity = newQuantity;
      userCart[existingItemIndex].updatedAt = new Date();
      
      cartItem = {
        id: userCart[existingItemIndex].id,
        userId: session.user.id,
        variantId: variantId,
        quantity: newQuantity,
        createdAt: userCart[existingItemIndex].createdAt,
        updatedAt: userCart[existingItemIndex].updatedAt,
        variant: variant
      };
    } else {
      // Create new cart item
      const newItem = {
        id: Date.now().toString(),
        variantId: variantId,
        quantity: quantity,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      userCart.push(newItem);
      
      cartItem = {
        id: newItem.id,
        userId: session.user.id,
        variantId: variantId,
        quantity: quantity,
        createdAt: newItem.createdAt,
        updatedAt: newItem.updatedAt,
        variant: variant
      };
    }

    return NextResponse.json(cartItem);
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

    global.mockCarts[session.user.id] = [];

    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
