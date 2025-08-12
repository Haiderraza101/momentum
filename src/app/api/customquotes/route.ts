import { NextResponse } from "next/server";
import { Quotes } from "@/models/quotes";
import { UserFavoriteQuotes } from "@/types/quotes";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: UserFavoriteQuotes = await request.json();
    const result = await Quotes.CustomQuotes(body);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || "Error adding favorite quote",
      },
      { status: 400 }
    );
  }
}
