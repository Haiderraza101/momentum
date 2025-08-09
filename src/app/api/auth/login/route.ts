import { User } from "@/models/users";
import { UserLogin } from "@/types/users";
import { response } from "@/utils/response";

export async function POST(request: Request): Promise<Response> {
  try {
    const body:UserLogin = await request.json();
    console.log("Incoming login body:", body);

    const result = await User.Login(body);
    return response(result, 200);
  } catch (error: any) {
    return response({ error: error.message || "Login failed" }, 400);
  }
}
