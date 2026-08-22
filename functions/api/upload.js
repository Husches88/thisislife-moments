
import { getFile, putFile, config } from "../_github.js";
import { isAuthorized } from "../_auth.js";

function base64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i=0;i<bytes.length;i+=chunk) binary += String.fromCharCode(...bytes.subarray(i, i+chunk));
  return btoa(binary);
}
function decode(content) {
  return JSON.parse(decodeURIComponent(escape(atob(content.replace(/\n/g,"")))));
}
function encode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj,null,2))));
}

export async function onRequestPost({request,env}) {
  if (!(await isAuthorized(request,env))) return Response.json({error:"Nicht angemeldet"},{status:401});
  try {
    const form = await request.formData();
    const files = form.getAll("files");
    const title = String(form.get("title") || "");
    const category = String(form.get("category") || "MOMENT");
    const hero = String(form.get("hero") || "false") === "true";
    if (!files.length) return Response.json({error:"Keine Datei"},{status:400});

    let metaFile;
    try { metaFile = await getFile("images.json",env); } catch { metaFile = {content:btoa("[]"), sha:null}; }
    let images = metaFile.content ? decode(metaFile.content) : [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      if (file.size > 20*1024*1024) throw new Error(`${file.name}: maximal 20 MB`);
      if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) throw new Error(`${file.name}: kein unterstütztes Bildformat`);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g,"_");
      const bytes = new Uint8Array(await file.arrayBuffer());
      await putFile(`images/${safeName}`, base64(bytes), `Upload image ${safeName}`, null, env);
      if (hero) images = images.map(x=>({...x,hero:false}));
      images = images.filter(x=>x.file !== safeName);
      images.push({file:safeName,title,category,hero});
    }

    const old = await getFile("images.json",env);
    await putFile("images.json", encode(images), "Update gallery metadata", old.sha, env);

    return Response.json({ok:true,images});
  } catch(e) {
    return Response.json({error:e.message},{status:500});
  }
}
