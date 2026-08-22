export async function onRequestGet({params,env}){
  const key=Array.isArray(params.path)?params.path.join("/"):(params.path||"");
  const obj=await env.MEDIA.get(key);if(!obj)return new Response("Not found",{status:404});
  const h=new Headers();obj.writeHttpMetadata(h);h.set("Cache-Control","public, max-age=31536000, immutable");return new Response(obj.body,{headers:h});
}
