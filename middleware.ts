import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin API endpoints
  if (pathname.startsWith("/api/v1/admin")) {
    const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-key");
    const cookieRole = request.cookies.get("hf_role")?.value;
    const cookieToken = request.cookies.get("hf_token")?.value;

    const hasAdminAccess =
      (authHeader && (authHeader.includes("admin") || authHeader.startsWith("Bearer hf_jwt_"))) ||
      (cookieRole && cookieRole.toLowerCase() === "admin") ||
      (cookieToken && cookieToken.includes("admin"));

    if (!hasAdminAccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized access. System Administrator authorization token is required.",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/v1/admin/:path*"],
};
