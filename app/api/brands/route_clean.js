import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

// Mock brands data for fast loading
const mockBrands = [
  { id: "amd", name: "AMD", slug: "amd", description: "Advanced Micro Devices", productCount: 45 },
  { id: "intel", name: "Intel", slug: "intel", description: "Intel Corporation", productCount: 52 },
  { id: "nvidia", name: "NVIDIA", slug: "nvidia", description: "NVIDIA Corporation", productCount: 38 },
  { id: "corsair", name: "Corsair", slug: "corsair", description: "Corsair Gaming", productCount: 67 },
  { id: "asus", name: "ASUS", slug: "asus", description: "ASUSTeK Computer", productCount: 89 },
  { id: "msi", name: "MSI", slug: "msi", description: "Micro-Star International", productCount: 43 },
  { id: "gigabyte", name: "Gigabyte", slug: "gigabyte", description: "Gigabyte Technology", productCount: 56 }
];

export async function GET() {
  // First check if database is available with fast timeout
  const isDatabaseAvailable = await testDatabaseConnection();
  
  if (!isDatabaseAvailable) {
    // Return mock data immediately if database is unavailable
    return NextResponse.json(mockBrands);
  }

  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    
    // Return mock data when database query fails
    return NextResponse.json(mockBrands);
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
