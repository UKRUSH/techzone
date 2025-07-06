const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting enhanced database seed...');

    await prisma.$connect();
    console.log('Connected to database successfully');

    // Get existing data
    const location = await prisma.location.findFirst();
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();

    // Helper function to find by name
    const findByName = (array, name) => array.find(item => item.name === name);

    // Create sample products with Sri Lankan pricing (LKR)
    const products = [
      {
        name: "AMD Ryzen 7 7700X",
        description: "High-performance 8-core processor for gaming and productivity. Perfect for 1440p gaming and content creation.",
        images: ["/api/placeholder/400/400"],
        tags: ["gaming", "productivity", "8-core", "AM5"],
        categoryName: "CPU",
        brandName: "AMD",
        variants: [{
          sku: "AMD-7700X-001",
          price: 75000, // LKR
          compareAtPrice: 85000,
          attributes: { cores: 8, threads: 16, baseClock: "3.6GHz", boostClock: "5.4GHz" },
          stock: 25
        }]
      },
      {
        name: "Intel Core i7-13700K",
        description: "Latest generation Intel processor with hybrid architecture. Excellent for gaming and multitasking.",
        images: ["/api/placeholder/400/400"],
        tags: ["gaming", "productivity", "hybrid-architecture", "LGA1700"],
        categoryName: "CPU",
        brandName: "Intel",
        variants: [{
          sku: "INTEL-13700K-001",
          price: 78000, // LKR
          compareAtPrice: 88000,
          attributes: { cores: 16, threads: 24, baseClock: "3.4GHz", boostClock: "5.4GHz" },
          stock: 30
        }]
      },
      {
        name: "NVIDIA GeForce RTX 4070",
        description: "Next-generation graphics card with ray tracing and DLSS 3. Perfect for 1440p gaming at high settings.",
        images: ["/api/placeholder/400/400"],
        tags: ["gaming", "ray-tracing", "dlss3", "1440p"],
        categoryName: "GPU",
        brandName: "NVIDIA",
        variants: [{
          sku: "NVIDIA-RTX4070-001",
          price: 125000, // LKR
          compareAtPrice: 140000,
          attributes: { memory: "12GB GDDR6X", rayTracing: true, dlss: "3.0" },
          stock: 15
        }]
      },
      {
        name: "Corsair Vengeance RGB Pro 32GB DDR4",
        description: "High-performance DDR4 memory with stunning RGB lighting. Perfect for gaming and content creation.",
        images: ["/api/placeholder/400/400"],
        tags: ["rgb", "gaming", "32gb", "ddr4"],
        categoryName: "RAM",
        brandName: "Corsair",
        variants: [{
          sku: "CORSAIR-RGB32-001",
          price: 28000, // LKR
          compareAtPrice: 32000,
          attributes: { capacity: "32GB", speed: "3200MHz", type: "DDR4", rgb: true },
          stock: 50
        }]
      },
      {
        name: "Samsung 980 PRO 1TB NVMe SSD",
        description: "Ultra-fast PCIe 4.0 NVMe SSD for lightning-fast load times and system responsiveness.",
        images: ["/api/placeholder/400/400"],
        tags: ["nvme", "pcie4", "1tb", "fast"],
        categoryName: "Storage",
        brandName: "Samsung",
        variants: [{
          sku: "SAMSUNG-980PRO-1TB",
          price: 18000, // LKR
          compareAtPrice: 22000,
          attributes: { capacity: "1TB", interface: "PCIe 4.0", type: "NVMe" },
          stock: 40
        }]
      },
      {
        name: "ASUS ROG Strix Z690-E Gaming",
        description: "Premium gaming motherboard with Wi-Fi 6E, RGB lighting, and robust power delivery.",
        images: ["/api/placeholder/400/400"],
        tags: ["gaming", "wifi6e", "rgb", "ddr5-ready"],
        categoryName: "Motherboard",
        brandName: "ASUS",
        variants: [{
          sku: "ASUS-Z690E-001",
          price: 58000, // LKR
          compareAtPrice: 65000,
          attributes: { socket: "LGA1700", wifi: "6E", rgb: true, ddr5: true },
          stock: 20
        }]
      }
    ];

    // Create products
    for (const productData of products) {
      const category = findByName(categories, productData.categoryName);
      const brand = findByName(brands, productData.brandName);

      if (!category || !brand) {
        console.log(`Skipping ${productData.name} - missing category or brand`);
        continue;
      }

      // Check if product already exists
      const existingProduct = await prisma.product.findFirst({
        where: { name: productData.name }
      });

      if (existingProduct) {
        console.log(`Product ${productData.name} already exists, skipping...`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          images: productData.images,
          tags: productData.tags,
          categoryId: category.id,
          brandId: brand.id,
          variants: {
            create: productData.variants.map(variant => ({
              sku: variant.sku,
              price: variant.price,
              compareAtPrice: variant.compareAtPrice,
              attributes: variant.attributes,
              inventoryLevels: {
                create: {
                  locationId: location.id,
                  stock: variant.stock,
                  reserved: 0,
                  incoming: 0
                }
              }
            }))
          }
        },
        include: {
          variants: {
            include: {
              inventoryLevels: true
            }
          }
        }
      });

      console.log(`✅ Created product: ${product.name} with ${product.variants.length} variants`);
    }

    console.log('🎉 Enhanced database seed completed successfully!');
    console.log('📦 Database now contains real Sri Lankan products with LKR pricing');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
