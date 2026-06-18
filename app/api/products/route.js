import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache for static data (categories, brands)
let categoriesCache = null;
let brandsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached categories and brands
async function getCachedMetadata() {
  const now = Date.now();
  
  if (!categoriesCache || !brandsCache || !cacheTimestamp || (now - cacheTimestamp) > CACHE_DURATION) {
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true, _count: { select: { products: true } } },
        where: { products: { some: {} } } // Only categories with products
      }),
      prisma.brand.findMany({
        select: { id: true, name: true, _count: { select: { products: true } } },
        where: { products: { some: {} } } // Only brands with products
      })
    ]);
    
    categoriesCache = categories;
    brandsCache = brands;
    cacheTimestamp = now;
  }
  
  return { categories: categoriesCache, brands: brandsCache };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const includeMetadata = searchParams.get('includeMetadata') === 'true';
    const skip = (page - 1) * limit;

    // Build optimized where clause
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (brand) {
      where.brandId = brand;
    }

    // Optimize the query with selective field loading
    const selectFields = {
      id: true,
      name: true,
      description: true,
      images: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      },
      brand: {
        select: {
          id: true,
          name: true
        }
      },
      variants: {
        select: {
          id: true,
          sku: true,
          price: true,
          compareAtPrice: true,
          attributes: true,
          inventoryLevels: {
            select: {
              stock: true,
              reserved: true
            }
          }
        },
        take: 3 // Limit variants per product for faster loading
      }
    };

    try {
      // Execute optimized queries in parallel
      const [products, totalProducts, metadata] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          select: selectFields,
          orderBy: [
            { createdAt: 'desc' }
          ]
        }),
        prisma.product.count({ where }),
        includeMetadata ? getCachedMetadata() : Promise.resolve(null)
      ]);

      // Calculate real-time stock for each product
      const productsWithStock = products.map(product => {
        // Calculate total available stock across all variants
        const totalStock = product.variants.reduce((total, variant) => {
          const variantStock = variant.inventoryLevels.reduce((vTotal, inventory) => {
            return vTotal + (inventory.stock - inventory.reserved);
          }, 0);
          return total + Math.max(0, variantStock);
        }, 0);

        // Add stock information to product
        return {
          ...product,
          totalStock,
          // Also add primary variant info for easier access
          price: product.variants[0]?.price || 0,
          compareAtPrice: product.variants[0]?.compareAtPrice || null,
          // Remove inventory levels from variants to keep response clean
          variants: product.variants.map(variant => ({
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            attributes: variant.attributes
          }))
        };
      });

      // Calculate estimated total for large datasets
      const estimatedTotal = totalProducts || (productsWithStock.length === limit ? (page * limit) + 1 : page * limit);

      // Prepare response
      const response = {
        success: true,
        data: productsWithStock,
        pagination: {
          page,
          limit,
          total: estimatedTotal,
          totalPages: Math.ceil(estimatedTotal / limit)
        },
        dataSource: 'database'
      };

      if (includeMetadata && metadata) {
        response.metadata = metadata;
      }

      const jsonResponse = NextResponse.json(response);
      jsonResponse.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
      return jsonResponse;

    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      
      // Return empty data with database error message
      return NextResponse.json({
        success: false,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        error: 'Database connection failed',
        message: 'Database connection unavailable. Please check your Neon PostgreSQL configuration.',
        dataSource: 'none',
        troubleshooting: {
          steps: [
            'Check your Neon dashboard at https://console.neon.tech/',
            'Verify the DATABASE_URL in your .env.local is correct',
            'Ensure the Neon project is active and not suspended',
            'Check that SSL mode is set to require in the connection string'
          ]
        }
      }, { status: 503 });
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        data: [],
        error: 'Database connection failed',
        details: error.message
      },
      { status: 503 }
    );
  }
}

