const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleOrdersForUI() {
  try {
    console.log('🎯 Adding sample orders to showcase UI enhancements...');

    // First, find a user to attach orders to
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      return;
    }

    console.log(`✅ Found user: ${user.email}`);

    // Add diverse orders to test different UI states
    const sampleOrders = [
      {
        confirmationNumber: 'TZ-2025-001',
        customerName: user.name || 'Tech Enthusiast',
        customerEmail: user.email,
        customerPhone: '+1-555-0123',
        shippingAddress: '123 Tech Street',
        shippingCity: 'Silicon Valley',
        shippingDistrict: 'Santa Clara',
        shippingPostalCode: '94000',
        shippingCountry: 'United States',
        paymentMethod: 'Credit Card',
        paymentDetails: { last4: '4532', type: 'Visa' },
        subtotal: 2399.99,
        tax: 200.00,
        shipping: 0.00,
        total: 2599.99,
        status: 'DELIVERED',
        userId: user.id
      },
      {
        confirmationNumber: 'TZ-2025-002',
        customerName: user.name || 'Tech Enthusiast',
        customerEmail: user.email,
        customerPhone: '+1-555-0124',
        shippingAddress: '456 Gamer Lane',
        shippingCity: 'Austin',
        shippingDistrict: 'Travis',
        shippingPostalCode: '78701',
        shippingCountry: 'United States',
        paymentMethod: 'PayPal',
        paymentDetails: { email: user.email },
        subtotal: 799.99,
        tax: 100.00,
        shipping: 0.00,
        total: 899.99,
        status: 'SHIPPED',
        userId: user.id
      },
      {
        confirmationNumber: 'TZ-2025-003',
        customerName: user.name || 'Tech Enthusiast',
        customerEmail: user.email,
        customerPhone: '+1-555-0125',
        shippingAddress: '789 Builder Avenue',
        shippingCity: 'Denver',
        shippingDistrict: 'Denver',
        shippingPostalCode: '80014',
        shippingCountry: 'United States',
        paymentMethod: 'Credit Card',
        paymentDetails: { last4: '8765', type: 'MasterCard' },
        subtotal: 1349.99,
        tax: 150.00,
        shipping: 0.00,
        total: 1499.99,
        status: 'PENDING',
        userId: user.id
      },
      {
        confirmationNumber: 'TZ-2025-004',
        customerName: user.name || 'Tech Enthusiast',
        customerEmail: user.email,
        customerPhone: '+1-555-0126',
        shippingAddress: '321 Power User Plaza',
        shippingCity: 'Seattle',
        shippingDistrict: 'King',
        shippingPostalCode: '98109',
        shippingCountry: 'United States',
        paymentMethod: 'Bank Transfer',
        paymentDetails: { bank: 'Tech Bank' },
        subtotal: 2999.99,
        tax: 300.00,
        shipping: 0.00,
        total: 3299.99,
        status: 'CONFIRMED',
        userId: user.id
      },
      {
        confirmationNumber: 'TZ-2025-005',
        customerName: user.name || 'Tech Enthusiast',
        customerEmail: user.email,
        customerPhone: '+1-555-0127',
        shippingAddress: '654 Accessory Street',
        shippingCity: 'Portland',
        shippingDistrict: 'Multnomah',
        shippingPostalCode: '97201',
        shippingCountry: 'United States',
        paymentMethod: 'Credit Card',
        paymentDetails: { last4: '1234', type: 'Visa' },
        subtotal: 179.99,
        tax: 20.00,
        shipping: 0.00,
        total: 199.99,
        status: 'CANCELLED',
        userId: user.id
      }
    ];

    for (const orderData of sampleOrders) {
      const existingOrder = await prisma.order.findFirst({
        where: { confirmationNumber: orderData.confirmationNumber }
      });

      if (!existingOrder) {
        await prisma.order.create({
          data: {
            ...orderData,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
          }
        });
        console.log(`✅ Created order: ${orderData.confirmationNumber} - ${orderData.status}`);
      } else {
        console.log(`⚠️  Order ${orderData.confirmationNumber} already exists`);
      }
    }

    console.log('\n🎉 Sample orders added successfully!');
    console.log('🌐 Visit http://localhost:3002/orders to see the enhanced UI');
    console.log('\n📊 Order Summary:');
    console.log('- 1 Delivered order (can reorder)');
    console.log('- 1 Shipped order (with tracking)');
    console.log('- 1 Processing order');
    console.log('- 1 Confirmed order');
    console.log('- 1 Cancelled order');
    console.log('\n🔍 Test Features:');
    console.log('- Search functionality');
    console.log('- Status filtering');
    console.log('- Responsive design');
    console.log('- Animation effects');
    console.log('- Enhanced proportions');

  } catch (error) {
    console.error('❌ Error adding sample orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleOrdersForUI();
