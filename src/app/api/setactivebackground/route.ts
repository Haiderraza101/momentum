import { NextResponse } from "next/server";
import { activebackground } from "@/types/background";
import { Background } from "@/models/background";

export async function POST(request:Request):Promise<NextResponse>{

  try{
     const body:activebackground= await request.json();
     const result = await Background.setActiveBackground(body);
     return NextResponse.json(result,{
      status:200
     });
  }
  catch(error:any){
    return NextResponse.json({
      error:error.message || "Error in seting bacground active"
    },{
      status:400
    });
  }
  
}