import { NextResponse } from 'next/server';

// Temporary fallback API that works without database
// This will help you add products immediately while we fix MongoDB

export async function GET(request) {
  try {
    // Return fallback categories that work with the admin interface
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

    console.log('🔄 Using fallback categories data (MongoDB unavailable)');

    return NextResponse.json({
      success: true,
      data: fallbackCategories,
      message: 'Using fallback categories data - Add your MongoDB IP to Atlas whitelist'
    });

  } catch (error) {
    console.error('❌ Error in fallback categories API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get categories: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('📁 Creating category (fallback mode):', data);

    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const newCategory = {
      id: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: data.description || '',
      productCount: 0,
      createdAt: new Date().toISOString()
    };

    console.log('✅ Category created (fallback):', newCategory);

    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created in fallback mode'
    });

  } catch (error) {
    console.error('❌ Error creating category (fallback):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category: ' + error.message },
      { status: 500 }
    );
  }
}
