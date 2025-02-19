import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const protectedRoutes = ["/dashboard"];
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currentPath);

  if (isProtectedRoute) {
    const session = (await cookies()).get("session")?.value;
    const payload = await decrypt(session);
    if (!payload?.userId) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
