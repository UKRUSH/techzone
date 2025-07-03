import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@techzone.com' },
      update: {},
      create: {
        name: 'TechZone Admin',
        email: 'admin@techzone.com',
        password: hashedAdminPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });

    // Create test user
    const hashedUserPassword = await bcrypt.hash('test123', 12);
    const testUser = await prisma.user.upsert({
      where: { email: 'user@techzone.com' },
      update: {},
      create: {
        name: 'Test User',
        email: 'user@techzone.com',
        password: hashedUserPassword,
        role: 'BUYER',
        emailVerified: new Date()
      }
    });

    // Get categories and brands
    const cpuCategory = await prisma.category.findUnique({ where: { name: 'CPU' } });
    const gpuCategory = await prisma.category.findUnique({ where: { name: 'GPU' } });
    const amdBrand = await prisma.brand.findUnique({ where: { name: 'AMD' } });
    const nvidiaBrand = await prisma.brand.findUnique({ where: { name: 'NVIDIA' } });
    const defaultLocation = await prisma.location.findFirst();

    if (!cpuCategory || !gpuCategory || !amdBrand || !nvidiaBrand || !defaultLocation) {
      return NextResponse.json({ error: 'Required categories, brands, or location not found' }, { status: 400 });
    }

    // Create sample products
    const sampleProducts = [
      {
        name: 'AMD Ryzen 9 7900X',
        description: 'High-performance 12-core, 24-thread desktop processor for gaming and content creation.',
        categoryId: cpuCategory.id,
        brandId: amdBrand.id,
        images: [],
        tags: ['gaming', 'high-performance', 'desktop'],
        specs: {
          cores: 12,
          threads: 24,
          baseClock: '4.7 GHz',
          boostClock: '5.6 GHz',
          socket: 'AM5',
          tdp: '170W'
        },
        variants: {
          create: [{
            sku: 'AMD-7900X-001',
            price: 599.99,
            compareAtPrice: 699.99,
            specs: {},
            inventory: {
              create: {
                locationId: defaultLocation.id,
                stock: 45,
                reserved: 0,
                incoming: 0
              }
            }
          }]
        }
      },
      {
        name: 'NVIDIA GeForce RTX 4080 SUPER',
        description: 'Premium graphics card for 4K gaming and content creation with ray tracing capabilities.',
        categoryId: gpuCategory.id,
        brandId: nvidiaBrand.id,
        images: [],
        tags: ['gaming', 'ray-tracing', '4k', 'graphics'],
        specs: {
          memory: '16GB GDDR6X',
          memoryClock: '23 Gbps',
          boostClock: '2550 MHz',
          interface: 'PCIe 4.0',
          outputs: 'HDMI 2.1, DisplayPort 1.4a'
        },
        variants: {
          create: [{
            sku: 'NV-4080S-001',
            price: 999.99,
            compareAtPrice: 1199.99,
            specs: {},
            inventory: {
              create: {
                locationId: defaultLocation.id,
                stock: 23,
                reserved: 0,
                incoming: 0
              }
            }
          }]
        }
      }
    ];

    const createdProducts = [];
    for (const productData of sampleProducts) {
      const product = await prisma.product.create({
        data: productData,
        include: {
          category: true,
          brand: true,
          variants: {
            include: {
              inventory: true
            }
          }
        }
      });
      createdProducts.push(product);
    }

    return NextResponse.json({
      message: 'Sample data created successfully',
      users: [
        { email: adminUser.email, role: adminUser.role },
        { email: testUser.email, role: testUser.role }
      ],
      products: createdProducts.length,
      credentials: {
        admin: 'admin@techzone.com / admin123',
        user: 'user@techzone.com / test123'
      }
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json(
      { error: 'Failed to create sample data', details: error.message },
      { status: 500 }
    );
  }
}
