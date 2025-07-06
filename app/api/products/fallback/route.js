import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Temporary file-based storage for products when MongoDB is unavailable
const TEMP_DATA_DIR = path.join(process.cwd(), 'temp-data');
const PRODUCTS_FILE = path.join(TEMP_DATA_DIR, 'products.json');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DATA_DIR)) {
  fs.mkdirSync(TEMP_DATA_DIR, { recursive: true });
}

// Helper functions
function readProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
}

function findCategoryById(categoryId) {
  const categories = {
    "cpu": { id: "cpu", name: "CPU" },
    "gpu": { id: "gpu", name: "GPU" },
    "memory": { id: "memory", name: "Memory" },
    "storage": { id: "storage", name: "Storage" },
    "motherboard": { id: "motherboard", name: "Motherboard" },
    "power-supply": { id: "power-supply", name: "Power Supply" },
    "cooling": { id: "cooling", name: "Cooling" },
    "case": { id: "case", name: "Case" }
  };
  return categories[categoryId] || { id: categoryId, name: categoryId };
}

function findBrandById(brandId) {
  const brands = {
    "intel": { id: "intel", name: "Intel" },
    "amd": { id: "amd", name: "AMD" },
    "nvidia": { id: "nvidia", name: "NVIDIA" },
    "corsair": { id: "corsair", name: "Corsair" },
    "samsung": { id: "samsung", name: "Samsung" },
    "asus": { id: "asus", name: "ASUS" },
    "msi": { id: "msi", name: "MSI" },
    "gigabyte": { id: "gigabyte", name: "Gigabyte" }
  };
  return brands[brandId] || { id: brandId, name: brandId };
}

export async function GET(request) {
  try {
    console.log('📦 Fetching products from temporary file storage...');
    
    const products = readProducts();
    
    console.log(`✅ Retrieved ${products.length} products from temp storage`);

    return NextResponse.json({
      success: true,
      data: products,
      message: `Found ${products.length} products in temporary storage (MongoDB unavailable)`
    });

  } catch (error) {
    console.error('❌ Error fetching products from temp storage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('📦 Creating new product in temp storage:', data);

    // Validate required fields (accept either name-based or ID-based data)
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Handle both category/brand names and IDs
    let categoryId = data.categoryId;
    let brandId = data.brandId;
    let categoryName = data.category;
    let brandName = data.brand;

    // If we have category/brand names but no IDs, generate IDs from names
    if (!categoryId && categoryName) {
      categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
    }
    if (!brandId && brandName) {
      brandId = brandName.toLowerCase().replace(/\s+/g, '-');
    }

    // If we have IDs but no names, get names from helper functions
    if (!categoryName && categoryId) {
      categoryName = findCategoryById(categoryId)?.name || categoryId;
    }
    if (!brandName && brandId) {
      brandName = findBrandById(brandId)?.name || brandId;
    }

    const products = readProducts();
    
    // Create new product with simplified structure
    const newProduct = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: data.name,
      description: data.description || '',
      price: data.price || 0,
      category: categoryName,
      brand: brandName,
      stock: data.stock || 0,
      imageUrl: data.imageUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.unshift(newProduct); // Add to beginning
    
    if (writeProducts(products)) {
      console.log('✅ Product created successfully in temp storage:');
      console.log(`   ID: ${newProduct.id}`);
      console.log(`   Name: ${newProduct.name}`);
      console.log(`   Category: ${newProduct.category}`);
      console.log(`   Brand: ${newProduct.brand}`);
      console.log(`   Price: $${newProduct.price}`);

      return NextResponse.json({
        success: true,
        data: newProduct,
        message: 'Product created successfully in temporary storage! Fix MongoDB for persistence.'
      });
    } else {
      throw new Error('Failed to save to temporary storage');
    }

  } catch (error) {
    console.error('❌ Error creating product in temp storage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    console.log('📝 Updating product in temp storage:', { id, updateData });

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for update' },
        { status: 400 }
      );
    }

    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = {
      ...products[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    products[productIndex] = updatedProduct;

    if (writeProducts(products)) {
      console.log('✅ Product updated successfully in temp storage:');
      console.log(`   ID: ${updatedProduct.id}`);
      console.log(`   Name: ${updatedProduct.name}`);

      return NextResponse.json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully in temporary storage'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save updated product' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error updating product in temp storage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('🗑️ Deleting product from temp storage:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required for deletion' },
        { status: 400 }
      );
    }

    const products = readProducts();
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);

    if (writeProducts(products)) {
      console.log('✅ Product deleted successfully from temp storage:');
      console.log(`   ID: ${deletedProduct.id}`);
      console.log(`   Name: ${deletedProduct.name}`);

      return NextResponse.json({
        success: true,
        data: deletedProduct,
        message: 'Product deleted successfully from temporary storage'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save after deletion' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Error deleting product from temp storage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product: ' + error.message },
      { status: 500 }
    );
  }
}
