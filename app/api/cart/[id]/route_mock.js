import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mock product variants (same as in cart route)
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

    // Initialize cart if it doesn't exist
    if (!global.mockCarts) {
      global.mockCarts = {};
    }
    if (!global.mockCarts[session.user.id]) {
      global.mockCarts[session.user.id] = [];
    }

    const userCart = global.mockCarts[session.user.id];
    const itemIndex = userCart.findIndex(item => item.id === cartItemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    const cartItem = userCart[itemIndex];
    const variant = mockVariants[cartItem.variantId];

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

    // Update cart item
    userCart[itemIndex].quantity = quantity;
    userCart[itemIndex].updatedAt = new Date();

    const updatedCartItem = {
      id: cartItem.id,
      userId: session.user.id,
      variantId: cartItem.variantId,
      quantity: quantity,
      createdAt: cartItem.createdAt,
      updatedAt: userCart[itemIndex].updatedAt,
      variant: variant
    };

    return NextResponse.json(updatedCartItem);
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

    // Initialize cart if it doesn't exist
    if (!global.mockCarts) {
      global.mockCarts = {};
    }
    if (!global.mockCarts[session.user.id]) {
      global.mockCarts[session.user.id] = [];
    }

    const userCart = global.mockCarts[session.user.id];
    const itemIndex = userCart.findIndex(item => item.id === cartItemId);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Remove cart item
    userCart.splice(itemIndex, 1);

    return NextResponse.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
