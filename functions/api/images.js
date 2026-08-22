export async function onRequestGet({request,env}){
  const url=new URL(request.url), list=await env.MEDIA.list({limit:1000});
  const images=list.objects.filter(o=>/\.(jpe?g|png|webp|gif|avif)$/i.test(o.key)).map(o=>({
    key:o.key,url:`/media/${encodeURIComponent(o.key)}`,title:o.customMetadata?.title||o.key.replace(/\.[^.]+$/,""),category:o.customMetadata?.category||"MOMENT",hero:o.customMetadata?.hero==="true",uploaded:o.uploaded
  })).sort((a,b)=>{if(a.hero&&!b.hero)return -1;if(!a.hero&&b.hero)return 1;return new Date(b.uploaded)-new Date(a.uploaded)});
  return Response.json({images});
}
