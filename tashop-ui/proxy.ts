import { NextRequest, NextResponse } from "next/server";
import authenticated from "./app/auth/action/authenticated";
import { unauthorizedRoutes } from "./app/common/constants/route";

export async function proxy(request: NextRequest) {
  const isPublicRoute = unauthorizedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route.path)
  );

  const hasSession = await authenticated();

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};