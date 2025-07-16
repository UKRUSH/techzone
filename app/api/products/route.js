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

    console.log('🔄 Loading products from database...');

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
          attributes: true
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

      console.log(`✅ Loaded ${products.length} products from database`);

      // Calculate estimated total for large datasets
      const estimatedTotal = totalProducts || (products.length === limit ? (page * limit) + 1 : page * limit);

      // Prepare response
      const response = {
        success: true,
        data: products,
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

      return NextResponse.json(response);

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
        message: 'MongoDB Atlas connection is currently unavailable. Please check your database configuration.',
        dataSource: 'none',
        troubleshooting: {
          steps: [
            'Check MongoDB Atlas cluster status at https://cloud.mongodb.com/',
            'Verify your cluster is not paused or suspended',
            'Check Network Access settings and IP whitelist',
            'Verify database user credentials and permissions',
            'Check if your internet connection allows MongoDB Atlas access'
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
