import { UserLogin } from "@/types/users";
import { Userwithtoken } from "@/types/users";
import { validate, validators } from "@/utils/validator";
import db from '../../lib/db';
import { UserwithPassword } from "@/types/users";
import bcrypt from 'bcrypt';
import { createSession } from "@/utils/session";
import { encrypt} from "@/utils/jwt";
import { refreshexpirationtime } from "@/utils/jwt";


export class User{
  
  public static async Login(loginData: UserLogin): Promise<Userwithtoken> {
  console.log("Login payload", loginData);
  
 
  const [successorfailure, credentialsorerrors] = validate(loginData, {
    email: validators.email,
    passwordhash: validators.passwordhash
  });
  
  if (!successorfailure) {
    const error = credentialsorerrors.issues[0];
    throw new Error(`Error in validation: ${error.message}`);
  }

  const { email, passwordhash } = credentialsorerrors;

  const query = `
    SELECT id, username, email, passwordhash
    FROM users
    WHERE email = $1
  `;

  const result = await db.query<UserwithPassword>(query, [email]);
  const users = result.rows;
  
  if (!users || users.length === 0) {
    throw new Error('Invalid Credentials');
  }

  const user = users[0];

  let passwordMatch = false;
  try {
   
    const storedHash = typeof user.passwordhash === 'string' 
      ? user.passwordhash 
      : user.passwordhash.toString('utf-8');
    
    const inputPassword = passwordhash.trim();
    
    passwordMatch = await bcrypt.compare(inputPassword, storedHash);

     const password = 'Test@1234';
const saltRounds = 10;

async function hashPassword() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Hashed password:', hash);
  } catch (err) {
    console.error('Error hashing password:', err);
  }
}

hashPassword(); 
    console.log(`Comparing "${inputPassword}" with hash:`, storedHash);
    console.log("Password match result:", passwordMatch);
  } catch (err) {
    console.error("Password comparison error:", err);
    throw new Error('Invalid Credentials');
  }

  if (!passwordMatch) {
    throw new Error('Invalid Credentials');
  }

  const { passwordhash: _, ...userwithoutPassword } = user;

  const token = await createSession(user.id, user.username, user.email);
  const refreshtoken = await encrypt(
    { userid: user.id, username: user.username, email: user.email, refresh: true },
    refreshexpirationtime
  );

  return {
    user: userwithoutPassword,
    token,
    refreshtoken
  };
}
  
}