
import { getFile, putFile, config } from "../_github.js";
import { isAuthorized } from "../_auth.js";
function decode(content){return JSON.parse(decodeURIComponent(escape(atob(content.replace(/\n/g,"")))));}
function encode(obj){return btoa(unescape(encodeURIComponent(JSON.stringify(obj,null,2))));}
async function delFile(path,env,sha){
  const c=config(env);
  const r=await fetch(`https://api.github.com/repos/${c.owner}/${c.repo}/contents/${path}`,{
    method:"DELETE",
    headers:{"Accept":"application/vnd.github+json","Authorization":`Bearer ${c.token}`,"X-GitHub-Api-Version":"2022-11-28","Content-Type":"application/json"},
    body:JSON.stringify({message:`Delete image ${path.split("/").pop()}`,sha,branch:c.branch})
  });
  if(!r.ok) throw new Error((await r.json()).message||"GitHub delete failed");
}
export async function onRequestPost({request,env}){
  if (!(await isAuthorized(request,env))) return Response.json({error:"Nicht angemeldet"},{status:401});
  try{
    const {key}=await request.json();
    const old=await getFile("images.json",env);
    const images=decode(old.content);
    const next=images.filter(x=>x.file!==key);
    if(next.length===images.length) return Response.json({error:"Bild nicht gefunden"},{status:404});
    try{
      const img=await getFile(`images/${key}`,env);
      await delFile(`images/${key}`,env,img.sha);
    }catch{}
    await putFile("images.json",encode(next),"Update gallery metadata",old.sha,env);
    return Response.json({ok:true});
  }catch(e){return Response.json({error:e.message},{status:500});}
}
