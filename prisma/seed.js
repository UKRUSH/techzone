const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Neon PostgreSQL database...');

  // ── Location ──────────────────────────────────────────────────────────────
  const location = await prisma.location.upsert({
    where: { name: 'Main Warehouse' },
    update: {},
    create: { name: 'Main Warehouse', address: 'Colombo 03, Sri Lanka' },
  });
  console.log('✅ Location:', location.name);

  // ── Categories ────────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'CPU',         slug: 'cpu',         description: 'Processors & CPUs' },
    { name: 'GPU',         slug: 'gpu',         description: 'Graphics Cards' },
    { name: 'RAM',         slug: 'ram',         description: 'Memory Modules' },
    { name: 'Storage',     slug: 'storage',     description: 'SSDs & HDDs' },
    { name: 'Motherboard', slug: 'motherboard', description: 'Motherboards' },
    { name: 'PSU',         slug: 'psu',         description: 'Power Supplies' },
    { name: 'Cooling',     slug: 'cooling',     description: 'CPU & Case Cooling' },
    { name: 'Case',        slug: 'case',        description: 'PC Cases & Chassis' },
  ];
  const cats = {};
  for (const c of categoryData) {
    cats[c.slug] = await prisma.category.upsert({
      where: { name: c.name }, update: {}, create: c,
    });
  }
  console.log('✅ Categories:', Object.keys(cats).join(', '));

  // ── Brands ────────────────────────────────────────────────────────────────
  const brandData = [
    'Intel', 'AMD', 'NVIDIA', 'ASUS', 'MSI', 'Corsair',
    'G.Skill', 'Samsung', 'Western Digital', 'NZXT', 'Lian Li',
    'be quiet!', 'Gigabyte', 'Seagate',
  ];
  const brands = {};
  for (const name of brandData) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    brands[name] = await prisma.brand.upsert({
      where: { name }, update: {}, create: { name, slug },
    });
  }
  console.log('✅ Brands:', brandData.join(', '));

  // ── Products ──────────────────────────────────────────────────────────────
  const products = [
    {
      name: 'Intel Core i9-13900K',
      description: "Intel's flagship 24-core (8P+16E) desktop processor. Exceptional gaming and content creation performance with up to 5.8 GHz boost clock.",
      cat: 'cpu', brand: 'Intel',
      images: ['https://placehold.co/400x400/1e3a5f/60a5fa?text=i9-13900K'],
      tags: ['gaming', 'flagship', 'overclock'],
      sku: 'INT-I9-13900K', price: 109900, compareAtPrice: 129900, stock: 12,
    },
    {
      name: 'AMD Ryzen 9 7950X',
      description: '16-core, 32-thread AM5 processor built on 5nm Zen 4. Best-in-class for content creation and workstation tasks.',
      cat: 'cpu', brand: 'AMD',
      images: ['https://placehold.co/400x400/450a0a/f87171?text=Ryzen+7950X'],
      tags: ['workstation', 'creator', 'am5'],
      sku: 'AMD-R9-7950X', price: 129900, compareAtPrice: 149900, stock: 9,
    },
    {
      name: 'Intel Core i5-13600K',
      description: 'Best mid-range CPU for gaming. 14-core (6P+8E) with PCIe 5.0 and DDR5 support. Outstanding price-to-performance.',
      cat: 'cpu', brand: 'Intel',
      images: ['https://placehold.co/400x400/1e3a5f/93c5fd?text=i5-13600K'],
      tags: ['gaming', 'value', 'mid-range'],
      sku: 'INT-I5-13600K', price: 54900, compareAtPrice: 64900, stock: 20,
    },
    {
      name: 'NVIDIA GeForce RTX 4090',
      description: "NVIDIA's most powerful GPU. 24GB GDDR6X Ada Lovelace. Dominates 4K gaming and AI workloads.",
      cat: 'gpu', brand: 'NVIDIA',
      images: ['https://placehold.co/400x400/0f172a/22d3ee?text=RTX+4090'],
      tags: ['4k', 'flagship', 'ray-tracing', 'ai'],
      sku: 'NV-RTX4090', price: 289900, compareAtPrice: 319900, stock: 8,
    },
    {
      name: 'MSI GeForce RTX 4080 Super',
      description: '16GB GDDR6X with DLSS 3.5 and Frame Generation. Exceptional 4K gaming performance.',
      cat: 'gpu', brand: 'MSI',
      images: ['https://placehold.co/400x400/0f172a/a78bfa?text=RTX+4080S'],
      tags: ['4k', 'dlss', 'gaming'],
      sku: 'MSI-RTX4080S', price: 179900, compareAtPrice: 199900, stock: 5,
    },
    {
      name: 'ASUS ROG STRIX RTX 4070 Ti',
      description: '12GB GDDR6X GPU. Excellent 1440p and solid 4K with DLSS 3. Triple-fan ROG Strix cooler.',
      cat: 'gpu', brand: 'ASUS',
      images: ['https://placehold.co/400x400/0f172a/34d399?text=RTX+4070Ti'],
      tags: ['1440p', 'gaming', 'rog'],
      sku: 'ASUS-RTX4070TI', price: 124900, compareAtPrice: 139900, stock: 14,
    },
    {
      name: 'Corsair Vengeance DDR5-5600 32GB',
      description: '2x16GB DDR5-5600 MHz kit optimised for Intel XMP 3.0 and AMD EXPO.',
      cat: 'ram', brand: 'Corsair',
      images: ['https://placehold.co/400x400/3b0764/c084fc?text=DDR5+32GB'],
      tags: ['ddr5', 'xmp', 'expo'],
      sku: 'CRS-DDR5-5600-32', price: 59900, compareAtPrice: null, stock: 30,
    },
    {
      name: 'G.Skill Trident Z5 RGB 64GB',
      description: '2x32GB DDR5-6000 CL30 kit with RGB lighting for high-end builds on Z790 and X670E.',
      cat: 'ram', brand: 'G.Skill',
      images: ['https://placehold.co/400x400/2e1065/e879f9?text=Z5+RGB+64GB'],
      tags: ['ddr5', 'rgb', 'high-speed'],
      sku: 'GSK-Z5RGB-64', price: 79900, compareAtPrice: null, stock: 18,
    },
    {
      name: 'Samsung 990 Pro 2TB NVMe',
      description: 'PCIe 4.0 NVMe SSD. Up to 7,450 MB/s read, 6,900 MB/s write. Ideal for gaming and creative work.',
      cat: 'storage', brand: 'Samsung',
      images: ['https://placehold.co/400x400/14532d/4ade80?text=990+PRO'],
      tags: ['nvme', 'pcie4', 'fast'],
      sku: 'SAM-990PRO-2TB', price: 42900, compareAtPrice: 54900, stock: 25,
    },
    {
      name: 'WD Black SN850X 1TB',
      description: 'PCIe 4.0 NVMe SSD for gaming. 7,300 MB/s read with Game Mode 2.0. PS5 compatible.',
      cat: 'storage', brand: 'Western Digital',
      images: ['https://placehold.co/400x400/052e16/86efac?text=SN850X'],
      tags: ['nvme', 'gaming', 'ps5'],
      sku: 'WD-SN850X-1TB', price: 19900, compareAtPrice: 24900, stock: 40,
    },
    {
      name: 'ASUS ROG Strix X670-E Gaming WiFi',
      description: 'Premium AM5 board with PCIe 5.0 M.2, DDR5, WiFi 6E and 2.5G LAN for Ryzen 7000.',
      cat: 'motherboard', brand: 'ASUS',
      images: ['https://placehold.co/400x400/431407/fb923c?text=ROG+X670-E'],
      tags: ['am5', 'ddr5', 'wifi6e', 'rog'],
      sku: 'ASUS-X670E-ROG', price: 89900, compareAtPrice: 99900, stock: 7,
    },
    {
      name: 'MSI MAG Z790 Tomahawk WiFi',
      description: 'Mid-range Z790 for Intel LGA1700. DDR5, PCIe 5.0 M.2, WiFi 6E and strong VRM for i9/i7.',
      cat: 'motherboard', brand: 'MSI',
      images: ['https://placehold.co/400x400/431407/fcd34d?text=Z790+Tomahawk'],
      tags: ['lga1700', 'ddr5', 'wifi6e'],
      sku: 'MSI-Z790-TOMAHAWK', price: 64900, compareAtPrice: 74900, stock: 11,
    },
    {
      name: 'Corsair RM1000x 80+ Gold',
      description: '1000W fully modular PSU. 80 Plus Gold, ultra-quiet fan, 10-year warranty.',
      cat: 'psu', brand: 'Corsair',
      images: ['https://placehold.co/400x400/1c1917/f59e0b?text=RM1000x'],
      tags: ['modular', 'gold', '1000w'],
      sku: 'CRS-RM1000X', price: 34900, compareAtPrice: 39900, stock: 22,
    },
    {
      name: "be quiet! Straight Power 850W Platinum",
      description: '850W fully modular 80 Plus Platinum PSU. Near-silent, premium build, 10-year warranty.',
      cat: 'psu', brand: 'be quiet!',
      images: ['https://placehold.co/400x400/1c1917/e2e8f0?text=Straight+850W'],
      tags: ['modular', 'platinum', '850w'],
      sku: 'BEQ-SP850-PLAT', price: 32900, compareAtPrice: null, stock: 15,
    },
    {
      name: 'NZXT Kraken 360 RGB AIO',
      description: '360mm AIO with three 120mm Aer RGB fans and LCD pump head. AM5 and LGA1700 compatible.',
      cat: 'cooling', brand: 'NZXT',
      images: ['https://placehold.co/400x400/0c4a6e/38bdf8?text=Kraken+360'],
      tags: ['aio', '360mm', 'rgb', 'lcd'],
      sku: 'NZXT-KRAKEN360-RGB', price: 34900, compareAtPrice: 39900, stock: 10,
    },
    {
      name: "be quiet! Dark Rock Pro 5",
      description: 'Dual-tower air cooler. 250W TDP, two Silent Wings fans. LGA1700 and AM5 compatible.',
      cat: 'cooling', brand: 'be quiet!',
      images: ['https://placehold.co/400x400/0c4a6e/cbd5e1?text=Dark+Rock+Pro'],
      tags: ['air-cooler', 'dual-tower', 'silent'],
      sku: 'BEQ-DRP5', price: 18900, compareAtPrice: 22900, stock: 17,
    },
    {
      name: 'Lian Li O11 Dynamic EVO XL',
      description: 'E-ATX case supporting dual 360mm radiators and up to 10 fans. Modular panoramic glass.',
      cat: 'case', brand: 'Lian Li',
      images: ['https://placehold.co/400x400/1e293b/94a3b8?text=O11+EVO+XL'],
      tags: ['eatx', 'dual-360', 'modular'],
      sku: 'LL-O11DEVOXL', price: 29900, compareAtPrice: null, stock: 6,
    },
    {
      name: 'NZXT H9 Flow Mid Tower',
      description: 'Dual-chamber design with panoramic tempered glass and excellent airflow. Fits ATX and 360mm AIO.',
      cat: 'case', brand: 'NZXT',
      images: ['https://placehold.co/400x400/1e293b/6ee7b7?text=H9+Flow'],
      tags: ['atx', 'airflow', 'glass'],
      sku: 'NZXT-H9FLOW', price: 22900, compareAtPrice: 26900, stock: 9,
    },
  ];

  let created = 0;
  for (const p of products) {
    const { sku, price, compareAtPrice, stock, cat, brand, ...fields } = p;
    const exists = await prisma.product.findFirst({ where: { name: fields.name } });
    if (exists) { console.log(`⏭  Skip (exists): ${fields.name}`); continue; }

    await prisma.product.create({
      data: {
        ...fields,
        categoryId: cats[cat].id,
        brandId: brands[brand].id,
        variants: {
          create: [{
            sku,
            price,
            compareAtPrice: compareAtPrice ?? null,
            attributes: {},
            inventoryLevels: {
              create: [{ locationId: location.id, stock, reserved: 0, incoming: 0 }],
            },
          }],
        },
      },
    });
    console.log(`✅ Created: ${fields.name}`);
    created++;
  }

  // ── Admin user ─────────────────────────────────────────────────────────────
  const hashedPw = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@techzone.lk' },
    update: {},
    create: {
      name: 'TechZone Admin',
      email: 'admin@techzone.lk',
      password: hashedPw,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin: admin@techzone.lk / admin123');

  console.log(`\n🎉 Done — ${created} products seeded into Neon.`);
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
