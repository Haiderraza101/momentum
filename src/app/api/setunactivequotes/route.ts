import { Quotes } from "@/models/quotes";
import { activequote } from "@/types/quotes";
import { NextResponse } from "next/server";
import { success } from "zod";

export async function PUT(request:Request):Promise<NextResponse>{
  try{
    const body : activequote = await request.json();
    const result = await Quotes.setInactiveQuote(body);
    return NextResponse.json(result,{
      status:200
    });
  }
  catch(error:any){
    return NextResponse.json({success:false,error:error.message || "Internal Server Error"},{
      status:400
    })
  }
}