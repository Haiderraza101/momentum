
import { JWTPayload,SignJWT,jwtVerify } from 'jose';

const secretkey = process.env.JWT_SECRET||"e8fcd86f2d7c41449a9f23f5c69e84a4e03b673c139c47b59883fa2e2c6a7f98";
const expirationtime = process.env.JWT_EXPIRATION||'1d';
export const refreshexpirationtime = process.env.REFRESH_TOKEN_EXPIRATION || '1m';


if (!secretkey){
  throw new Error('JWT secret is not set');
}

const encodedkey = new TextEncoder().encode(secretkey);

export async function encrypt(payload:Record<string,unknown>,expiry:string = expirationtime){
  return new SignJWT(payload)
  .setProtectedHeader({alg:'HS256'})
  .setIssuedAt()
  .setExpirationTime(expiry)
  .sign(encodedkey)
}


function verifypayload(payload: JWTPayload) {
  if (!payload.exp) {
    throw new Error('Missing Expiration Time');
  }
  if (!payload.iat) {
    throw new Error('Missing issue at time');
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error('Token Expired');
  }
  if (payload.iat > now) {
    throw new Error('Token not yet valid');
  }
}

export async function dcrypt(session:string){
  const {payload} = await jwtVerify(session,encodedkey,{
    algorithms:['HS256']
  })
  verifypayload(payload);
  return payload;
}