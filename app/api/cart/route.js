import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Mock cart storage (fallback when MongoDB is down)
if (!global.mockCarts) {
  global.mockCarts = {};
}

// Mock product variants for cart items (legacy fallback)
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
  }
};

// Enhanced fallback function to fetch real variant data
async function getVariantData(variantId) {
  try {
    // Try to fetch from database
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: {
            brand: true,
            category: true
          }
        }
      }
    });
    
    if (variant) {
      return variant;
    }
  } catch (error) {
    console.log('Could not fetch variant from database:', error.message);
  }
  
  // Fallback to mock data or create minimal variant
  return mockVariants[variantId] || {
    id: variantId,
    price: 0,
    product: { 
      name: 'Unknown Product', 
      category: { name: 'Unknown' }, 
      brand: { name: 'Unknown' },
      images: ['/placeholder-product.jpg']
    }
  };
}

export async function GET(request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    let cartItems = [];

    try {
      // Try database first
      if (session?.user?.id) {
        // Fetch cart for authenticated user from MongoDB
        cartItems = await prisma.cartItem.findMany({
          where: { userId: session.user.id },
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true
                  }
                },
                images: true
              }
            }
          }
        });
      } else if (sessionId) {
        // Fetch cart for guest user by session ID from MongoDB
        cartItems = await prisma.cartItem.findMany({
          where: { sessionId: sessionId },
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true
                  }
                },
                images: true
              }
            }
          }
        });
      }
    } catch (dbError) {
      console.log('Database unavailable, using enhanced fallback cart storage');
      // Use fallback mock cart with enhanced variant fetching
      const cartKey = session?.user?.id || sessionId || 'guest';
      const mockCart = global.mockCarts[cartKey] || [];
      
      // Enhanced fallback: try to fetch real variant data for each item
      cartItems = await Promise.all(mockCart.map(async (item) => {
        const variant = await getVariantData(item.variantId);
        return {
          id: item.id,
          quantity: item.quantity,
          variant: variant
        };
      }));
    }

    console.log(`✅ Fetched ${cartItems.length} cart items from MongoDB`);

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
    const session = await getServerSession();
    const data = await request.json();
    const { variantId, quantity, sessionId } = data;

    if (!variantId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: variantId, quantity' },
        { status: 400 }
      );
    }

    let cartItem;

    try {
      // Try database first
      // Verify variant exists
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: true
        }
      });

      if (!variant) {
        return NextResponse.json(
          { success: false, error: 'Product variant not found' },
          { status: 404 }
        );
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          variantId: variantId,
          ...(session?.user?.id ? { userId: session.user.id } : { sessionId: sessionId })
        }
      });

      if (existingItem) {
        // Update quantity
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true
                  }
                }
              }
            }
          }
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            variantId,
            quantity,
            userId: session?.user?.id,
            sessionId: session?.user?.id ? undefined : sessionId
          },
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    brand: true,
                    category: true
                  }
                }
              }
            }
          }
        });
      }

      console.log('✅ Cart item added/updated successfully in MongoDB');
      
    } catch (dbError) {
      console.log('Database unavailable, using enhanced fallback cart storage');
      // Use fallback mock cart with enhanced variant fetching
      const cartKey = session?.user?.id || sessionId || 'guest';
      
      if (!global.mockCarts[cartKey]) {
        global.mockCarts[cartKey] = [];
      }

      const existingItemIndex = global.mockCarts[cartKey].findIndex(item => item.variantId === variantId);
      
      if (existingItemIndex !== -1) {
        // Update existing item
        global.mockCarts[cartKey][existingItemIndex].quantity += quantity;
        const variant = await getVariantData(variantId);
        cartItem = {
          id: global.mockCarts[cartKey][existingItemIndex].id,
          quantity: global.mockCarts[cartKey][existingItemIndex].quantity,
          variant: variant
        };
      } else {
        // Create new item
        const newItem = {
          id: Date.now().toString(),
          variantId,
          quantity
        };
        global.mockCarts[cartKey].push(newItem);
        
        const variant = await getVariantData(variantId);
        cartItem = {
          id: newItem.id,
          quantity: newItem.quantity,
          variant: variant
        };
      }

      console.log('✅ Cart item added/updated successfully in enhanced fallback storage');
    }

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession();
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
      // Try database first
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await prisma.cartItem.delete({
          where: { id: itemId }
        });

        console.log('✅ Cart item removed from MongoDB');

        return NextResponse.json({
          success: true,
          message: 'Item removed from cart'
        });
      }

      // Update cart item quantity
      cartItem = await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: quantity },
        include: {
          variant: {
            include: {
              product: {
                include: {
                  brand: true,
                  category: true
                }
              },
              images: true
            }
          }
        }
      });

      console.log('✅ Cart item quantity updated in MongoDB');
      
    } catch (dbError) {
      console.log('Database unavailable, using fallback cart storage');
      // Use fallback mock cart
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

      if (quantity <= 0) {
        // Remove item
        global.mockCarts[cartKey].splice(itemIndex, 1);
        return NextResponse.json({
          success: true,
          message: 'Item removed from cart'
        });
      }

      // Update quantity
      global.mockCarts[cartKey][itemIndex].quantity = quantity;
      const item = global.mockCarts[cartKey][itemIndex];
      
      cartItem = {
        id: item.id,
        quantity: item.quantity,
        variant: mockVariants[item.variantId] || {
          id: item.variantId,
          price: 0,
          product: { name: 'Unknown Product', category: { name: 'Unknown' }, brand: { name: 'Unknown' } }
        }
      };

      console.log('✅ Cart item quantity updated in fallback storage');
    }

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Cart item updated successfully'
    });

  } catch (error) {
    console.error('Error updating cart item:', error);
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
        if (session?.user?.id) {
          // Clear all items for authenticated user
          await prisma.cartItem.deleteMany({
            where: { userId: session.user.id }
          });
        } else if (sessionId) {
          // Clear all items for guest user
          await prisma.cartItem.deleteMany({
            where: { sessionId: sessionId }
          });
        }

        console.log('✅ All cart items cleared from MongoDB');
        
      } catch (dbError) {
        console.log('Database unavailable, using fallback cart storage');
        // Use fallback mock cart
        const cartKey = session?.user?.id || sessionId || 'guest';
        global.mockCarts[cartKey] = [];
        console.log('✅ All cart items cleared from fallback storage');
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
      // Delete specific cart item
      await prisma.cartItem.delete({
        where: { id: itemId }
      });

      console.log('✅ Cart item deleted from MongoDB');
      
    } catch (dbError) {
      console.log('Database unavailable, using fallback cart storage');
      // Use fallback mock cart
      const session = await getServerSession();
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
      console.log('✅ Cart item deleted from fallback storage');
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
