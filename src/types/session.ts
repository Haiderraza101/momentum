import { JWTPayload } from "jose";

export type SessionPayload = {
  userid:number,
  username:string,
  email:string,
  expiry:number,
  issueat:number
} & JWTPayload


