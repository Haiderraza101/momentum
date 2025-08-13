import { Links } from "@/models/links";
import { LinksBody } from '../../../types/links';
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: LinksBody & { userid: number } = await request.json();

    if (!body.userid) {
      return NextResponse.json(
        { success: false, error: "userid is required" },
        { status: 400 }
      );
    }

    const result = await Links.sumbitLinks(body);
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('Internal Server Error', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 400 }
    );
  }
}
