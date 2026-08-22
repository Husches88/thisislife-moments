export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");
  if (!env.ADMIN_PASSWORD) return new Response("ADMIN_PASSWORD fehlt", {status:500});
  if (password !== env.ADMIN_PASSWORD) return Response.json({ok:false,error:"Falsches Passwort"}, {status:401});
  const exp = Math.floor(Date.now()/1000) + 60*60*24*7;
  const token = await sign(`${exp}.thisislife`, env.ADMIN_PASSWORD);
  return new Response(JSON.stringify({ok:true}), {
    headers: {"Content-Type":"application/json","Set-Cookie":`tl_session=${token}.${exp}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`}
  });
}
async function sign(value, secret){
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
