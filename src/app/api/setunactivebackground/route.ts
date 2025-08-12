import { NextResponse } from "next/server";
import { Background } from "@/models/background";
import { activebackground } from "@/types/background";

export async function PUT(req: Request):Promise<NextResponse> {
  try {
    const body: activebackground = await req.json();
    const result = await Background.setInactiveBackground(body);
    return NextResponse.json(result,{
      status:200
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 400 }
    );
  }
}