import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth/config";

const protectedRoutes = [
  { path: "/profile" },
];

const findCurrentRoute = (pathname: string) => {
  return protectedRoutes.find((route) =>
    new RegExp(`^${route.path.replace(/:\w+/g, "\\w+")}$`).test(pathname)
  );
};

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const currentRoute = findCurrentRoute(request.nextUrl.pathname);

  if (currentRoute) {
    if (!session) {
      const absoluteURL = new URL("/signin", request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};