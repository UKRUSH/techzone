import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  // Server-side guard — only ADMIN role may upload
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId');

    if (!file || !file.name) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed (jpg, png, webp, gif)' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, safeName), buffer);

    const url = `/uploads/products/${safeName}`;

    // If productId is provided, update product images in DB
    if (productId) {
      try {
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { images: true },
        });
        if (product) {
          // New upload goes first; keep old non-placehold.co images
          const existingImages = (product.images || []).filter(
            img => !img.includes('placehold.co') && !img.includes('via.placeholder.com')
          );
          await prisma.product.update({
            where: { id: productId },
            data: { images: [url, ...existingImages] },
          });
        }
      } catch (dbErr) {
        // File saved; DB update failed — return url anyway so the UI can show it
        console.error('DB image update failed:', dbErr.message);
      }
    }

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
