import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Mock user storage for development (replace with database when available)
const initialMockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@techzone.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0/nqkOixmu", // admin123
    role: "ADMIN",
    createdAt: new Date()
  },
  {
    id: "2", 
    name: "Test User",
    email: "user@techzone.com",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // test123
    role: "BUYER",
    createdAt: new Date()
  }
];

// Initialize global storage
if (!global.mockUsers) {
  global.mockUsers = [...initialMockUsers];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists in mock storage
    const existingUser = global.mockUsers.find(user => user.email === validatedData.email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user in mock storage
    const newUser = {
      id: (global.mockUsers.length + 1).toString(),
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: "BUYER",
      createdAt: new Date()
    };

    global.mockUsers.push(newUser);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
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
  }
}

// Export function to get all users for NextAuth
export function getAllUsers() {
  if (!global.mockUsers) {
    global.mockUsers = [...initialMockUsers];
  }
  return global.mockUsers;
}
