import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('📁 Fetching categories from MongoDB database...');

    // Fetch categories from MongoDB
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Format categories for frontend
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate slug from name
      description: category.description || '',
      productCount: category._count.products,
      image: category.image || "/api/placeholder/400/400",
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    console.log(`✅ Retrieved ${formattedCategories.length} categories from MongoDB`);

    return NextResponse.json({
      success: true,
      data: formattedCategories,
      message: `Found ${formattedCategories.length} categories in database`
    });

  } catch (error) {
    console.error('❌ Error fetching categories from MongoDB:', error);
    
    // Fallback data if database is not available
    const fallbackCategories = [
      { id: "cpu", name: "CPU", slug: "cpu", description: "Central Processing Units", productCount: 0 },
      { id: "gpu", name: "GPU", slug: "gpu", description: "Graphics Processing Units", productCount: 0 },
      { id: "memory", name: "Memory", slug: "memory", description: "RAM and Memory modules", productCount: 0 },
      { id: "storage", name: "Storage", slug: "storage", description: "Storage devices", productCount: 0 },
      { id: "motherboard", name: "Motherboard", slug: "motherboard", description: "Motherboards", productCount: 0 },
      { id: "power-supply", name: "Power Supply", slug: "power-supply", description: "Power Supply Units", productCount: 0 },
      { id: "cooling", name: "Cooling", slug: "cooling", description: "Cooling solutions", productCount: 0 },
      { id: "case", name: "Case", slug: "case", description: "PC Cases", productCount: 0 }
    ];

    console.log('🔄 Using fallback categories data');

    return NextResponse.json({
      success: true,
      data: fallbackCategories,
      message: 'Using fallback categories data (database unavailable)'
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
