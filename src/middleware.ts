import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


const publicRoutes = ['/login','/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("sessionToken");
  
  if (pathname.startsWith('/api/')){
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)){
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
