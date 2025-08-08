import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


const publicRoutes = ['/','/login','register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')){
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)){
    return NextResponse.next();
  }

  return NextResponse.next();
}


export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
