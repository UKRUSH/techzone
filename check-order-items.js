const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrderItems() {
  try {
    // Check order items
    const orderWithItems = await prisma.order.findFirst({
      include: {
        orderItems: true
      }
    });

    console.log('Order:', orderWithItems?.confirmationNumber);
    console.log('Items count:', orderWithItems?.orderItems?.length);
    console.log('Items:', orderWithItems?.orderItems);

    // Check total orderItems in database
    const totalOrderItems = await prisma.orderItem.count();
    console.log('Total order items in database:', totalOrderItems);

    // Check first few order items
    const items = await prisma.orderItem.findMany({
      take: 5
    });
    console.log('Sample order items:', items);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrderItems();
