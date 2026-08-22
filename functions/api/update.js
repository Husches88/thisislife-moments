
import { getFile, putFile } from "../_github.js";
import { isAuthorized } from "../_auth.js";
function decode(content){return JSON.parse(decodeURIComponent(escape(atob(content.replace(/\n/g,"")))));}
function encode(obj){return btoa(unescape(encodeURIComponent(JSON.stringify(obj,null,2))));}
export async function onRequestPost({request,env}){
  if (!(await isAuthorized(request,env))) return Response.json({error:"Nicht angemeldet"},{status:401});
  try{
    const body=await request.json();
    const old=await getFile("images.json",env);
    const images=decode(old.content);
    const idx=images.findIndex(x=>x.file===body.key);
    if(idx<0) return Response.json({error:"Bild nicht gefunden"},{status:404});
    if(body.hero) images.forEach(x=>x.hero=false);
    images[idx]={...images[idx],title:String(body.title||""),category:String(body.category||"MOMENT"),hero:!!body.hero};
    await putFile("images.json",encode(images),"Update gallery metadata",old.sha,env);
    return Response.json({ok:true});
  }catch(e){return Response.json({error:e.message},{status:500});}
}
