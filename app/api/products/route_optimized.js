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
      status: true,
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

    // Execute optimized queries in parallel
    const [products, totalProducts, metadata] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        select: selectFields,
        orderBy: [
          { status: 'desc' }, // Active products first
          { createdAt: 'desc' }
        ]
      }),
      // Use count only when needed for pagination
      limit < 100 ? prisma.product.count({ where }) : Promise.resolve(null),
      // Include metadata only when requested
      includeMetadata ? getCachedMetadata() : Promise.resolve(null)
    ]);

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

    // Validate required fields
    if (!data.name || !data.categoryId || !data.brandId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, categoryId, brandId' },
        { status: 400 }
      );
    }

    // Create product with optimized includes
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        categoryId: data.categoryId,
        brandId: data.brandId,
        status: data.status || 'ACTIVE',
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
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: { select: { id: true, sku: true, price: true, compareAtPrice: true } }
      }
    });

    // Invalidate cache after mutation
    categoriesCache = null;
    brandsCache = null;
    cacheTimestamp = null;

    console.log('✅ Product created successfully:', product.name);

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully!'
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product: ' + error.message },
      { status: 500 }
    );
  }
}
