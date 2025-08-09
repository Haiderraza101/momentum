import { UserSignUp } from "@/types/users";
import { User } from "@/models/users";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: UserSignUp = await request.json();
    console.log("Incoming body :", body);
    const result = await User.SignUp(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Sign Up failed" },
      { status: 400 }
    );
  }
}
