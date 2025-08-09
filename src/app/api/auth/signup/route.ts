import { UserSignUp } from "@/types/users";
import { User } from "@/models/users";
import { response } from "@/utils/response";

export async function POST(request:Request):Promise<Response>{

  try{
   const body:UserSignUp= await request.json();
  console.log('Incoming body :',body);
  const result = await User.SignUp(body);

  return response(result,200);
  }

  catch(error:any){
      return response({error:error.message||"Sign Up failed"},400);
  }
  
}