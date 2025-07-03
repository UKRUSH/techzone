import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma, testDatabaseConnection } from "@/lib/prisma";

// Mock products data for fast loading
const mockProducts = [
  {
    id: "1",
    name: "Intel Core i7-13700K",
    slug: "intel-core-i7-13700k",
    description: "High-performance processor for gaming and productivity",
    price: 409.99,
    originalPrice: 449.99,
    image: "/api/placeholder/400/400",
    images: [{ url: "/api/placeholder/400/400" }],
    category: { id: "cpu", name: "CPU" },
    brand: { id: "intel", name: "Intel" },
    inStock: true,
    status: "In Stock",
    rating: 4.8,
    reviews: 256,
    totalStock: 50,
    variants: [
      {
        id: "1",
        price: 409.99,
        compareAtPrice: 449.99,
        attributes: {},
        totalStock: 50
      }
    ]
  },
  {
    id: "2", 
    name: "NVIDIA GeForce RTX 4070",
    slug: "nvidia-geforce-rtx-4070",
    description: "Next-gen graphics card for 1440p gaming",
    price: 599.99,
    originalPrice: 649.99,
    image: "/api/placeholder/400/400",
    images: [{ url: "/api/placeholder/400/400" }],
    category: { id: "gpu", name: "Graphics Cards" },
    brand: { id: "nvidia", name: "NVIDIA" },
    inStock: true,
    status: "Featured",
    rating: 4.7,
    reviews: 189,
    totalStock: 25,
    variants: [
      {
        id: "2",
        price: 599.99,
        compareAtPrice: 649.99,
        attributes: {},
        totalStock: 25
      }
    ]
  },
  {
    id: "3",
    name: "Corsair Vengeance RGB Pro 32GB",
    slug: "corsair-vengeance-rgb-pro-32gb",
    description: "High-speed DDR4 RAM with RGB lighting",
    price: 129.99,
    originalPrice: 159.99,
    image: "/api/placeholder/400/400",
    images: [{ url: "/api/placeholder/400/400" }],
    category: { id: "ram", name: "Memory" },
    brand: { id: "corsair", name: "Corsair" },
    inStock: true,
    status: "In Stock",
    rating: 4.6,
    reviews: 432,
    totalStock: 100,
    variants: [
      {
        id: "3",
        price: 129.99,
        compareAtPrice: 159.99,
        attributes: {},
        totalStock: 100
      }
    ]
  },
  {
    id: "4",
    name: "Samsung 980 PRO 1TB SSD",
    slug: "samsung-980-pro-1tb-ssd",
    description: "High-speed NVMe SSD for gaming and professional use",
    price: 89.99,
    originalPrice: 119.99,
    image: "/api/placeholder/400/400",
    images: [{ url: "/api/placeholder/400/400" }],
    category: { id: "storage", name: "Storage" },
    brand: { id: "samsung", name: "Samsung" },
    inStock: true,
    status: "Low Stock",
    rating: 4.9,
    reviews: 672,
    totalStock: 75,
    variants: [
      {
        id: "4",
        price: 89.99,
        compareAtPrice: 119.99,
        attributes: {},
        totalStock: 75
      }
    ]
  },
  {
    id: "5",
    name: "ASUS ROG Strix Z690-E",
    slug: "asus-rog-strix-z690-e",
    description: "Premium motherboard with Wi-Fi 6E and RGB",
    price: 329.99,
    originalPrice: 379.99,
    image: "/api/placeholder/400/400",
    images: [{ url: "/api/placeholder/400/400" }],
    category: { id: "motherboard", name: "Motherboards" },
    brand: { id: "asus", name: "ASUS" },
    inStock: true,
    status: "In Stock",
    rating: 4.7,
    reviews: 198,
    totalStock: 30,
    variants: [
      {
        id: "5",
        price: 329.99,
        compareAtPrice: 379.99,
        attributes: {},
        totalStock: 30
      }
    ]
  },
  {
    id: "6",
    name: "Corsair RM850x 850W PSU",
    slug: "corsair-rm850x-850w-psu",
    description: "Fully modular 80+ Gold certified power supply",
    price: 129.99,
    originalPrice: 149.99,
    image: "/api/placeholder/400/400",
    images: [{ url: "/api/placeholder/400/400" }],
    category: { id: "psu", name: "Power Supplies" },
    brand: { id: "corsair", name: "Corsair" },
    inStock: true,
    status: "In Stock",
    rating: 4.8,
    reviews: 345,
    totalStock: 40,
    variants: [
      {
        id: "6",
        price: 129.99,
        compareAtPrice: 149.99,
        attributes: {},
        totalStock: 40
      }
    ]
  }
];

