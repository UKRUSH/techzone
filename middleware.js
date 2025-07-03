import { NextResponse } from "next/server";

export default function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Temporarily disable auth protection for testing
  // TODO: Re-enable auth protection after fixing NextAuth configuration
  
  // Allow all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/account/:path*", 
    "/pc-builder/:path*",
    "/orders/:path*",
    "/auth/:path*"
  ],
};
