import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request) {
  try {
    console.log('🗑️ Clearing all products from MongoDB...');

    // Step 1: Delete all inventory records first
    const deletedInventory = await prisma.inventory.deleteMany();
    console.log(`🗑️ Deleted ${deletedInventory.count} inventory records`);

    // Step 2: Delete all cart items that reference product variants
    const deletedCartItems = await prisma.cartItem.deleteMany();
    console.log(`🗑️ Deleted ${deletedCartItems.count} cart items`);

    // Step 3: Delete all order items that reference product variants
    const deletedOrderItems = await prisma.orderItem.deleteMany();
    console.log(`🗑️ Deleted ${deletedOrderItems.count} order items`);

    // Step 4: Delete all product variants
    const deletedVariants = await prisma.productVariant.deleteMany();
    console.log(`🗑️ Deleted ${deletedVariants.count} product variants`);

    // Step 5: Finally delete all products
    const deletedProducts = await prisma.product.deleteMany();
    console.log(`🗑️ Deleted ${deletedProducts.count} products`);

    const totalDeleted = {
      products: deletedProducts.count,
      variants: deletedVariants.count,
      inventory: deletedInventory.count,
      cartItems: deletedCartItems.count,
      orderItems: deletedOrderItems.count
    };

    return NextResponse.json({
      success: true,
      data: totalDeleted,
      message: `Successfully cleared all products. Deleted ${deletedProducts.count} products, ${deletedVariants.count} variants, ${deletedInventory.count} inventory records, ${deletedCartItems.count} cart items, and ${deletedOrderItems.count} order items.`
    });

  } catch (error) {
    console.error('❌ Error clearing all products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear all products: ' + error.message },
      { status: 500 }
    );
  }
}
