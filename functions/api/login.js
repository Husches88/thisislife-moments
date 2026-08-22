
import { makeSession } from "../_auth.js";

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    if (!env.ADMIN_PASSWORD || body.password !== env.ADMIN_PASSWORD) {
      return Response.json({error:"Anmeldung fehlgeschlagen"}, {status:401});
    }
    const session = await makeSession(env);
    return new Response(JSON.stringify({ok:true}), {
      headers:{
        "Content-Type":"application/json",
        "Set-Cookie":`tl_admin=${session}; Max-Age=28800; Path=/; HttpOnly; Secure; SameSite=Strict`
      }
    });
  } catch {
    return Response.json({error:"Ungültige Anfrage"}, {status:400});
  }
}
