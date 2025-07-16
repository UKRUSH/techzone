// Fallback data for when database is not available
export const fallbackUserData = {
  id: 'fallback-user',
  name: 'Demo User',
  email: 'demo@techzone.com',
  phone: '0771234567',
  address: '456 Main Street, Kandy, Central Province, Sri Lanka',
  role: 'BUYER',
  loyaltyPoints: 1500,
  loyaltyLevel: 'Gold',
  createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 years ago
  orders: [],
  stats: {
    totalOrders: 3,
    totalSpent: 261499.97,
    totalReviews: 2,
    wishlistItems: 0,
    loyaltyPoints: 1500
  },
  memberYears: 2
};

export const fallbackOrders = [
  {
    id: 'demo-order-1',
    orderNumber: 'TZ-2025-001',
    status: 'delivered',
    total: 89999.99,
    subtotal: 89999.99,
    tax: 0,
    shipping: 1500,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    customerInfo: {
      name: 'Demo User',
      email: 'demo@techzone.com',
      phone: '0771234567'
    },
    items: [
      {
        id: 'item-1',
        productId: 'product-1',
        name: 'AMD Ryzen 7 5800X Processor',
        productName: 'AMD Ryzen 7 5800X Processor',
        quantity: 1,
        price: 89999.99,
        total: 89999.99
      }
    ],
    shipping: {
      address: '456 Main Street, Kandy, Central Province, Sri Lanka',
      method: 'Standard Shipping',
      trackingNumber: 'TZ-TRACK-001',
      estimatedDelivery: null
    }
  },
  {
    id: 'demo-order-2',
    orderNumber: 'TZ-2025-002',
    status: 'shipped',
    total: 125499.99,
    subtotal: 125499.99,
    tax: 0,
    shipping: 1500,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customerInfo: {
      name: 'Demo User',
      email: 'demo@techzone.com',
      phone: '0771234567'
    },
    items: [
      {
        id: 'item-2',
        productId: 'product-2',
        name: 'NVIDIA RTX 4070 Graphics Card',
        productName: 'NVIDIA RTX 4070 Graphics Card',
        quantity: 1,
        price: 125499.99,
        total: 125499.99
      }
    ],
    shipping: {
      address: '456 Main Street, Kandy, Central Province, Sri Lanka',
      method: 'Express Shipping',
      trackingNumber: 'TZ-TRACK-002',
      estimatedDelivery: null
    }
  },
  {
    id: 'demo-order-3',
    orderNumber: 'TZ-2025-003',
    status: 'processing',
    total: 45999.99,
    subtotal: 45999.99,
    tax: 0,
    shipping: 1500,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    customerInfo: {
      name: 'Demo User',
      email: 'demo@techzone.com',
      phone: '0771234567'
    },
    items: [
      {
        id: 'item-3',
        productId: 'product-3',
        name: 'Corsair Vengeance RGB Pro 32GB RAM',
        productName: 'Corsair Vengeance RGB Pro 32GB RAM',
        quantity: 1,
        price: 45999.99,
        total: 45999.99
      }
    ],
    shipping: {
      address: '456 Main Street, Kandy, Central Province, Sri Lanka',
      method: 'Standard Shipping',
      trackingNumber: null,
      estimatedDelivery: null
    }
  }
];

export const fallbackProducts = [
  {
    id: 'demo-product-1',
    name: 'AMD Ryzen 7 5800X',
    price: 89999.99,
    originalPrice: 94999.99,
    images: ['/api/placeholder/300/300'],
    category: 'Processors',
    brand: 'AMD',
    inStock: true,
    stock: 15,
    rating: 4.8,
    description: 'High-performance 8-core processor for gaming and content creation'
  },
  {
    id: 'demo-product-2',
    name: 'NVIDIA RTX 4070',
    price: 125499.99,
    originalPrice: 129999.99,
    images: ['/api/placeholder/300/300'],
    category: 'Graphics Cards',
    brand: 'NVIDIA',
    inStock: true,
    stock: 8,
    rating: 4.9,
    description: 'Premium graphics card for 4K gaming and AI workloads'
  },
  {
    id: 'demo-product-3',
    name: 'Corsair Vengeance RGB Pro 32GB',
    price: 45999.99,
    originalPrice: 49999.99,
    images: ['/api/placeholder/300/300'],
    category: 'Memory',
    brand: 'Corsair',
    inStock: true,
    stock: 25,
    rating: 4.7,
    description: 'High-speed DDR4 memory with RGB lighting'
  },
  {
    id: 'demo-product-4',
    name: 'Samsung 980 Pro 1TB NVMe',
    price: 29999.99,
    originalPrice: 34999.99,
    images: ['/api/placeholder/300/300'],
    category: 'Storage',
    brand: 'Samsung',
    inStock: true,
    stock: 30,
    rating: 4.8,
    description: 'Ultra-fast PCIe 4.0 NVMe SSD for lightning-fast storage'
  },
  {
    id: 'demo-product-5',
    name: 'ASUS ROG Strix B550-F Gaming',
    price: 35999.99,
    originalPrice: 39999.99,
    images: ['/api/placeholder/300/300'],
    category: 'Motherboards',
    brand: 'ASUS',
    inStock: true,
    stock: 12,
    rating: 4.6,
    description: 'Feature-rich ATX motherboard for AMD Ryzen processors'
  },
  {
    id: 'demo-product-6',
    name: 'Corsair RM850x 850W PSU',
    price: 28999.99,
    originalPrice: 32999.99,
    images: ['/api/placeholder/300/300'],
    category: 'Power Supplies',
    brand: 'Corsair',
    inStock: true,
    stock: 18,
    rating: 4.9,
    description: 'Fully modular 80+ Gold certified power supply'
  }
];

// Track database status
let databaseFailureCount = 0;
let lastDatabaseCheck = 0;
const DATABASE_CHECK_INTERVAL = 30000; // 30 seconds

export const isDatabaseDown = (error) => {
  // If we've had recent failures, assume database is still down
  const now = Date.now();
  if (databaseFailureCount > 2 && (now - lastDatabaseCheck) < DATABASE_CHECK_INTERVAL) {
    console.log('💨 Database assumed down due to recent failures');
    return true;
  }

  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  const isDown = (
    errorMessage.includes('Server selection timeout') ||
    errorMessage.includes('No available servers') ||
    errorMessage.includes('InternalError') ||
    errorMessage.includes('P2010') ||
    errorMessage.includes('Raw query failed') ||
    errorMessage.includes('Database timeout')
  );

  if (isDown) {
    databaseFailureCount++;
    lastDatabaseCheck = now;
    console.log(`💥 Database failure count: ${databaseFailureCount}`);
  } else if (databaseFailureCount > 0) {
    // Reset on successful connection
    databaseFailureCount = 0;
    console.log('✅ Database connection restored');
  }

  return isDown;
};
