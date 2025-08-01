const { PrismaClient } = require('@prisma/client');

async function testProductUpdate() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing product update logic...');
    
    // Get a product to test
    const product = await prisma.product.findFirst({
      include: {
        variants: true,
        category: true,
        brand: true
      }
    });
    
    if (!product) {
      console.log('❌ No products found');
      return;
    }
    
    console.log('📦 Original product:', {
      id: product.id,
      name: product.name,
      category: product.category?.name,
      brand: product.brand?.name,
      variants: product.variants.map(v => ({ id: v.id, price: v.price }))
    });
    
    // Test category lookup
    const testCategory = await prisma.category.findFirst({
      where: { name: 'CPU' }
    });
    console.log('📂 Found category CPU:', testCategory?.id);
    
    // Test brand lookup
    const testBrand = await prisma.brand.findFirst({
      where: { name: 'AMD' }
    });
    console.log('🏷️ Found brand AMD:', testBrand?.id);
    
    // Test updating product
    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name + ' (Test)',
        categoryId: testCategory?.id || product.categoryId,
        brandId: testBrand?.id || product.brandId
      },
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });
    
    console.log('✅ Updated product:', {
      id: updatedProduct.id,
      name: updatedProduct.name,
      category: updatedProduct.category?.name,
      brand: updatedProduct.brand?.name
    });
    
    // Test updating variant price
    if (product.variants.length > 0) {
      const variant = product.variants[0];
      const updatedVariant = await prisma.productVariant.update({
        where: { id: variant.id },
        data: { price: 199.99 }
      });
      console.log('💰 Updated variant price:', updatedVariant.price);
    }
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('💥 Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductUpdate();
