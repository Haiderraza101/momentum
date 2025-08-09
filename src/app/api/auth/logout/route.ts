import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const expiredCookie = serialize("sessionToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json(
    { message: "Logged out" },
    {
      status: 200,
      headers: {
        "Set-Cookie": expiredCookie,
      },
    }
  );
}
