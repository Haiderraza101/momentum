import { validators } from "@/utils/validator"
export interface User{
  id:number,
  username:string,
  email:string
}

export interface UserLogin{
  email:string,
  passwordhash:string
}

export interface Userwithtoken{
 user:User,
 token:string,
 refreshtoken:string
}

export interface UserwithPassword extends User{
  passwordhash:Buffer;
}