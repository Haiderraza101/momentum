
export interface User{
  id:number,
  username:string,
  email:string
}

export interface UserLogin{
  email:string,
  passwordhash:string
}

export interface UserSignUp{
  username:string,
  email:string,
  passwordhash:string,
  confirmpassword:string,
}
export interface Userwithtoken{
 user:User,
 token:string,
}

export interface UserwithPassword extends User{
  passwordhash:Buffer;
}