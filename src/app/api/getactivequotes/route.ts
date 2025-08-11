import { Quotes } from "@/models/quotes";
import { NextResponse } from "next/server";
import { success } from "zod";




export async function GET(request:Request){

  try{
    const {searchParams} = new URL(request.url);
    const userid = Number(searchParams.get('userid'));

    if (!userid){
      return NextResponse.json({
        success:false,
        error:'Missing userid'
      },{
        status:400
      });
    }
    const result = await Quotes.getActiveQuote(userid);

    return NextResponse.json(result,{
      status:200
    });
  }
  catch(error:any){
    return NextResponse.json({
      success:false,error:error.message|| 
      'Internal Server Error'
    },{
      status:400
    })
  }
}