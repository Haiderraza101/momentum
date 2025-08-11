import { Quotes } from "@/models/quotes";
import { UserFavoriteQuotes } from "@/types/quotes";
import { Trykker } from "next/font/google";
import { NextResponse } from "next/server";

export async function POST (request:Request):Promise<NextResponse>{

  try{
    const body:UserFavoriteQuotes = await request.json();
    const result = Quotes.FavoriteQuotes(body);
    return NextResponse.json(result,{
      status:200
    });
  }
  catch(error:any){

    return NextResponse.json({
      error:error.message||"Inserting Favorite Quote Failed"
    },{
      status:400
    })
  }

}