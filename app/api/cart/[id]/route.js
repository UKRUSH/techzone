import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// Mock cart storage (same as main cart route)
if (!global.mockCarts) {
  global.mockCarts = {};
}

// Mock product variants (same as main cart route)
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
      name: "Samsung 980 PRO 1TB NVMe SSD",
      category: { name: "Storage" },
      brand: { name: "Samsung" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 75
  },
  "5": {
    id: "5",
    price: 89.99,
    product: {
      id: "5",
      name: "ASUS ROG Strix B650-E",
      category: { name: "Motherboard" },
      brand: { name: "ASUS" },
      images: ["/api/placeholder/400/400"]
    },
    totalStock: 30
  }
};

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('PUT /api/cart/[id] - Session:', session?.user ? { id: session.user.id, email: session.user.email } : 'No session');
    
    if (!session?.user) {
      console.log('PUT /api/cart/[id] - Unauthorized: No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quantity } = await request.json();
    const cartItemId = params.id;

    console.log('PUT /api/cart/[id] - Updating cart item:', { cartItemId, quantity, userId: session.user.id });

    if (!quantity || quantity <= 0) {
      console.log('PUT /api/cart/[id] - Invalid quantity:', quantity);
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Initialize mock cart storage if it doesn't exist
    if (!global.mockCarts) {
      console.log('PUT /api/cart/[id] - Initializing global mock carts');
      global.mockCarts = {};
    }

    // Initialize user cart if it doesn't exist
    if (!global.mockCarts[session.user.id]) {
      console.log('PUT /api/cart/[id] - Initializing user cart for:', session.user.id);
      global.mockCarts[session.user.id] = [];
    }

    const userCart = global.mockCarts[session.user.id];
    console.log('PUT /api/cart/[id] - User cart contains:', userCart.length, 'items');
    console.log('PUT /api/cart/[id] - User cart items:', userCart.map(item => ({ id: item.id, variantId: item.variantId, quantity: item.quantity })));
    console.log('PUT /api/cart/[id] - Looking for cart item with ID:', cartItemId, 'type:', typeof cartItemId);
    
    const cartItemIndex = userCart.findIndex(item => {
      console.log('PUT /api/cart/[id] - Comparing:', { itemId: item.id, itemIdType: typeof item.id, requestedId: cartItemId, requestedIdType: typeof cartItemId, match: item.id === cartItemId });
      return item.id === cartItemId;
    });
    console.log('PUT /api/cart/[id] - Found cart item at index:', cartItemIndex);

    if (cartItemIndex === -1) {
      console.log('Cart item not found. Available items:', userCart.map(item => ({ id: item.id, variantId: item.variantId })));
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    const cartItem = userCart[cartItemIndex];
    const variant = mockVariants[cartItem.variantId];

    if (!variant) {
      return NextResponse.json(
        { error: 'Product variant not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (variant.totalStock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${variant.totalStock} items available` },
        { status: 400 }
      );
    }

    // Update the cart item
    userCart[cartItemIndex].quantity = quantity;
    userCart[cartItemIndex].updatedAt = new Date();

    console.log('Updated cart item successfully');

    // Return the updated cart item with variant information
    const updatedCartItem = {
      id: cartItem.id,
      userId: session.user.id,
      variantId: cartItem.variantId,
      quantity: quantity,
      createdAt: cartItem.createdAt,
      updatedAt: userCart[cartItemIndex].updatedAt,
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

// DELETE /api/cart/[id] - Remove item from cart
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cartItemId = params.id;

    // Initialize user cart if it doesn't exist
    if (!global.mockCarts[session.user.id]) {
      global.mockCarts[session.user.id] = [];
    }

    const userCart = global.mockCarts[session.user.id];
    const cartItemIndex = userCart.findIndex(item => item.id === cartItemId);

    if (cartItemIndex === -1) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Remove the item from cart
    userCart.splice(cartItemIndex, 1);

    return NextResponse.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
