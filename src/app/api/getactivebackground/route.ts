import { NextResponse } from "next/server";
import { Background } from "@/models/background";

export async function GET(req: Request):Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const userid = Number(searchParams.get("userid"));

    if (!userid) {
      return NextResponse.json({ success: false, error: "Missing userid" }, { status: 400 });
    }

    const result = await Background.getActiveBackground(userid);

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