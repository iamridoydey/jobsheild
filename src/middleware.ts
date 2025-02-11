import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // List of protected routes
  const protectedRoutes = ["/dashboard", "/settings", "/add_fraud_company"];

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    // Redirect unauthenticated users to the home page
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
