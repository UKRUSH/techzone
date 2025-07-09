import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Fallback data loader
function loadFallbackData() {
  try {
    const productsPath = path.join(process.cwd(), 'temp-data', 'products.json');
    const categoriesPath = path.join(process.cwd(), 'temp-data', 'categories.json');
    const brandsPath = path.join(process.cwd(), 'temp-data', 'brands.json');
    
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
    
    return { products, categories, brands };
  } catch (error) {
    console.error('Error loading fallback data:', error);
    return { products: [], categories: [], brands: [] };
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const includeMetadata = searchParams.get('includeMetadata') === 'true';

    console.log('🔄 Loading products with fallback data...');
    
    // Use fallback data since database is unavailable
    const fallbackData = loadFallbackData();
    let products = fallbackData.products;

    // Apply filters
    if (search) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      products = products.filter(product => 
        product.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      products = products.filter(product => 
        product.brand?.name?.toLowerCase() === brand.toLowerCase()
      );
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedProducts = products.slice(skip, skip + limit);

    // Prepare response
    const response = {
      success: true,
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit)
      }
    };

    if (includeMetadata) {
      response.metadata = {
        categories: fallbackData.categories,
        brands: fallbackData.brands
      };
    }

    console.log(`✅ Loaded ${paginatedProducts.length} products from fallback data`);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load products',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
