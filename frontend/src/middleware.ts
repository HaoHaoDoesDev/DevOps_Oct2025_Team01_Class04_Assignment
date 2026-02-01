import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key",
);

function getRedirectPath(pathname: string, payload: JWTPayload): string | null {
  const userId = String(payload.userId);
  const role = payload.role as string;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return "/";
  }

  if (pathname.startsWith("/user/")) {
    const urlId = pathname.split("/")[2];
    if (urlId !== userId) return `/user/${userId}`;
  }

  if (pathname === "/authentication") {
    return role === "ADMIN" ? `/admin/${userId}` : `/user/${userId}`;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isProtectedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/user");
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/authentication", request.url));
  }

  if (!token) return NextResponse.next();

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const redirectTarget = getRedirectPath(pathname, payload);

    if (redirectTarget) {
      return NextResponse.redirect(new URL(redirectTarget, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("JWT Validation failed:", error);
    } else {
      console.error("Auth Middleware: Invalid or expired session");
    }
    const response = NextResponse.redirect(
      new URL("/authentication", request.url),
    );
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/authentication"],
};
