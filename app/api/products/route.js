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
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        sku: data.sku,
        categoryId: data.categoryId,
        brandId: data.brandId,
        isActive: data.isActive ?? true,
        variants: {
          create: data.variants?.map(variant => ({
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            attributes: variant.attributes || {},
            inventoryLevels: {
              create: variant.inventory?.map(inv => ({
                quantity: inv.quantity,
                reserved: inv.reserved || 0,
                locationId: inv.locationId
              })) || []
            }
          })) || []
        },
        images: {
          create: data.images?.map((img, index) => ({
            url: img.url,
            alt: img.alt || data.name,
            position: index
          })) || []
        }
      },
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
        images: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