// POST handler - Create a new product
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('📝 API POST: Creating product:', JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.name || !data.price) {
      console.log('❌ API POST: Missing required fields');
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, price'
      }, { status: 400 });
    }

    // Handle category - convert name to ID if needed
    let categoryId = data.categoryId;
    if (data.category && !categoryId) {
      console.log(`🔍 API POST: Looking for category: ${data.category}`);
      const category = await prisma.category.findFirst({
        where: { name: data.category }
      });
      if (!category) {
        console.log(`❌ API POST: Category '${data.category}' not found`);
        return NextResponse.json({
          success: false,
          error: `Category '${data.category}' not found`
        }, { status: 400 });
      }
      categoryId = category.id;
      console.log(`✅ API POST: Found category ID: ${categoryId}`);
    }

    // Handle brand - convert name to ID if needed
    let brandId = data.brandId;
    if (data.brand && !brandId) {
      console.log(`🔍 API POST: Looking for brand: ${data.brand}`);
      const brand = await prisma.brand.findFirst({
        where: { name: data.brand }
      });
      if (!brand) {
        console.log(`❌ API POST: Brand '${data.brand}' not found`);
        return NextResponse.json({
          success: false,
          error: `Brand '${data.brand}' not found`
        }, { status: 400 });
      }
      brandId = brand.id;
      console.log(`✅ API POST: Found brand ID: ${brandId}`);
    }

    if (!categoryId || !brandId) {
      console.log(`❌ API POST: Missing IDs - Category: ${categoryId}, Brand: ${brandId}`);
      return NextResponse.json({
        success: false,
        error: 'Category and brand are required'
      }, { status: 400 });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        images: data.imageUrl ? [data.imageUrl] : [],
        categoryId: categoryId,
        brandId: brandId,
        isActive: data.isActive !== false
      },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } }
      }
    });

    console.log('✅ Product created:', product.id, product.name);

    // Create default variant
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: data.variants?.[0]?.sku || `${product.name.replace(/\s+/g, '-').toUpperCase()}-001`,
        price: parseFloat(data.price) || parseFloat(data.variants?.[0]?.price) || 0,
        compareAtPrice: data.compareAtPrice || null,
        attributes: data.variants?.[0]?.attributes || {}
      }
    });

    console.log('✅ Product variant created:', variant.id);

    // Create inventory level if stock is provided
    const stockAmount = parseInt(data.stock) || parseInt(data.variants?.[0]?.attributes?.stock) || 0;
    if (stockAmount > 0) {
      // Get or create default location
      let defaultLocation = await prisma.location.findFirst({
        where: { name: 'Main Warehouse' }
      });

      if (!defaultLocation) {
        defaultLocation = await prisma.location.create({
          data: {
            name: 'Main Warehouse',
            address: 'Default location'
          }
        });
        console.log('✅ Created default location');
      }

      const inventory = await prisma.inventory.create({
        data: {
          variantId: variant.id,
          locationId: defaultLocation.id,
          stock: stockAmount,
          reserved: 0,
          incoming: 0
        }
      });

      console.log('✅ Inventory created with stock:', stockAmount);
    }

    // Get the complete product with all relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          include: {
            inventoryLevels: {
              select: {
                id: true,
                stock: true,
                reserved: true,
                locationId: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: completeProduct
    });

  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      details: error.message
    }, { status: 500 });
  }
}

