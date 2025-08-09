import { accountdetails } from "@/types/accountdetails";
import { stringify } from "querystring";

export async function getaccountdetails():Promise<accountdetails|null>{

  const token:string|null= localStorage.getItem('token');
  
  try{
    if (!token){
      throw new Error('No token found');
    }
    

    const [, Payload]= token.split('.');
    const payload:accountdetails= JSON.parse(atob(Payload));
    
    if (payload.expiry*1000 <Date.now()){
      localStorage.removeItem('token');
      throw new Error('Token Expired');
    }
    
    if (!payload.userame || !payload.email){
      localStorage.removeItem('token');
      throw new Error ('Invalid token payload');
    }
    
    return payload;
    
  }

  catch(err){
    const refreshtoken = localStorage.getItem('refreshtoken');

    if (refreshtoken){
      const res = await fetch ('/api/auth/refresh',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({refreshtoken})
      })

      if (!res.ok){
        localStorage.removeItem('token');
        localStorage.removeItem('refreshtoken');
        return null;
      }

      try{
        const data = await res.json();
        localStorage.setItem('token',data.token);
        const newPayload:string = data.token.split('.')[1]
        const newpayload:accountdetails = JSON.parse(atob(newPayload));
        return newpayload;
      }
      catch(err){
        localStorage.removeItem('token');
        localStorage.removeItem('refreshtoken');
      }
    }
    return null;
  }

}