export async function GET(request) {
  // First check if database is available with fast timeout
  const isDatabaseAvailable = await testDatabaseConnection();
  
  if (!isDatabaseAvailable) {
    // Return mock data immediately if database is unavailable
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    const paginatedProducts = mockProducts.slice(skip, skip + limit);
    
    return NextResponse.json({
      products: paginatedProducts,
      total: mockProducts.length,
      page,
      limit,
      totalPages: Math.ceil(mockProducts.length / limit)
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where = {};
    
    if (category) {
      where.category = {
        name: {
          equals: category,
          mode: 'insensitive'
        }
      };
    }
    
    if (brand) {
      where.brand = {
        name: {
          equals: brand,
          mode: 'insensitive'
        }
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            inventoryLevels: {
              include: {
                location: true
              }
            }
          }
        },
        images: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return mock data when database query fails
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    const paginatedProducts = mockProducts.slice(skip, skip + limit);
    
    return NextResponse.json({
      products: paginatedProducts,
      total: mockProducts.length,
      page,
      limit,
      totalPages: Math.ceil(mockProducts.length / limit)
    });
  }
}

export async function POST(request) {
  console.log('POST /api/products called');
  
  try {
    const data = await request.json();
    console.log('Received data:', data);

    // Validate required fields
    if (!data.name || !data.description || !data.categoryId || !data.brandId) {
      console.log('Validation failed');
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'Name, description, categoryId, and brandId are required'
        },
        { status: 400 }
      );
    }

    // Temporarily return success without database operations
    console.log('Returning mock success response');
    
    // Generate a highly unique ID for the mock product
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const additional = Math.random().toString(36).substring(2, 15);
    const uniqueId = `mock-${timestamp}-${randomStr}-${additional}`;
    
    return NextResponse.json({
      id: uniqueId,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      brandId: data.brandId,
      category: { id: data.categoryId, name: data.categoryId },
      brand: { id: data.brandId, name: data.brandId },
      status: "In Stock",
      totalStock: data.variants?.[0]?.stock || 0,
      variants: data.variants || [],
      image: "/api/placeholder/400/400",
      images: [{ url: "/api/placeholder/400/400" }],
      rating: 0,
      reviews: 0,
      inStock: true,
      message: "Mock product created successfully"
    }, { status: 201 });

    // Commented out database operations for testing
    /*

    // Check if category and brand exist, create them if they don't (for mock data compatibility)
    let category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      // Try to find by name in case it's a string ID like "cpu"
      category = await prisma.category.findFirst({
        where: { name: data.categoryId }
      });

      if (!category) {
        // Create category if it doesn't exist
        try {
          category = await prisma.category.create({
            data: {
              name: data.categoryId.charAt(0).toUpperCase() + data.categoryId.slice(1)
            }
          });
        } catch (error) {
          return NextResponse.json(
            { 
              error: 'Invalid category',
              details: 'Category not found and could not be created'
            },
            { status: 400 }
          );
        }
      }
    }

    let brand = await prisma.brand.findUnique({
      where: { id: data.brandId }
    });

    if (!brand) {
      // Try to find by name in case it's a string ID like "intel"
      brand = await prisma.brand.findFirst({
        where: { name: data.brandId }
      });

      if (!brand) {
        // Create brand if it doesn't exist
        try {
          brand = await prisma.brand.create({
            data: {
              name: data.brandId.charAt(0).toUpperCase() + data.brandId.slice(1)
            }
          });
        } catch (error) {
          return NextResponse.json(
            { 
              error: 'Invalid brand',
              details: 'Brand not found and could not be created'
            },
            { status: 400 }
          );
        }
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        categoryId: category.id,
        brandId: brand.id,
        images: data.images || [],
        tags: data.tags || [],
        variants: {
          create: data.variants?.map(variant => ({
            sku: variant.sku || `${data.name.replace(/\s+/g, '-').toUpperCase()}-001`,
            price: variant.price,
            attributes: variant.attributes || {}
          })) || []
        }
      },
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      details: error
    });
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
    */
  } catch (error) {
    console.error('Error creating product:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      details: error
    });
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
