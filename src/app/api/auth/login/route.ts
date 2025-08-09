import { User } from "@/models/users";
import { UserLogin } from "@/types/users";
import { response } from "@/utils/response";
import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request: Request): Promise<Response> {
  try {
    const body:UserLogin = await request.json();
    console.log("Incoming login body:", body);
    console.log("--------------------Body : ",body);
    const {user,token} = await User.Login(body);
   
    const cookie = serialize("sessionToken",token,{
     httpOnly:true,
     secure:process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
      {user,token},{
        status:200,
        headers:{
          "Set-Cookie":cookie
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error:error.message || "Login Failed"
      },
      {

        status:400
      }
    )
  }
}
