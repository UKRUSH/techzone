import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

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

// Fallback data loader
function loadFallbackData() {
  try {
    const productsPath = path.join(process.cwd(), 'temp-data', 'products.json');
    const categoriesPath = path.join(process.cwd(), 'temp-data', 'categories.json');
    const brandsPath = path.join(process.cwd(), 'temp-data', 'brands.json');
    
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
    
    return { products, categories, brands };
  } catch (error) {
    console.error('Error loading fallback data:', error);
    return { products: [], categories: [], brands: [] };
  }
}

// Database availability check
let isDatabaseAvailable = null;
let lastDbCheck = 0;
const DB_CHECK_INTERVAL = 30000; // 30 seconds

async function checkDatabaseAvailability() {
  const now = Date.now();
  if (isDatabaseAvailable !== null && (now - lastDbCheck) < DB_CHECK_INTERVAL) {
    return isDatabaseAvailable;
  }
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    isDatabaseAvailable = true;
    lastDbCheck = now;
    return true;
  } catch (error) {
    console.log('Database unavailable, using fallback data');
    isDatabaseAvailable = false;
    lastDbCheck = now;
    return false;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const limit = parseInt(searchParams.get('limit')) || 20; // Reduced default limit
    const page = parseInt(searchParams.get('page')) || 1;
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
      where.categoryId = category; // Use ID instead of nested query for better performance
    }

    if (brand) {
      where.brandId = brand; // Use ID instead of nested query for better performance
    }

    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          price: {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) })
          }
        }
      };
    }

    // Optimize the query with selective field loading
    const selectFields = {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true
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
          attributes: true
        },
        orderBy: {
          price: 'asc'
        },
        take: 3 // Limit variants per product for faster loading
      }
    };

    let products, totalProducts, metadata;

    try {
      // Check database availability before querying
      const dbAvailable = await checkDatabaseAvailability();
      
      if (dbAvailable) {
        // Execute optimized queries in parallel
        [products, totalProducts, metadata] = await Promise.all([
          prisma.product.findMany({
            where,
            skip,
            take: limit,
            select: selectFields,
            orderBy: [
              { createdAt: 'desc' }
            ]
          }),
          // Use count only when needed for pagination
          limit < 100 ? prisma.product.count({ where }) : Promise.resolve(null),
          // Include metadata only when requested
          includeMetadata ? getCachedMetadata() : Promise.resolve(null)
        ]);
      } else {
        // Use fallback data if database is unavailable
        console.log('Using fallback data for products');
        const fallbackData = loadFallbackData();
        products = fallbackData.products;
        totalProducts = products.length;
        metadata = includeMetadata ? { categories: fallbackData.categories, brands: fallbackData.brands } : null;
      }
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed. Please check MongoDB connection.',
          details: dbError.message 
        },
        { status: 503 }
      );
    }

    // Calculate estimated total for large datasets (performance optimization)
    const estimatedTotal = totalProducts || (products.length === limit ? (page * limit) + 1 : page * limit);

    const response = {
      success: true,
      data: products,
      pagination: {
        total: totalProducts || estimatedTotal,
        page,
        limit,
        totalPages: totalProducts ? Math.ceil(totalProducts / limit) : Math.ceil(estimatedTotal / limit),
        hasMore: products.length === limit,
        isEstimated: !totalProducts
      },
      message: `Found ${products.length} products`,
      timestamp: Date.now()
    };

    // Include metadata in response if requested
    if (metadata) {
      response.metadata = metadata;
    }

    console.log(`✅ Fetched ${products.length} products (page ${page}, limit ${limit})`);

    // Set cache headers for better performance
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': search || category || brand ? 'private, max-age=60' : 'public, max-age=300', // 5 min cache for filtered results, 1 min for search
        'ETag': `"${Date.now()}"` // Simple ETag for caching
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('📦 Creating new product with data:', data);

    // Validate required fields (accept either name-based or ID-based data)
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Handle both category/brand names and IDs
    let categoryId = data.categoryId;
    let brandId = data.brandId;
    
    // If we have category/brand names but no IDs, find or create them
    if (!categoryId && data.category) {
      const category = await prisma.category.upsert({
        where: { name: data.category },
        update: {},
        create: { 
          name: data.category,
          slug: data.category.toLowerCase().replace(/\s+/g, '-')
        }
      });
      categoryId = category.id;
    }
    
    if (!brandId && data.brand) {
      const brand = await prisma.brand.upsert({
        where: { name: data.brand },
        update: {},
        create: { 
          name: data.brand,
          slug: data.brand.toLowerCase().replace(/\s+/g, '-')
        }
      });
      brandId = brand.id;
    }

    if (!categoryId || !brandId) {
      return NextResponse.json(
        { success: false, error: 'Category and brand are required' },
        { status: 400 }
      );
    }

    // Create product in MongoDB
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        categoryId: categoryId,
        brandId: brandId,
        variants: {
          create: (data.variants || []).map(variant => ({
            sku: variant.sku,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice || null,
            attributes: variant.attributes || {}
          }))
        }
      },
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });

    console.log('✅ Product created successfully in MongoDB:');
    console.log(`   ID: ${product.id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   Category: ${product.category.name}`);
    console.log(`   Brand: ${product.brand.name}`);
    console.log(`   Variants: ${product.variants.length}`);

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully in MongoDB database!'
    });

  } catch (error) {
    console.error('❌ Error creating product in MongoDB:', error);
    
    // More detailed error handling
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Invalid category or brand ID provided' },
        { status: 400 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Product with this name or SKU already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    console.log('📝 Updating product in MongoDB:', { id, updateData });

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for update' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectID format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('❌ Invalid ObjectID format for update:', id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid product ID format',
          code: 'INVALID_ID_FORMAT'
        },
        { status: 400 }
      );
    }

    try {
      // Build the update data object
      const productUpdate = {
        name: updateData.name,
        description: updateData.description,
        updatedAt: new Date()
      };

      // Handle category connection/creation
      if (updateData.category) {
        productUpdate.category = {
          connectOrCreate: {
            where: { name: updateData.category },
            create: { name: updateData.category }
          }
        };
      }

      // Handle brand connection/creation
      if (updateData.brand) {
        productUpdate.brand = {
          connectOrCreate: {
            where: { name: updateData.brand },
            create: { name: updateData.brand }
          }
        };
      }

      // Handle variants update (price, stock, imageUrl)
      if (updateData.price !== undefined || updateData.stock !== undefined || updateData.imageUrl !== undefined) {
        const variantUpdateData = {};
        if (updateData.price !== undefined) {
          variantUpdateData.price = parseFloat(updateData.price) || 0;
        }
        if (updateData.stock !== undefined || updateData.imageUrl !== undefined) {
          const attributes = {};
          if (updateData.stock !== undefined) {
            attributes.stock = parseInt(updateData.stock) || 0;
          }
          if (updateData.imageUrl !== undefined) {
            attributes.imageUrl = updateData.imageUrl;
          }
          variantUpdateData.attributes = attributes;
        }

        productUpdate.variants = {
          updateMany: {
            where: { productId: id },
            data: variantUpdateData
          }
        };
      }

      // Try updating in MongoDB first
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: productUpdate,
        include: {
          category: true,
          brand: true,
          variants: true
        }
      });

      console.log('✅ Product updated successfully in MongoDB');
      return NextResponse.json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully in database'
      });

    } catch (dbError) {
      console.error('❌ MongoDB update failed:', dbError);
      console.error('❌ Error details:', dbError.message);
      
      // Return the specific error instead of trying fallback
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to update product: ${dbError.message}`,
          details: dbError.code || 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('🗑️ Deleting product from MongoDB:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for deletion' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectID format
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('❌ Invalid ObjectID format:', id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid product ID format',
          code: 'INVALID_ID_FORMAT'
        },
        { status: 400 }
      );
    }

    try {
      // First check if the product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: true
        }
      });

      if (!existingProduct) {
        console.log('❌ Product not found for deletion:', id);
        return NextResponse.json(
          { 
            success: false, 
            error: 'Product not found. It may have already been deleted.',
            code: 'PRODUCT_NOT_FOUND'
          },
          { status: 404 }
        );
      }

      console.log('🗑️ Found product to delete:', existingProduct.name);
      console.log('🗑️ Product has variants:', existingProduct.variants?.length || 0);

      // Delete variants first, then delete the product (cascade deletion)
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        console.log('🗑️ Deleting product variants first...');
        const deletedVariants = await prisma.productVariant.deleteMany({
          where: { productId: id }
        });
        console.log(`🗑️ Deleted ${deletedVariants.count} variants`);
      }
      
      console.log('🗑️ Deleting product...');
      const deletedProduct = await prisma.product.delete({
        where: { id },
        include: {
          category: true,
          brand: true
        }
      });

      console.log('✅ Product and variants deleted successfully from MongoDB');
      return NextResponse.json({
        success: true,
        data: deletedProduct,
        message: 'Product deleted successfully from database'
      });

    } catch (dbError) {
      console.error('❌ MongoDB deletion failed:', dbError);
      console.error('❌ Error details:', dbError.message);
      
      // Return the specific error instead of trying fallback
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to delete product: ${dbError.message}`,
          details: dbError.code || 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product: ' + error.message },
      { status: 500 }
    );
  }
}
