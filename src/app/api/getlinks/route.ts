import { Links } from "@/models/links";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    if (!userid) {
      return NextResponse.json(
        { success: false, error: "userid is required" },
        { status: 400 }
      );
    }

    const result = await Links.getLinks(Number(userid));
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Internal Server Error", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 400 }
    );
  }
}
