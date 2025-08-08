import { JWTPayload } from "jose";
import { dcrypt, encrypt } from "./jwt";
import { SessionPayload } from "@/types/session";

export async function createSession(userid: number, username: string, email: string, expiry: string) {
  return await encrypt({ userid, username, email }, expiry);
}

export function verifySession(payload: JWTPayload): payload is SessionPayload {
  if (!payload || typeof payload === 'string') {
    throw new Error('Invalid payload');
  }
  if (typeof payload.userid !== 'number' || payload.userid <= 0) {
    throw new Error('Invalid or missing userid in payload');
  }
  if (typeof payload.username !== 'string' || payload.username.length === 0) {
    throw new Error('Invalid or missing username in payload');
  }
  if (typeof payload.email !== 'string' || payload.email.length === 0) {
    throw new Error('Invalid or missing email in payload');
  }
  return true;
}

export async function getSession(request: Request): Promise<SessionPayload> {
  try {
    const session = request.headers.get('Authorization')?.replace('Bearer', '').trim();

    if (!session) {
      throw new Response('Session not found', { status: 401 });
    }

    const payload = await dcrypt(session);

    if (verifySession(payload)) {
      return payload;
    }

    throw new Response('Invalid session data', { status: 401 });

  } catch (error) {
    if (error instanceof Response) {
      throw error; // already has status and message
    }

    const message = error instanceof Error ? error.message : 'Invalid session';
    throw new Response(message, { status: 401 });
  }
}
