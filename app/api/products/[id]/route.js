import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            inventory: {
              include: {
                location: true
              }
            }
          }
        },
        images: {
          orderBy: { displayOrder: 'asc' }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating and total stock
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    const totalStock = product.variants.reduce((sum, variant) => {
      return sum + variant.inventory.reduce((variantSum, level) => {
        return variantSum + level.stock - level.reserved;
      }, 0);
    }, 0);

    const productWithStats = {
      ...product,
      averageRating,
      reviewCount: product.reviews.length,
      totalStock
    };

    return NextResponse.json(productWithStats);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { 
      name, 
      description, 
      categoryId, 
      brandId, 
      price,
      stock,
      sku,
      specifications,
      features,
      tags,
      variants,
      images
    } = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            inventory: true
          }
        },
        images: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const updateData = {
      name,
      description,
      categoryId,
      brandId,
      specifications: specifications || {},
      features: features || [],
      tags: tags || [],
      updatedAt: new Date()
    };

    // If price is provided, update the first variant
    if (price !== undefined && existingProduct.variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: existingProduct.variants[0].id },
        data: {
          price: parseFloat(price),
          ...(sku && { sku })
        }
      });
    }

    // If stock is provided, update the first inventory location
    if (stock !== undefined && existingProduct.variants.length > 0 && existingProduct.variants[0].inventory.length > 0) {
      await prisma.inventoryLevel.update({
        where: { id: existingProduct.variants[0].inventory[0].id },
        data: {
          stock: parseInt(stock)
        }
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            inventory: {
              include: {
                location: true
              }
            }
          }
        },
        images: {
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    // Calculate total stock
    const totalStock = product.variants.reduce((sum, variant) => {
      return sum + variant.inventory.reduce((variantSum, level) => {
        return variantSum + level.stock - level.reserved;
      }, 0);
    }, 0);

    const productWithStats = {
      ...product,
      totalStock
    };

    return NextResponse.json({
      success: true,
      data: productWithStats
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  console.log('DELETE /api/products/[id] called');
  console.log('Product ID:', params.id);
  
  try {
    // Temporarily disable auth check for debugging
    // const session = await getServerSession(authOptions);
    // console.log('Session:', session ? { user: session.user, role: session.user?.role } : 'No session');
    
    // if (!session || session.user.role !== 'ADMIN') {
    //   console.log('Unauthorized access attempt');
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const { id } = params;
    console.log('Attempting to delete product with ID:', id);

    // For now, just return success without actually deleting from database
    console.log('Returning mock delete success');
    return NextResponse.json({ 
      message: 'Product deleted successfully (mock)',
      productId: id 
    });

    // Commented out database operations for testing
    /*
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product (cascade will handle related records)
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
    */
  } catch (error) {
    console.error('Error deleting product:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      details: error
    });
    return NextResponse.json(
      { 
        error: 'Failed to delete product',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
