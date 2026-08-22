import {requireAdmin,unauthorized} from "../_auth.js";
export async function onRequestPost({request,env}){
  if(!(await requireAdmin(request,env)))return unauthorized();
  const {key}=await request.json().catch(()=>({}));if(!key||key.includes("..")||key.includes("/"))return Response.json({ok:false,error:"Ungültiger Schlüssel"},{status:400});
  await env.MEDIA.delete(key);return Response.json({ok:true});
}
