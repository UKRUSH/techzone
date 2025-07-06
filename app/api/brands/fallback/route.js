import { NextResponse } from 'next/server';

// Temporary fallback API for brands
export async function GET(request) {
  try {
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

    console.log('🔄 Using fallback brands data (MongoDB unavailable)');

    return NextResponse.json({
      success: true,
      data: fallbackBrands,
      message: 'Using fallback brands data - Fix MongoDB connection for persistence'
    });

  } catch (error) {
    console.error('❌ Error in fallback brands API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get brands: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('🏷️ Creating brand (fallback mode):', data);

    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const newBrand = {
      id: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: data.description || '',
      productCount: 0,
      createdAt: new Date().toISOString()
    };

    console.log('✅ Brand created (fallback):', newBrand);

    return NextResponse.json({
      success: true,
      data: newBrand,
      message: 'Brand created in fallback mode'
    });

  } catch (error) {
    console.error('❌ Error creating brand (fallback):', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brand: ' + error.message },
      { status: 500 }
    );
  }
}
