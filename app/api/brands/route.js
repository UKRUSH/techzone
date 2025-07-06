import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🏷️ Fetching brands from MongoDB database...');

    // Fetch brands from MongoDB
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Format brands for frontend
    const formattedBrands = brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate slug from name
      description: brand.description || '',
      logo: brand.logo || '',
      productCount: brand._count.products,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt
    }));

    console.log(`✅ Retrieved ${formattedBrands.length} brands from MongoDB`);

    return NextResponse.json({
      success: true,
      data: formattedBrands,
      message: `Found ${formattedBrands.length} brands in database`
    });

  } catch (error) {
    console.error('❌ Error fetching brands from MongoDB:', error);
    
    // Fallback data if database is not available
    const fallbackBrands = [
      { id: "intel", name: "Intel", slug: "intel", description: "Intel Corporation", productCount: 0 },
      { id: "amd", name: "AMD", slug: "amd", description: "Advanced Micro Devices", productCount: 0 },
      { id: "nvidia", name: "NVIDIA", slug: "nvidia", description: "NVIDIA Corporation", productCount: 0 },
      { id: "corsair", name: "Corsair", slug: "corsair", description: "Corsair Gaming", productCount: 0 },
      { id: "samsung", name: "Samsung", slug: "samsung", description: "Samsung Electronics", productCount: 0 },
      { id: "asus", name: "ASUS", slug: "asus", description: "ASUSTeK Computer", productCount: 0 },
      { id: "msi", name: "MSI", slug: "msi", description: "Micro-Star International", productCount: 0 },
      { id: "gigabyte", name: "Gigabyte", slug: "gigabyte", description: "Gigabyte Technology", productCount: 0 }
    ];

    console.log('🔄 Using fallback brands data');

    return NextResponse.json({
      success: true,
      data: fallbackBrands,
      message: 'Using fallback brands data (database unavailable)'
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

    const { name, description } = await request.json();

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if brand already exists
    const existingBrand = await prisma.brand.findUnique({
      where: { name }
    });

    if (existingBrand) {
      return NextResponse.json(
        { error: 'Brand already exists' },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        description: description || null
      }
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}
