import { Links } from "@/models/links";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const result = await Links.getLinks();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Internal Server Error", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 400 }
    );
  }
}
