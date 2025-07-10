import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().refine((phone) => {
    if (!phone) return true; // Phone is optional
    // Sri Lankan phone validation - exactly 10 digits starting with 0
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }, "Phone number must be exactly 10 digits starting with 0 (Sri Lankan format)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        password: hashedPassword,
        role: "BUYER",
        loyaltyPoints: 0,
        loyaltyLevel: "Bronze"
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        loyaltyPoints: true,
        loyaltyLevel: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
