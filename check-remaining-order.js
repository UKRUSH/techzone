const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRemainingOrder() {
  try {
    const nullOrder = await prisma.order.findFirst({
      where: { userId: null },
      select: {
        id: true,
        confirmationNumber: true,
        customerEmail: true,
        customerName: true,
        total: true,
        createdAt: true
      }
    });
    
    if (nullOrder) {
      console.log('Remaining order with null userId:');
      console.log(`- Order: ${nullOrder.confirmationNumber}`);
      console.log(`- Customer: ${nullOrder.customerName}`);
      console.log(`- Email: ${nullOrder.customerEmail}`);
      console.log(`- Total: $${nullOrder.total}`);
      console.log('This is likely a genuine guest order.');
    } else {
      console.log('No orders with null userId found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRemainingOrder();
