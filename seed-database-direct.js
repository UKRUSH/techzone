const { MongoClient } = require('mongodb');

// Read environment file manually
function loadEnv() {
  try {
    const fs = require('fs');
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('DATABASE_URL=')) {
        return line.split('=')[1].replace(/"/g, '').trim();
      }
    }
  } catch (error) {
    console.log('Could not read .env.local file');
  }
  return null;
}

async function seedDatabase() {
  const connectionString = loadEnv();
  console.log('🔄 Connecting to MongoDB directly...');
  
  const client = new MongoClient(connectionString);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db('techzone');
    
    // Clear existing data
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      db.collection('Product').deleteMany({}),
      db.collection('Category').deleteMany({}),
      db.collection('Brand').deleteMany({})
    ]);
    
    // Create categories
    console.log('📁 Creating categories...');
    const categories = [
      { _id: 'gpu', name: 'Graphics Cards' },
      { _id: 'cpu', name: 'Processors' },
      { _id: 'memory', name: 'Memory & RAM' },
      { _id: 'storage', name: 'Storage' },
      { _id: 'motherboard', name: 'Motherboards' },
      { _id: 'psu', name: 'Power Supplies' },
      { _id: 'cooling', name: 'Cooling' },
      { _id: 'case', name: 'Cases' }
    ];
    
    await db.collection('Category').insertMany(categories);
    
    // Create brands
    console.log('🏷️ Creating brands...');
    const brands = [
      { _id: 'nvidia', name: 'NVIDIA' },
      { _id: 'amd', name: 'AMD' },
      { _id: 'intel', name: 'Intel' },
      { _id: 'msi', name: 'MSI' },
      { _id: 'asus', name: 'ASUS' },
      { _id: 'corsair', name: 'Corsair' },
      { _id: 'samsung', name: 'Samsung' },
      { _id: 'gskill', name: 'G.SKILL' },
      { _id: 'wd', name: 'Western Digital' },
      { _id: 'noctua', name: 'Noctua' },
      { _id: 'fractal', name: 'Fractal Design' }
    ];
    
    await db.collection('Brand').insertMany(brands);
    
    // Create products
    console.log('🛒 Creating products...');
    const products = [
      {
        _id: 'rtx4090-gaming-x',
        name: 'NVIDIA GeForce RTX 4090 24GB Gaming X Trio',
        description: 'The ultimate gaming graphics card with 24GB GDDR6X memory, featuring advanced Ada Lovelace architecture and ray tracing capabilities.',
        categoryId: 'gpu',
        brandId: 'msi',
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            _id: 'rtx4090-gaming-x-v1',
            sku: 'MSI-RTX4090-GAMING-X-24G',
            price: 1599.99,
            attributes: {
              memory: '24GB GDDR6X',
              coreClock: '2230 MHz',
              memoryClock: '21000 MHz'
            }
          }
        ]
      },
      {
        _id: 'i9-13900k',
        name: 'Intel Core i9-13900K Desktop Processor',
        description: '24-core (8P+16E) processor with up to 5.8 GHz max turbo frequency. Perfect for gaming and content creation.',
        categoryId: 'cpu',
        brandId: 'intel',
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            _id: 'i9-13900k-v1',
            sku: 'INTEL-I9-13900K',
            price: 589.99,
            attributes: {
              cores: '24 (8P+16E)',
              threads: '32',
              baseClock: '3.0 GHz',
              maxTurbo: '5.8 GHz'
            }
          }
        ]
      },
      {
        _id: 'ryzen-9-7950x',
        name: 'AMD Ryzen 9 7950X Desktop Processor',
        description: '16-core, 32-thread processor with up to 5.7 GHz max boost. Built on advanced 5nm process technology.',
        categoryId: 'cpu',
        brandId: 'amd',
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            _id: 'ryzen-9-7950x-v1',
            sku: 'AMD-RYZEN-9-7950X',
            price: 699.99,
            attributes: {
              cores: '16',
              threads: '32',
              baseClock: '4.5 GHz',
              maxBoost: '5.7 GHz'
            }
          }
        ]
      },
      {
        _id: 'rtx4080-super',
        name: 'NVIDIA GeForce RTX 4080 SUPER 16GB',
        description: 'High-performance graphics card with 16GB GDDR6X memory. Excellent for 4K gaming and creative work.',
        categoryId: 'gpu',
        brandId: 'asus',
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            _id: 'rtx4080-super-v1',
            sku: 'ASUS-RTX4080-SUPER-16G',
            price: 999.99,
            attributes: {
              memory: '16GB GDDR6X',
              coreClock: '2295 MHz',
              memoryClock: '22400 MHz'
            }
          }
        ]
      },
      {
        _id: 'ddr5-corsair-32gb',
        name: 'Corsair Vengeance DDR5-6000 32GB (2x16GB)',
        description: 'High-speed DDR5 memory kit optimized for AMD and Intel platforms. RGB lighting included.',
        categoryId: 'memory',
        brandId: 'corsair',
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            _id: 'ddr5-corsair-32gb-v1',
            sku: 'CORSAIR-DDR5-6000-32GB',
            price: 179.99,
            attributes: {
              capacity: '32GB (2x16GB)',
              speed: 'DDR5-6000',
              timings: 'CL36-36-36-76',
              voltage: '1.35V'
            }
          }
        ]
      },
      {
        _id: 'samsung-980-pro-2tb',
        name: 'Samsung 980 PRO 2TB NVMe SSD',
        description: 'PCIe 4.0 NVMe SSD with read speeds up to 7,000 MB/s. Perfect for gaming and professional applications.',
        categoryId: 'storage',
        brandId: 'samsung',
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [
          {
            _id: 'samsung-980-pro-2tb-v1',
            sku: 'SAMSUNG-980-PRO-2TB',
            price: 149.99,
            attributes: {
              capacity: '2TB',
              interface: 'PCIe 4.0 x4',
              readSpeed: '7,000 MB/s',
              writeSpeed: '6,900 MB/s'
            }
          }
        ]
      }
    ];
    
    await db.collection('Product').insertMany(products);
    
    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${categories.length} categories`);
    console.log(`🏷️ Created ${brands.length} brands`);
    console.log(`🛒 Created ${products.length} products`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
