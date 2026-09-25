import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // API routes enforce auth themselves (requireUser()) and return JSON 401s;
  // redirecting them to /login here would hand fetch() callers an HTML page.
  if (isApiRoute) return NextResponse.next();

  if (!isLoggedIn && !isAuthRoute) {
    const url = new URL("/login", req.nextUrl.origin);
    if (req.nextUrl.pathname !== "/") url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
