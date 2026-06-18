import { NextResponse } from "next/server";

export default function proxy(req) {
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
