import { NextResponse } from "next/server";
import { UserFavoriteBackground } from "@/types/background";
import { Background } from "@/models/background";


export async function POST(request:Request):Promise<NextResponse>{

  try{
    const body : UserFavoriteBackground = await request.json();
    console.log("Incoming Body : ",body);
    const result = await Background.FavoriteBackground(body);
    console.log('Route received result:', result);
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