// Stock management utilities for cart operations
import { prisma } from './prisma.js';

/**
 * Reserve stock for a cart item
 * @param {string} variantId - Product variant ID
 * @param {number} quantity - Quantity to reserve
 * @returns {Promise<{success: boolean, message?: string, availableStock?: number}>}
 */
export async function reserveStock(variantId, quantity) {
  try {
    console.log(`📦 Attempting to reserve ${quantity} units for variant ${variantId}`);
    
    // Get current inventory levels for this variant
    const inventoryLevels = await prisma.inventory.findMany({
      where: { variantId },
      orderBy: { stock: 'desc' } // Start with locations that have most stock
    });

    if (inventoryLevels.length === 0) {
      return { success: false, message: 'No inventory found for this product' };
    }

    // Calculate total available stock
    const totalAvailable = inventoryLevels.reduce((total, inv) => {
      return total + (inv.stock - inv.reserved);
    }, 0);

    console.log(`📦 Total available stock: ${totalAvailable}, requested: ${quantity}`);

    if (totalAvailable < quantity) {
      return { 
        success: false, 
        message: `Insufficient stock. Only ${totalAvailable} units available.`,
        availableStock: totalAvailable
      };
    }

    // Reserve stock across multiple locations if needed
    let remainingToReserve = quantity;
    const reservationUpdates = [];

    for (const inventory of inventoryLevels) {
      if (remainingToReserve <= 0) break;

      const availableAtLocation = inventory.stock - inventory.reserved;
      if (availableAtLocation <= 0) continue;

      const reserveAtThisLocation = Math.min(remainingToReserve, availableAtLocation);
      
      reservationUpdates.push({
        id: inventory.id,
        newReserved: inventory.reserved + reserveAtThisLocation
      });

      remainingToReserve -= reserveAtThisLocation;
      console.log(`📦 Reserving ${reserveAtThisLocation} units at location ${inventory.locationId}`);
    }

    // Apply all reservations in a transaction
    await prisma.$transaction(
      reservationUpdates.map(update => 
        prisma.inventory.update({
          where: { id: update.id },
          data: { reserved: update.newReserved }
        })
      )
    );

    console.log(`✅ Successfully reserved ${quantity} units for variant ${variantId}`);
    return { success: true, message: `Reserved ${quantity} units` };

  } catch (error) {
    console.error('❌ Error reserving stock:', error);
    return { success: false, message: 'Failed to reserve stock' };
  }
}

/**
 * Update stock reservation for a cart item
 * @param {string} variantId - Product variant ID
 * @param {number} oldQuantity - Previous quantity in cart
 * @param {number} newQuantity - New quantity in cart
 * @returns {Promise<{success: boolean, message?: string, availableStock?: number}>}
 */
export async function updateStockReservation(variantId, oldQuantity, newQuantity) {
  try {
    console.log(`📦 Updating stock reservation for variant ${variantId}: ${oldQuantity} → ${newQuantity}`);
    
    const quantityDiff = newQuantity - oldQuantity;
    
    if (quantityDiff === 0) {
      return { success: true, message: 'No change in quantity' };
    }
    
    if (quantityDiff > 0) {
      // Need to reserve more stock
      return await reserveStock(variantId, quantityDiff);
    } else {
      // Need to release some stock
      return await releaseStock(variantId, Math.abs(quantityDiff));
    }

  } catch (error) {
    console.error('❌ Error updating stock reservation:', error);
    return { success: false, message: 'Failed to update stock reservation' };
  }
}

/**
 * Release stock reservation for a cart item
 * @param {string} variantId - Product variant ID
 * @param {number} quantity - Quantity to release
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function releaseStock(variantId, quantity) {
  try {
    console.log(`📦 Releasing ${quantity} units for variant ${variantId}`);
    
    // Get current inventory levels for this variant
    const inventoryLevels = await prisma.inventory.findMany({
      where: { 
        variantId,
        reserved: { gt: 0 } // Only locations with reserved stock
      },
      orderBy: { reserved: 'desc' } // Start with locations that have most reserved
    });

    if (inventoryLevels.length === 0) {
      console.log(`⚠️ No reserved stock found for variant ${variantId}`);
      return { success: true, message: 'No reserved stock to release' };
    }

    // Release stock across multiple locations
    let remainingToRelease = quantity;
    const releaseUpdates = [];

    for (const inventory of inventoryLevels) {
      if (remainingToRelease <= 0) break;

      const releaseAtThisLocation = Math.min(remainingToRelease, inventory.reserved);
      
      releaseUpdates.push({
        id: inventory.id,
        newReserved: inventory.reserved - releaseAtThisLocation
      });

      remainingToRelease -= releaseAtThisLocation;
      console.log(`📦 Releasing ${releaseAtThisLocation} units at location ${inventory.locationId}`);
    }

    // Apply all releases in a transaction
    await prisma.$transaction(
      releaseUpdates.map(update => 
        prisma.inventory.update({
          where: { id: update.id },
          data: { reserved: update.newReserved }
        })
      )
    );

    console.log(`✅ Successfully released ${quantity - remainingToRelease} units for variant ${variantId}`);
    return { success: true, message: `Released ${quantity - remainingToRelease} units` };

  } catch (error) {
    console.error('❌ Error releasing stock:', error);
    return { success: false, message: 'Failed to release stock' };
  }
}

/**
 * Get available stock for a variant
 * @param {string} variantId - Product variant ID
 * @returns {Promise<number>} Available stock quantity
 */
export async function getAvailableStock(variantId) {
  try {
    const inventoryLevels = await prisma.inventory.findMany({
      where: { variantId }
    });

    const totalAvailable = inventoryLevels.reduce((total, inv) => {
      return total + (inv.stock - inv.reserved);
    }, 0);

    return Math.max(0, totalAvailable);
  } catch (error) {
    console.error('❌ Error getting available stock:', error);
    return 0;
  }
}

/**
 * Release all stock reservations for a user's cart (for cleanup)
 * @param {string} userId - User ID (optional)
 * @param {string} sessionId - Session ID (optional)
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export async function releaseAllCartReservations(userId = null, sessionId = null) {
  try {
    console.log(`🧹 Releasing all cart reservations for ${userId ? `user ${userId}` : `session ${sessionId}`}`);
    
    // Get all cart items for this user/session
    const cartItems = await prisma.cartItem.findMany({
      where: userId ? { userId } : { sessionId },
      include: { variant: true }
    });

    if (cartItems.length === 0) {
      return { success: true, message: 'No cart items to release' };
    }

    // Release stock for each item
    const releasePromises = cartItems.map(item => 
      releaseStock(item.variantId, item.quantity)
    );

    await Promise.all(releasePromises);

    console.log(`✅ Released reservations for ${cartItems.length} cart items`);
    return { success: true, message: `Released reservations for ${cartItems.length} items` };

  } catch (error) {
    console.error('❌ Error releasing all cart reservations:', error);
    return { success: false, message: 'Failed to release cart reservations' };
  }
}
