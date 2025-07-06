import { NextResponse } from 'next/server';

// Ultra-fast API with aggressive caching and minimal data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 6;
    
    // Immediate response with cached/mock data for instant loading
    const fastResponse = {
      success: true,
      products: [
        {
          id: 1,
          name: "RTX 4090 Gaming GPU",
          price: 1599,
          category: "gpu",
          brand: "NVIDIA",
          inStock: true,
          rating: 5,
          image: "/placeholder-gpu.jpg"
        },
        {
          id: 2,
          name: "Intel i9-13900K",
          price: 589,
          category: "cpu",
          brand: "Intel",
          inStock: true,
          rating: 5,
          image: "/placeholder-cpu.jpg"
        },
        {
          id: 3,
          name: "Samsung 980 PRO 2TB",
          price: 299,
          category: "storage",
          brand: "Samsung",
          inStock: true,
          rating: 4,
          image: "/placeholder-ssd.jpg"
        },
        {
          id: 4,
          name: "Corsair DDR5-5600 32GB",
          price: 399,
          category: "memory",
          brand: "Corsair",
          inStock: true,
          rating: 5,
          image: "/placeholder-ram.jpg"
        },
        {
          id: 5,
          name: "ASUS ROG Strix X670-E",
          price: 499,
          category: "motherboard",
          brand: "ASUS",
          inStock: true,
          rating: 4,
          image: "/placeholder-mobo.jpg"
        },
        {
          id: 6,
          name: "Corsair RM850x PSU",
          price: 159,
          category: "power-supply",
          brand: "Corsair",
          inStock: true,
          rating: 5,
          image: "/placeholder-psu.jpg"
        }
      ],
      categories: [
        { name: "Graphics Cards", slug: "gpu", count: 150 },
        { name: "Processors", slug: "cpu", count: 89 },
        { name: "Storage", slug: "storage", count: 245 },
        { name: "Memory", slug: "memory", count: 67 },
        { name: "Motherboards", slug: "motherboard", count: 112 },
        { name: "Power Supplies", slug: "power-supply", count: 78 }
      ],
      brands: [
        { name: "NVIDIA", count: 45 },
        { name: "Intel", count: 38 },
        { name: "AMD", count: 42 },
        { name: "Samsung", count: 67 },
        { name: "Corsair", count: 89 },
        { name: "ASUS", count: 123 }
      ],
      total: 6,
      cached: true,
      timestamp: new Date().toISOString()
    };

    // Filter by category if specified
    if (category) {
      fastResponse.products = fastResponse.products.filter(
        product => product.category === category
      );
      fastResponse.total = fastResponse.products.length;
    }

    // Limit results
    fastResponse.products = fastResponse.products.slice(0, limit);

    // Ultra-aggressive caching headers for instant responses
    const response = NextResponse.json(fastResponse);
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400');
    response.headers.set('CDN-Cache-Control', 'public, max-age=300');
    response.headers.set('Vercel-CDN-Cache-Control', 'public, max-age=300');
    
    return response;

  } catch (error) {
    console.error('Fast API Error:', error);
    
    // Return cached response even on error for ultimate reliability
    const fallbackResponse = {
      success: true,
      products: [],
      categories: [],
      brands: [],
      total: 0,
      cached: true,
      fallback: true,
      timestamp: new Date().toISOString()
    };

    const response = NextResponse.json(fallbackResponse);
    response.headers.set('Cache-Control', 'public, max-age=60');
    return response;
  }
}
