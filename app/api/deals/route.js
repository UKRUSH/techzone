import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

// Mock deals data for fast loading
const mockDeals = [
  {
    id: "deal-1",
    title: "Intel Core i7-13700K",
    description: "High-performance processor for gaming and productivity",
    originalPrice: 449.99,
    discountedPrice: 409.99,
    discountPercentage: 9,
    image: "/api/placeholder/400/400",
    category: "CPU",
    brand: "Intel",
    rating: 4.8,
    reviews: 256,
    stock: 45,
    expiresAt: "2025-07-10T23:59:59.000Z",
    featured: true,
    tags: ["Hot Deal", "Limited Time"]
  },
  {
    id: "deal-2",
    title: "NVIDIA GeForce RTX 4070",
    description: "Next-gen graphics card for 1440p gaming",
    originalPrice: 649.99,
    discountedPrice: 599.99,
    discountPercentage: 8,
    image: "/api/placeholder/400/400",
    category: "Graphics Cards",
    brand: "NVIDIA",
    rating: 4.7,
    reviews: 189,
    stock: 23,
    expiresAt: "2025-07-08T23:59:59.000Z",
    featured: true,
    tags: ["Flash Sale", "Best Seller"]
  },
  {
    id: "deal-3",
    title: "Corsair Vengeance RGB Pro 32GB",
    description: "High-speed DDR4 RAM with RGB lighting",
    originalPrice: 159.99,
    discountedPrice: 129.99,
    discountPercentage: 19,
    image: "/api/placeholder/400/400",
    category: "Memory",
    brand: "Corsair",
    rating: 4.6,
    reviews: 432,
    stock: 67,
    expiresAt: "2025-07-12T23:59:59.000Z",
    featured: false,
    tags: ["Great Value"]
  },
  {
    id: "deal-4",
    title: "Samsung 980 PRO 1TB SSD",
    description: "High-speed NVMe SSD for gaming and professional use",
    originalPrice: 119.99,
    discountedPrice: 89.99,
    discountPercentage: 25,
    image: "/api/placeholder/400/400",
    category: "Storage",
    brand: "Samsung",
    rating: 4.9,
    reviews: 672,
    stock: 134,
    expiresAt: "2025-07-15T23:59:59.000Z",
    featured: false,
    tags: ["Super Saver"]
  },
  {
    id: "deal-5",
    title: "ASUS ROG Strix Z690-E",
    description: "Premium motherboard with Wi-Fi 6E and RGB",
    originalPrice: 379.99,
    discountedPrice: 329.99,
    discountPercentage: 13,
    image: "/api/placeholder/400/400",
    category: "Motherboards",
    brand: "ASUS",
    rating: 4.7,
    reviews: 198,
    stock: 28,
    expiresAt: "2025-07-09T23:59:59.000Z",
    featured: false,
    tags: ["Premium"]
  },
  {
    id: "deal-6",
    title: "Corsair RM850x 850W PSU",
    description: "Fully modular 80+ Gold certified power supply",
    originalPrice: 149.99,
    discountedPrice: 129.99,
    discountPercentage: 13,
    image: "/api/placeholder/400/400",
    category: "Power Supplies",
    brand: "Corsair",
    rating: 4.8,
    reviews: 345,
    stock: 89,
    expiresAt: "2025-07-14T23:59:59.000Z",
    featured: false,
    tags: ["Reliable"]
  }
];

export async function GET() {
  // First check if database is available with fast timeout
  const isDatabaseAvailable = await testDatabaseConnection();
  
  if (!isDatabaseAvailable) {
    // Return mock data immediately if database is unavailable
    return NextResponse.json(mockDeals);
  }

  try {
    // In a real implementation, you would fetch deals from the database
    // For now, we'll return mock data since we don't have a deals table in the schema
    
    // This is where you would query actual deals:
    // const deals = await prisma.deal.findMany({
    //   where: {
    //     isActive: true,
    //     expiresAt: {
    //       gt: new Date()
    //     }
    //   },
    //   orderBy: [
    //     { featured: 'desc' },
    //     { discountPercentage: 'desc' }
    //   ]
    // });

    return NextResponse.json(mockDeals);
  } catch (error) {
    console.error('Error fetching deals:', error);
    
    // Return mock data when database query fails
    return NextResponse.json(mockDeals);
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

    // Validate required fields
    if (!data.title || !data.originalPrice || !data.discountedPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate discount percentage
    const discountPercentage = Math.round(
      ((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100
    );

    // In a real implementation, create the deal in the database
    const deal = {
      id: `deal-${Date.now()}`,
      title: data.title,
      description: data.description,
      originalPrice: data.originalPrice,
      discountedPrice: data.discountedPrice,
      discountPercentage,
      image: data.image || "/api/placeholder/400/400",
      category: data.category,
      brand: data.brand,
      rating: data.rating || 0,
      reviews: data.reviews || 0,
      stock: data.stock || 0,
      expiresAt: data.expiresAt,
      featured: data.featured || false,
      tags: data.tags || [],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
