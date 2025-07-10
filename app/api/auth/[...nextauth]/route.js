import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔐 NextAuth authorize called with:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          console.log("🔍 Looking for user in database...");
          
          // Find user in database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            console.log("❌ User not found");
            return null;
          }

          console.log("✅ User found:", { id: user.id, email: user.email, name: user.name });

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log("❌ Invalid password");
            return null;
          }

          console.log("✅ Password valid, returning user");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("❌ Auth error:", error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔑 JWT callback - token:", token, "user:", user);
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("📊 Session callback - session:", session, "token:", token);
      if (token) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
