import { NextResponse } from "next/server";
import { Background } from "@/models/background";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userid = Number(searchParams.get("userid"));

    if (!userid) {
      return NextResponse.json({ success: false, error: "Missing userid" }, { status: 400 });
    }

    const result = await Background.getActiveBackground(userid);

    console.log('-----------The Response',result);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}