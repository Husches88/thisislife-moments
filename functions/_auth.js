export async function requireAdmin(request, env){
  const c=request.headers.get("Cookie")||"",m=c.match(/(?:^|;\s*)tl_session=([^;]+)/);if(!m)return false;
  const parts=m[1].split(".");if(parts.length!==2)return false;const exp=Number(parts[1]);if(!exp||exp<Math.floor(Date.now()/1000))return false;
  return (await sign(`${exp}.thisislife`,env.ADMIN_PASSWORD))===parts[0];
}
async function sign(value,secret){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(value));return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
export function unauthorized(){return Response.json({ok:false,error:"Nicht angemeldet"},{status:401})}
export function safeName(name){return name.replace(/[^a-zA-Z0-9._-]/g,"-").slice(-120)}
