
export interface User{
  id:number,
  username:string,
  email:string
}

export interface UserLogin{
  email:string,
  passwordhash:string
}

export interface UserSignUpFormData{
  username:string,
  email:string,
  passwordhash:string,
  confirmpassword:string,
} 
export interface UserSignUp{
  username:string,
  email:string,
  passwordhash:string,
}

export interface UserSignUpwithId extends UserSignUp{
  id:number;
}
export interface Userwithtoken{
 user:User,
 token:string,
}

export interface UserwithPassword extends User{
  passwordhash:Buffer;
}

export interface JWTPayload {
  userid:number;
}

export interface JWTPayloadwithUserName extends JWTPayload{
  username:string;
}