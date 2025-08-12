import { Quotes } from "@/models/quotes";
import { NextResponse } from "next/server";

export async function DELETE(request:Request):Promise<NextResponse>{
  try{
    const body = await request.json();
    const {userid,quoteid}=body;

    if (!userid||!quoteid){
      return NextResponse.json({
        success:false,
        error:'Missing userid or quoteid'
      },{
        status:400
      });
    }

    const result = await Quotes.removeFavoriteQuote(userid,quoteid);

    return NextResponse.json(result,{
      status:200
    });
  }
  catch(error:any){
    return NextResponse.json({
      success:false,
      error:error.message||'Internal Server Error'
    },{
      status:400
    })
  }
}