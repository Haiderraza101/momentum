import { Quotes } from "@/models/quotes";
import { quoteitem, UserFavoriteQuotes } from "@/types/quotes";
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

export async  function GET(request:Request):Promise<NextResponse>{
  const {searchParams} = new URL(request.url);
  const idParam = searchParams.get('userid');

  if (!idParam){
    return NextResponse.json({
      error:'User is Required'
    },{
      status:400
    });
  }

  const id = Number(idParam);

  const result:quoteitem[] = await Quotes.getFavoriteQuote(id);

  return NextResponse.json(result,{
    status:200
  })
}