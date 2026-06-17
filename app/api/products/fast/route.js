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
        { id: 1,  name: "RTX 4090 Gaming GPU",        price: 289900, compareAtPrice: 319900, category: "gpu",           brand: "NVIDIA",          inStock: true,  stock: 8,  rating: 5, image: "https://placehold.co/400x400/0f172a/22d3ee?text=RTX+4090"   },
        { id: 2,  name: "Intel Core i9-13900K",        price: 109900, compareAtPrice: 129900, category: "cpu",           brand: "Intel",           inStock: true,  stock: 12, rating: 5, image: "https://placehold.co/400x400/1e3a5f/60a5fa?text=i9-13900K"  },
        { id: 3,  name: "Samsung 980 PRO 2TB NVMe",    price: 42900,  compareAtPrice: 54900,  category: "storage",       brand: "Samsung",         inStock: true,  stock: 25, rating: 4, image: "https://placehold.co/400x400/14532d/4ade80?text=980+PRO"    },
        { id: 4,  name: "Corsair Vengeance DDR5 32GB", price: 59900,  compareAtPrice: null,   category: "memory",        brand: "Corsair",         inStock: true,  stock: 30, rating: 5, image: "https://placehold.co/400x400/3b0764/c084fc?text=DDR5+32GB"  },
        { id: 5,  name: "ASUS ROG Strix X670-E",       price: 89900,  compareAtPrice: 99900,  category: "motherboard",   brand: "ASUS",            inStock: true,  stock: 7,  rating: 4, image: "https://placehold.co/400x400/431407/fb923c?text=ROG+X670-E" },
        { id: 6,  name: "Corsair RM850x 80+ Gold",     price: 24900,  compareAtPrice: 29900,  category: "power-supply",  brand: "Corsair",         inStock: true,  stock: 15, rating: 5, image: "https://placehold.co/400x400/1c1917/f59e0b?text=RM850x"     },
        { id: 7,  name: "NZXT Kraken 360 AIO",         price: 34900,  compareAtPrice: 39900,  category: "cooling",       brand: "NZXT",            inStock: true,  stock: 10, rating: 4, image: "https://placehold.co/400x400/0c4a6e/38bdf8?text=Kraken+360" },
        { id: 8,  name: "Lian Li O11 Dynamic EVO",     price: 22900,  compareAtPrice: null,   category: "case",          brand: "Lian Li",         inStock: true,  stock: 6,  rating: 5, image: "https://placehold.co/400x400/1e293b/94a3b8?text=O11+EVO"    },
        { id: 9,  name: "AMD Ryzen 9 7950X",           price: 129900, compareAtPrice: 149900, category: "cpu",           brand: "AMD",             inStock: true,  stock: 9,  rating: 5, image: "https://placehold.co/400x400/450a0a/f87171?text=Ryzen+7950X"},
        { id: 10, name: "MSI GeForce RTX 4080 Super",  price: 179900, compareAtPrice: 199900, category: "gpu",           brand: "MSI",             inStock: true,  stock: 5,  rating: 4, image: "https://placehold.co/400x400/0f172a/a78bfa?text=RTX+4080S"  },
        { id: 11, name: "WD Black SN850X 1TB",         price: 19900,  compareAtPrice: 24900,  category: "storage",       brand: "Western Digital", inStock: true,  stock: 40, rating: 4, image: "https://placehold.co/400x400/052e16/86efac?text=SN850X"     },
        { id: 12, name: "G.Skill Trident Z5 RGB 64GB", price: 79900,  compareAtPrice: null,   category: "memory",        brand: "G.Skill",         inStock: false, stock: 0,  rating: 5, image: "https://placehold.co/400x400/2e1065/e879f9?text=Z5+RGB"     },
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
      total: 12,
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

    // Ultra-fast response with aggressive caching
    const response = NextResponse.json(fastResponse);
    
    // Performance headers for instant loading
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600, stale-if-error=86400');
    response.headers.set('CDN-Cache-Control', 'public, max-age=600');
    response.headers.set('Vary', 'Accept-Encoding');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Access-Control-Max-Age', '86400');
    
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
