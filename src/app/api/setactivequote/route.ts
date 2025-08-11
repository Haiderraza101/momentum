import { Quotes } from "@/models/quotes";
import { activequote } from "@/types/quotes";
import { NextResponse } from "next/server";



export async function PUT(request:Request):Promise<NextResponse>{

  try{
    const body : activequote = await request.json();
    const result = await Quotes.setActiveQuote(body);
    return NextResponse.json(result,{
      status:200
    }); 
  } 
  catch(error:any){
    return NextResponse.json({
      error:error.message|| "Error in setting quote active "
    },{
      status:400
    })
  }
}