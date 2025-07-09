const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedOrders() {
  try {
    console.log('🛒 Seeding orders...');

    // Check if orders already exist
    const existingOrders = await prisma.order.count();
    if (existingOrders > 0) {
      console.log('✅ Orders already exist in database');
      return;
    }

    // Get users
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' }
    });

    const premiumUser = await prisma.user.findUnique({
      where: { email: 'jane@techzone.com' }
    });

    if (!testUser || !premiumUser) {
      console.log('❌ Users not found. Run seed-users.js first.');
      return;
    }

    // Get some products to add to orders
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        variants: true
      }
    });

    if (products.length === 0) {
      console.log('❌ No products found. Run setup-mongodb-data.js first.');
      return;
    }

    // Create orders for test user
    const order1 = await prisma.order.create({
      data: {
        userId: testUser.id,
        confirmationNumber: 'TZ001234',
        customerName: testUser.name,
        customerEmail: testUser.email,
        customerPhone: '+1-555-0123',
        status: 'DELIVERED',
        paymentMethod: 'CREDIT_CARD',
        paymentDetails: { last4: '4242', brand: 'visa' },
        subtotal: 1299.99,
        tax: 103.99,
        shipping: 15.00,
        total: 1418.98,
        shippingAddress: '123 Main Street',
        shippingAddress2: 'Apt 4B',
        shippingCity: 'New York',
        shippingDistrict: 'Manhattan',
        shippingPostalCode: '10001',
        shippingCountry: 'United States',
        orderItems: {
          create: [
            {
              productId: products[0].id,
              variantId: products[0].variants[0]?.id,
              quantity: 1,
              price: 1299.99,
              productName: products[0].name
            }
          ]
        },
        delivery: {
          create: {
            trackingNumber: 'TZ123456789',
            agentName: 'Mike Johnson',
            shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            deliveryNotes: 'Left at front door'
          }
        }
      }
    });

    const order2 = await prisma.order.create({
      data: {
        userId: testUser.id,
        confirmationNumber: 'TZ001235',
        customerName: testUser.name,
        customerEmail: testUser.email,
        customerPhone: '+1-555-0123',
        status: 'SHIPPED',
        paymentMethod: 'CREDIT_CARD',
        paymentDetails: { last4: '4242', brand: 'visa' },
        subtotal: 899.99,
        tax: 71.99,
        shipping: 0.00,
        total: 971.98,
        shippingAddress: '123 Main Street',
        shippingAddress2: 'Apt 4B',
        shippingCity: 'New York',
        shippingDistrict: 'Manhattan',
        shippingPostalCode: '10001',
        shippingCountry: 'United States',
        orderItems: {
          create: [
            {
              productId: products[1]?.id || products[0].id,
              variantId: products[1]?.variants[0]?.id || products[0].variants[0]?.id,
              quantity: 1,
              price: 899.99,
              productName: products[1]?.name || products[0].name
            }
          ]
        },
        delivery: {
          create: {
            trackingNumber: 'TZ123456790',
            agentName: 'Sarah Wilson',
            shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            deliveryNotes: 'In transit'
          }
        }
      }
    });

    // Create orders for premium user
    const order3 = await prisma.order.create({
      data: {
        userId: premiumUser.id,
        confirmationNumber: 'TZ001236',
        customerName: premiumUser.name,
        customerEmail: premiumUser.email,
        customerPhone: '+1-555-0199',
        status: 'DELIVERED',
        paymentMethod: 'CREDIT_CARD',
        paymentDetails: { last4: '8888', brand: 'mastercard' },
        subtotal: 2499.98,
        tax: 199.99,
        shipping: 0.00,
        total: 2699.97,
        shippingAddress: '456 Oak Avenue',
        shippingCity: 'Los Angeles',
        shippingDistrict: 'Beverly Hills',
        shippingPostalCode: '90210',
        shippingCountry: 'United States',
        orderItems: {
          create: [
            {
              productId: products[2]?.id || products[0].id,
              variantId: products[2]?.variants[0]?.id || products[0].variants[0]?.id,
              quantity: 1,
              price: 1299.99,
              productName: products[2]?.name || products[0].name
            },
            {
              productId: products[3]?.id || products[1]?.id || products[0].id,
              variantId: products[3]?.variants[0]?.id || products[1]?.variants[0]?.id || products[0].variants[0]?.id,
              quantity: 1,
              price: 1199.99,
              productName: products[3]?.name || products[1]?.name || products[0].name
            }
          ]
        },
        delivery: {
          create: {
            trackingNumber: 'TZ123456791',
            agentName: 'David Brown',
            shippedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            deliveryNotes: 'Delivered to customer'
          }
        }
      }
    });

    const order4 = await prisma.order.create({
      data: {
        userId: premiumUser.id,
        confirmationNumber: 'TZ001237',
        customerName: premiumUser.name,
        customerEmail: premiumUser.email,
        customerPhone: '+1-555-0199',
        status: 'CONFIRMED',
        paymentMethod: 'CREDIT_CARD',
        paymentDetails: { last4: '8888', brand: 'mastercard' },
        subtotal: 599.99,
        tax: 47.99,
        shipping: 15.00,
        total: 662.98,
        shippingAddress: '456 Oak Avenue',
        shippingCity: 'Los Angeles',
        shippingDistrict: 'Beverly Hills',
        shippingPostalCode: '90210',
        shippingCountry: 'United States',
        orderItems: {
          create: [
            {
              productId: products[4]?.id || products[0].id,
              variantId: products[4]?.variants[0]?.id || products[0].variants[0]?.id,
              quantity: 1,
              price: 599.99,
              productName: products[4]?.name || products[0].name
            }
          ]
        }
      }
    });

    console.log('✅ Created orders for users');
    console.log(`- Test User: ${order1.confirmationNumber}, ${order2.confirmationNumber}`);
    console.log(`- Premium User: ${order3.confirmationNumber}, ${order4.confirmationNumber}`);

    // Add some products to wishlists
    if (products.length >= 3) {
      await prisma.user.update({
        where: { id: testUser.id },
        data: {
          wishlistProductIds: [products[0].id, products[1].id]
        }
      });

      await prisma.user.update({
        where: { id: premiumUser.id },
        data: {
          wishlistProductIds: [products[2].id, products[3]?.id || products[0].id]
        }
      });

      console.log('✅ Added products to user wishlists');
    }

    console.log('\n🎉 Order seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedOrders()
    .catch(console.error)
    .finally(() => process.exit(0));
}

module.exports = { seedOrders };
