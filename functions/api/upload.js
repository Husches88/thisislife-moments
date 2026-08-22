import {requireAdmin,unauthorized,safeName} from "../_auth.js";
export async function onRequestPost({request,env}){
  if(!(await requireAdmin(request,env)))return unauthorized();
  const form=await request.formData(),files=form.getAll("files"),title=String(form.get("title")||""),category=String(form.get("category")||"MOMENT"),hero=String(form.get("hero")||"false")==="true";
  if(!files.length)return Response.json({ok:false,error:"Keine Bilder"},{status:400});
  const out=[];
  for(const file of files){
    if(!(file instanceof File))continue;
    if(!/^image\/(jpeg|png|webp|gif|avif)$/i.test(file.type))continue;
    if(file.size>25*1024*1024)continue;
    const key=`${Date.now()}-${crypto.randomUUID()}-${safeName(file.name)}`;
    await env.MEDIA.put(key,file.stream(),{httpMetadata:{contentType:file.type,cacheControl:"public, max-age=31536000, immutable"},customMetadata:{title:title||file.name.replace(/\.[^.]+$/,""),category,hero:String(hero)}});
    out.push(key);
  }
  return Response.json({ok:true,uploaded:out});
}
