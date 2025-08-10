import { UserLogin, UserSignUp, UserSignUpwithId } from "@/types/users";
import { Userwithtoken } from "@/types/users";
import { validate, validators } from "@/utils/validator";
import db from '../../lib/db';
import { UserwithPassword } from "@/types/users";
import bcrypt from 'bcrypt';
import { createSession } from "@/utils/session";


export class User{

  public static async SignUp(SignUpData:UserSignUp):Promise<Userwithtoken>{
     
    console.log("Validators object:", {
  username: validators.username,
  email: validators.email,
  passwordhash: validators.passwordhash
});
 console.log('Validators in signup:', validators);
   const [successorfailure, credentialsorerrors] = validate(SignUpData, {
  email: validators.email,
  passwordhash: validators.passwordhash,
  username: validators.username,
});
  if (!successorfailure) {
    const error = credentialsorerrors.issues[0];
    throw new Error(`Error in validation: ${error.message}`);
  }

  const {email,passwordhash,username}=credentialsorerrors;
 
  const saltrounds:number =10;
  const passwordhashing = await bcrypt.hash(passwordhash,saltrounds);


  const query = `
  INSERT INTO Users (username, email, passwordhash)
  VALUES ($1, $2, $3)
  RETURNING id, username, email
`;

const result = await db.query<UserSignUpwithId>(query, [
  username,
  email,
  passwordhashing
]);

if (!result.rows||result.rows.length === 0){
   throw new Error(
    "Failed to Register User"
   );
}

const user = result.rows[0];
console.log(user);

const token = await createSession(user.id,user.username,user.email);


return {
  user,
  token
}

  }


  
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

  return {
    user: userwithoutPassword,
    token,
  };
}
}