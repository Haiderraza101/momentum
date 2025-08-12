import { NextResponse } from "next/server";
import { Background } from "@/models/background";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userid, backgroundid } = body;

    if (!userid || !backgroundid) {
      return NextResponse.json(
        { success: false, error: "Missing userid or backgroundid" },
        { status: 400 }
      );
    }

    const result = await Background.removeFavoriteBackground(userid, backgroundid);

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
