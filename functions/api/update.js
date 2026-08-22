import {requireAdmin,unauthorized} from "../_auth.js";
export async function onRequestPost({request,env}){
  if(!(await requireAdmin(request,env)))return unauthorized();
  const {key,title,category,hero}=await request.json().catch(()=>({}));if(!key||key.includes("..")||key.includes("/"))return Response.json({ok:false,error:"Ungültiger Schlüssel"},{status:400});
  const obj=await env.MEDIA.get(key);if(!obj)return Response.json({ok:false,error:"Bild nicht gefunden"},{status:404});
  await env.MEDIA.put(key,obj.body,{httpMetadata:obj.httpMetadata,customMetadata:{...(obj.customMetadata||{}),title:String(title||""),category:String(category||"MOMENT"),hero:String(!!hero)}});
  return Response.json({ok:true});
}
