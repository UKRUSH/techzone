import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma, testDatabaseConnection } from '@/lib/prisma';

// Mock categories data for fast loading
const mockCategories = [
  { id: "cpu", name: "CPU", slug: "cpu", description: "Central Processing Units", productCount: 150 },
  { id: "gpu", name: "Graphics Cards", slug: "gpu", description: "Graphics Processing Units", productCount: 89 },
  { id: "ram", name: "Memory", slug: "ram", description: "System Memory", productCount: 120 },
  { id: "storage", name: "Storage", slug: "storage", description: "SSDs and Hard Drives", productCount: 200 },
  { id: "motherboard", name: "Motherboards", slug: "motherboard", description: "Motherboards", productCount: 95 },
  { id: "psu", name: "Power Supplies", slug: "psu", description: "Power Supply Units", productCount: 75 },
  { id: "cooling", name: "Cooling", slug: "cooling", description: "CPU Coolers and Case Fans", productCount: 110 }
];

export async function GET() {
  // First check if database is available with fast timeout
  const isDatabaseAvailable = await testDatabaseConnection();
  
  if (!isDatabaseAvailable) {
    // Return mock data immediately if database is unavailable
    return NextResponse.json(mockCategories);
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    // Return mock data when database query fails
    return NextResponse.json(mockCategories);
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

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
