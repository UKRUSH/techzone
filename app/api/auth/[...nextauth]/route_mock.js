import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Mock user storage (same as in registration route)
const mockUsers = [
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

// Function to get all users (including dynamically registered ones)
function getAllUsers() {
  // In a real app, this would be a database query
  // For now, we'll try to import from the registration route
  try {
    // This is a hack to share data between routes
    if (global.mockUsers) {
      return global.mockUsers;
    }
    return mockUsers;
  } catch {
    return mockUsers;
  }
}

// Function to add a user (for registration)
function addUser(user) {
  if (!global.mockUsers) {
    global.mockUsers = [...mockUsers];
  }
  global.mockUsers.push(user);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const users = getAllUsers();
          const user = users.find(u => u.email === credentials.email);

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, addUser, getAllUsers };