// PUT handler - Update an existing product  
export async function PUT(request) {
  try {
    // For now, skip auth check to focus on the main issue
    // TODO: Add authentication check for production
    
    const data = await request.json();
    console.log('� API PUT: Received data:', JSON.stringify(data, null, 2));
    console.log('🔍 API PUT: Request URL:', request.url);
    console.log('🔍 API PUT: Request headers:', Object.fromEntries(request.headers.entries()));

    // Validate required fields
    if (!data.id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    // Check if product exists with variants
    const existingProduct = await prisma.product.findUnique({
      where: { id: data.id },
      include: {
        variants: true,
        category: true,
        brand: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Update the product
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || '';
    
    // Handle category - convert name to ID if needed
    if (data.category !== undefined) {
      if (data.category && data.category !== '') {
        const category = await prisma.category.findFirst({
          where: { name: data.category }
        });
        if (category) {
          updateData.categoryId = category.id;
        } else {
          return NextResponse.json({
            success: false,
            error: `Category '${data.category}' not found`
          }, { status: 400 });
        }
      }
    }
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    
    // Handle brand - convert name to ID if needed
    if (data.brand !== undefined) {
      if (data.brand && data.brand !== '') {
        const brand = await prisma.brand.findFirst({
          where: { name: data.brand }
        });
        if (brand) {
          updateData.brandId = brand.id;
        } else {
          return NextResponse.json({
            success: false,
            error: `Brand '${data.brand}' not found`
          }, { status: 400 });
        }
      }
    }
    if (data.brandId !== undefined) updateData.brandId = data.brandId;

    // Handle image URL — store in product.images[]
    if (data.imageUrl !== undefined) {
      const clean = (existingProduct.images || []).filter(
        img => !img.includes('placehold.co') && !img.includes('via.placeholder.com')
      );
      updateData.images = data.imageUrl
        ? [data.imageUrl, ...clean.filter(img => img !== data.imageUrl)]
        : clean;
    }

    // Update the main product
    const updatedProduct = await prisma.product.update({
      where: { id: data.id },
      data: updateData
    });

    // Handle variant price update (update the first variant's price)
    if (data.price !== undefined && existingProduct.variants.length > 0) {
      const firstVariant = existingProduct.variants[0];
      await prisma.productVariant.update({
        where: { id: firstVariant.id },
        data: { price: parseFloat(data.price) }
      });
    }

    // Handle stock update (update the first variant's inventory)
    if (data.stock !== undefined && existingProduct.variants.length > 0) {
      const firstVariant = existingProduct.variants[0];
      console.log('📦 Updating stock for variant:', firstVariant.id, 'New stock:', data.stock);
      
      // Check if inventory level exists for this variant
      const existingInventory = await prisma.inventory.findFirst({
        where: { variantId: firstVariant.id }
      });

      if (existingInventory) {
        // Update existing inventory
        await prisma.inventory.update({
          where: { id: existingInventory.id },
          data: { 
            stock: parseInt(data.stock) || 0
          }
        });
        console.log('✅ Updated existing inventory level');
      } else {
        // Create new inventory level - need to get a default location first
        let defaultLocation = await prisma.location.findFirst({
          where: { name: 'Main Warehouse' }
        });

        if (!defaultLocation) {
          // Create default location if it doesn't exist
          defaultLocation = await prisma.location.create({
            data: {
              name: 'Main Warehouse',
              address: 'Default location'
            }
          });
          console.log('✅ Created default location');
        }

        await prisma.inventory.create({
          data: {
            variantId: firstVariant.id,
            locationId: defaultLocation.id,
            stock: parseInt(data.stock) || 0,
            reserved: 0,
            incoming: 0
          }
        });
        console.log('✅ Created new inventory level');
      }
    }

    // Get the updated product with all relations
    const product = await prisma.product.findUnique({
      where: { id: data.id },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          include: {
            inventoryLevels: {
              select: { id: true, stock: true, reserved: true, locationId: true }
            }
          }
        }
      }
    });
    // Attach computed totalStock for convenience
    const totalStock = product.variants.reduce((sum, v) =>
      sum + v.inventoryLevels.reduce((s, l) => s + Math.max(0, l.stock - l.reserved), 0), 0
    );
    Object.assign(product, { totalStock, images: product.images || [] });

    console.log('✅ Product updated with inventory:', {
      id: product.id,
      name: product.name,
      variantCount: product.variants.length,
      firstVariantStock: product.variants[0]?.inventoryLevels[0]?.stock || 0
    });

    const response = NextResponse.json({
      success: true,
      data: product
    });

    // Add cache control headers to prevent caching issues
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE handler - Delete a product
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    console.log('🗑️ Deleting product with ID:', productId);

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true }
    });

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        code: 'PRODUCT_NOT_FOUND'
      }, { status: 404 });
    }

    // Delete the product (this will cascade to related records)
    await prisma.product.delete({
      where: { id: productId }
    });

    console.log('✅ Product deleted:', existingProduct);

    return NextResponse.json({
      success: true,
      data: existingProduct,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    
    // Handle foreign key constraint errors
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete product: it has related records (orders, cart items, etc.)',
        details: error.message
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete product',
      details: error.message
    }, { status: 500 });
  }
}
