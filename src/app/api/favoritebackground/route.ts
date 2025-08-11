import { NextResponse } from "next/server";
import { UserFavoriteBackground } from "@/types/background";
import { Background } from "@/models/background";
import { backgroundItem } from "@/types/background";

export async function POST(request:Request):Promise<NextResponse>{

  try{
    const body : UserFavoriteBackground = await request.json();
    const result = await Background.FavoriteBackground(body);
    return NextResponse.json(result,{
      status:200
    });
  }
  catch(error : any){
    return NextResponse.json({
      error:error.message || "Inserting favorite background failed"
    },{
      status:400
    })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("backgroundid");

  if (!idParam) {
    return NextResponse.json(
      { error: "backgroundid is required" },
      { status: 400 }
    );
  }

  const id = Number(idParam);
  if (isNaN(id)) {
    return NextResponse.json(
      { error: "backgroundid must be a valid number" },
      { status: 400 }
    );
  }

  const result:backgroundItem[] = await Background.getFavoriteBackground(id);

  return NextResponse.json(result);
}

